<template>
  <section>
    <div
      class="search"
      :class="{ stick: stick }">
      <div class="search-container grid grid-search">
        <form @submit.prevent="buscar" class="input-container">
          <input
            id="search-input"
            type="search"
            class="search-input"
            maxlength="20"
            autocomplete="off"
            autofocus
            @keydown="alpha($event)"
            placeholder="Escribe el nombre o número de un himno"
            v-model="search">
          <ul
            id="himnos"
            class="search-items"
            v-show="filtrado.length">
            <li
              v-for="(item, index) in filtrado"
              :key="item.id"
              class="search-item">
              <a
                :data-index="index"
                :data-number="item.number"
                href="#"
                :class="{ active: index === 0 }"
                @click.prevent="mostrar(item.number)">{{ item.number }}. {{ item.title }}</a>
            </li>
          </ul>
        </form>
        <div class="btn-actions">
          <button
            type="button"
            class="btn"
            title="Reproducir"
            @click="playAndPause"><i :class="iconAudio"></i></button>
          <button
            type="button"
            class="btn"
            title="Reducir"
            @click="zoomIn"
            :disabled="zoom === zoomMin"
          >
            <i class="icon-zoom-out"></i>
          </button>
          <button
            type="button"
            class="btn"
            title="Ampliar"
            @click="zoomOut"
            :disabled="zoom === zoomMax"
          >
            <i class="icon-zoom-in"></i>
          </button>
          <button
            type="button"
            @click="fullscreenAction"
            title="Ampliar/disminuir pantalla"
            class="btn btn-fullscreen">
            <i class="icon-fullscreen-in"></i>
            <i class="icon-fullscreen-out"></i>
          </button>
          <button
            type="button"
            class="btn"
            :disabled="number === 1 || number === 0"
            title="Anterior"
            @click="prev"><i class="icon-arrow-left"></i>
          </button>
          <button
            type="button"
            class="btn"
            :disabled="number === himnos.length"
            title="Siguiente"
            @click="next"><i class="icon-arrow-right"></i>
          </button>
        </div>
      </div>
      <div class="audio-play">
        <div class="audio-playback">
          <div class="audio-playback-state" v-if="showState" :style="{ 'width': porcentaje + '%' }"></div>
        </div>
        <div class="audio-state">
          {{ currentTime }} / {{ formatTime(duration) }}
        </div>
      </div>
    </div>
    <div class="preview">
      <img
        :src="image"
        class="image image-1"
        :class="classZoom"
        v-if="image"
        alt="preview" />
      <img
        :src="image2"
        class="image image-2"
        :class="classZoom"
        v-if="image2"
        alt="preview 2" />
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import time from '@/lib/time'
import util from '@/lib/util'

// const url = process.env.BASE_URL
const url = 'http://localhost:4000/'

export default {
  mixins: [ time, util ],
  data () {
    return {
      himnos: [],
      search: '',
      image: null,
      image2: null,
      limit: 10,
      number: 0,
      play: false,
      urlMp3: null,
      audio: null,
      duration: 0,
      current: 0,
      timeInterval: null,
      porcentaje: 0,
      showState: false,
      zoom: 960,
      zoomStep: 100,
      zoomMin: 300,
      zoomMax: 1800,
      xDown: null,
      yDown: null,
      stick: false
    }
  },
  components: {},
  created () {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  mounted () {
    this.loadHimnos()
    this.events()
    setTimeout(() => {
      this.mostrar(1)
      document.querySelector('#search-input').focus()
    }, 1000)

    // Fullscreen event and hack mozilla
    document.addEventListener('onkeyup', function (e) {
      if (e.keyCode === 27) {
        document.querySelector('body').classList.remove('fullscreen')
      }
    })

    document.addEventListener('mozfullscreenchange', function () {
      if (!document.mozFullScreen) {
        document.querySelector('body').classList.remove('fullscreen')
      }
    }, false)
  },
  methods: {
    fullscreenAction () {
      document.querySelector('body').classList.toggle('fullscreen')
      this.fullscreen()
    },
    alpha (e) {
      if ([171, 173].indexOf(e.keyCode) !== -1) {
        e.preventDefault()
        return false
      }
    },
    loadHimnos () {
      axios.get(`${url}api-rest/himnos?limit=1000`)
        .then(response => {
          this.himnos = response.data
        })
    },
    events () {
      document.addEventListener('keyup', e => {
        let key = e.keyCode
        console.log(e.keyCode, e)
        if (key === 37) { // left
          this.prev()
        }
        if (key === 39) { // right
          this.next()
        }
        if (key === 27) { // Escape
          this.search = ''
        }
        if (key === 171) { // zoom +
          this.zoomOut()
        }
        if (key === 173) { // zoom -
          this.zoomIn()
        }
        if (key === 38) { // up
          this.upSelect()
        }
        if (key === 40) { // down
          this.downSelect()
        }
      })

      document.addEventListener('touchstart', this.handleTouchStart, false)
      document.addEventListener('touchmove', this.handleTouchMove, false)
    },
    upSelect () {
      let himnos = document.querySelector('#himnos')
      let active = himnos.querySelector('.active')
      if (active) {
        let number = parseInt(active.getAttribute('data-index')) - 1
        active.classList.remove('active')
        if (number < 0) {
          number = this.filtrado.length - 1
        }
        let select = himnos.querySelector(`[data-index="${number}"]`)
        if (select) {
          select.classList.add('active')
        }
      }
    },
    downSelect () {
      let himnos = document.querySelector('#himnos')
      let active = himnos.querySelector('.active')
      if (active) {
        let number = parseInt(active.getAttribute('data-index')) + 1
        active.classList.remove('active')
        if (number >= this.filtrado.length) {
          number = 0
        }
        let select = himnos.querySelector(`[data-index="${number}"]`)
        if (select) {
          select.classList.add('active')
        }
      }
    },
    resetTrack () {
      this.pause()
      this.audio = null
      this.current = 0
      this.duration = 0
      this.porcentaje = 0
      this.showState = false
      this.$nextTick(() => {
        this.showState = true
      })
    },
    playTrack () {
      if (this.audio) {
        this.audio.play()
        this.play = true
        this.current = this.audio.currentTime
        this.timeInterval = setInterval(() => {
          this.duration = this.audio.duration
          this.current = this.audio.currentTime
          this.porcentaje = this.audio.currentTime * 100 / this.duration
          console.log('porcentaje', this.porcentaje)
          if (this.porcentaje >= 100) {
            this.resetTrack()
          }
        }, 1000)
      }
    },
    pause () {
      if (this.audio) {
        this.audio.pause()
        this.play = false
        this.porcentaje = this.audio.currentTime * 100 / this.duration
        if (this.timeInterval) {
          clearInterval(this.timeInterval)
        }
        this.timeInterval = null
      }
    },
    playAndPause () {
      if (!this.audio) {
        let file = (this.number + '').padStart(3, '0')
        this.urlMp3 = `${url}mp3/${file}.mp3`
        this.audio = new Audio(this.urlMp3)
        this.porcentaje = 1
        this.playTrack()
        console.log('mp3', this.urlMp3)
      } else {
        if (!this.play) {
          this.playTrack()
        } else {
          this.pause()
        }
      }
    },
    mostrar (number) {
      if (number < 1) {
        number = 1
      }
      if (number > this.himnos.length) {
        number = this.himnos.length
      }
      this.number = number
      this.showState = false
      axios.get(`${url}api/read-image/${number}`)
        .then(response => {
          if (response.data) {
            this.image = null
            this.image2 = null
            this.search = ''
            this.urlMp3 = null
            this.showState = true
            this.$nextTick(() => {
              let file = (this.number + '').padStart(3, '0')
              this.urlMp3 = `${url}mp3/${file}.mp3`
              this.resetTrack()
              this.zoom = 960
              if (response.data.image1) {
                this.image = response.data.image1
                this.image2 = response.data.image2
              } else {
                this.image = response.data.image
                this.image2 = null
              }
            })
          }
        })
    },
    buscar () {
      let himnos = document.querySelector('#himnos')
      let active = himnos.querySelector('.active')
      if (active) {
        let number = parseInt(active.getAttribute('data-number'))
        this.mostrar(number)
      }
    },
    next () {
      this.mostrar(this.number + 1)
    },
    prev () {
      this.mostrar(this.number - 1)
    },
    zoomIn () {
      if (this.zoom > this.zoomMin) {
        this.zoom -= this.zoomStep
      }
    },
    zoomOut () {
      if (this.zoom < this.zoomMax) {
        this.zoom += this.zoomStep
      }
    },
    getTouches (evt) {
      return evt.touches || evt.originalEvent.touches // browser API | jQuery
    },
    handleTouchStart (evt) {
      this.xDown = this.getTouches(evt)[0].clientX
      this.yDown = this.getTouches(evt)[0].clientY
    },
    handleTouchMove (evt) {
      if (!this.xDown || !this.yDown) {
        return
      }

      let xUp = evt.touches[0].clientX
      let yUp = evt.touches[0].clientY

      let xDiff = this.xDown - xUp
      let yDiff = this.yDown - yUp

      if (Math.abs(xDiff) > Math.abs(yDiff)) { /* most significant */
        if (xDiff > 0) {
          this.next()
        } else {
          this.prev()
        }
      } else {
        if (yDiff > 0) {
          /* up swipe */
          console.log('swipe up')
        } else {
          /* down swipe */
          console.log('swipe down')
        }
      }
      /* reset values */
      this.xDown = null
      this.yDown = null
    },
    handleScroll () {
      this.stick = window.scrollY > 60
    }
  },
  computed: {
    classZoom () {
      return `zoom-${this.zoom}`
    },
    iconAudio () {
      if (this.audio) {
        return this.play ? 'icon-pause active' : 'icon-play'
      }
      return 'icon-play'
    },
    currentTime () {
      return this.formatTime(this.current)
    },
    filtrado () {
      if (this.search.length) {
        let items = this.himnos.filter(el => (el.title.toLowerCase().indexOf(this.search.toLowerCase()) > -1 || (el.number + '').toLowerCase().indexOf(this.search.toLowerCase()) > -1))
        items.splice(this.limit)
        return items
      }
      return []
    }
  }
}
</script>

<style lang="scss" src="./notas.scss"></style>
