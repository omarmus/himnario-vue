<template>
  <section :class="{ 'close-search': !openSearch }">
    <div
      class="search"
      :class="{ stick: stick }">
      <div class="search-container grid grid-search">
        <form @submit.prevent="buscar" class="input-container">
          <input
            id="search-input"
            type="search"
            class="search-input input-round"
            maxlength="20"
            autocomplete="off"
            autofocus
            @keydown="alpha($event)"
            placeholder="Escribe el nombre o número de himno a buscar"
            v-model="search" />
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
            class="btn btn-icon"
            title="Reproducir"
            @click="playAndPause"><i :class="iconAudio"></i></button>
          <button
            type="button"
            class="btn btn-icon"
            title="Reducir"
            @click="zoomIn"
            :disabled="(zoom <= zoomMin && $store.state.tipo === 'NOTAS') || $store.state.tipo === 'DIAPOSITIVAS'"
          >
            <i class="icon-zoom-out"></i>
          </button>
          <button
            type="button"
            class="btn btn-icon"
            title="Ampliar"
            @click="zoomOut"
            :disabled="(zoom >= zoomMax && $store.state.tipo === 'NOTAS') || $store.state.tipo === 'DIAPOSITIVAS'"
          >
            <i class="icon-zoom-in"></i>
          </button>
          <button
            type="button"
            @click="fullscreenAction"
            title="Ampliar/disminuir pantalla"
            class="btn btn-icon btn-fullscreen">
            <i class="icon-enlarge"></i>
            <i class="icon-shrink"></i>
          </button>
          <button
            type="button"
            class="btn btn-icon"
            :disabled="number === 1 || number === 0"
            title="Anterior"
            @click="prev"><i class="icon-arrow-left"></i>
          </button>
          <button
            type="button"
            class="btn btn-icon"
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
      <div
        class="open-search"
        @click="openSearchEvent">
        <i class="icon-play"></i>
        <!-- {{ openSearch ? 'Ocultar' : 'Mostrar' }} -->
      </div>
    </div>
    <div class="preview">
      <diapositivas
        v-if="showHimno"
        v-show="$store.state.tipo === 'DIAPOSITIVAS'">
      </diapositivas>
      <letras
        :db="db"
        :number="number"
        :himnos="himnos"
        v-if="showHimno"
        v-show="$store.state.tipo === 'LETRAS'">
      </letras>
      <div v-show="$store.state.tipo === 'NOTAS'">
        <img
          :src="image"
          class="image image-1"
          :class="classZoom"
          v-if="image"
          alt="Cargando..." />
        <img
          :src="image2"
          class="image image-2"
          :class="classZoom"
          v-if="image2"
          alt="" />
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import time from '@/lib/time'
import util from '@/lib/util'
import Letras from '@/components/Letras'
import Diapositivas from '@/components/Diapositivas'
import db from '../services/db'

const url = process.env.API_URL

const zoom = [1860, 1760, 1660, 1560, 1460, 1360, 1260, 1160, 1060, 960, 860, 760, 660, 560, 460, 360, 260]

export default {
  mixins: [ time, util ],
  data () {
    return {
      showHimno: false,
      himnos: [],
      search: '',
      image: null,
      image2: null,
      limit: 10,
      number: 1,
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
      stick: false,
      openSearch: true,
      db: null
    }
  },
  components: {
    Letras,
    Diapositivas
  },
  created () {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  mounted () {
    this.events()
    this.initDatabase()
  },
  methods: {
    async initDatabase () {
      try {
        this.db = await db.init()
        this.loadHimnos()
      } catch (error) {
        console.error('Error init database!', error)
        this.loadHimnos()
      }
    },
    openSearchEvent () {
      this.openSearch = !this.openSearch

      if (this.openSearch) {
        document.getElementById('search-input').focus()
      }
    },
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
    async loadHimnosServicio () {
      try {
        this.$store.commit('showLoading', 'Cargando himnos')
        let result = await axios.get(`${url}api-rest/himnos?limit=1000`)
        this.$store.commit('hideLoading')
        this.himnos = result.data
        if (this.db) {
          await this.db.hymn.bulkInsert(result.data)
        }
        this.loadEstrofas()
      } catch (e) {
        console.log('Error get hymns', e.message)
      }
    },
    async loadHimnos () {
      if (this.db) {
        let hymns = await this.db.hymn.getAll()
        if (hymns.length) {
          this.himnos = hymns
          this.loadEstrofas()
        } else {
          await this.loadHimnosServicio()
        }
      } else {
        await this.loadHimnosServicio()
      }
    },
    async loadEstrofas () {
      if (this.db) {
        let estrofas = await this.db.detail.getAll()
        if (estrofas.length === 0) {
          try {
            this.$store.commit('showLoading', 'Completando carga de himnos')
            let result = await axios.get(`${url}api-rest/details?limit=5000`)
            this.$store.commit('hideLoading')
            await this.db.detail.bulkInsert(result.data)
            // console.log('get details', result.data)
          } catch (e) {
            console.log('Error get details', e.message)
          }
        }
      }
      // Mostrando el primer himno
      this.mostrar(1)
    },
    events () {
      document.addEventListener('keyup', e => {
        let key = e.keyCode
        if (key === 37) { // left
          this.prev()
        }
        if (key === 39) { // right
          this.next()
        }
        if (key === 27) { // Escape
          this.search = ''
        }
        if (key === 171 || key === 187) { // zoom +
          this.zoomOut()
        }
        if (key === 173 || key === 189) { // zoom -
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

      setTimeout(() => {
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
    searchHimno (number) {
      for (let i in this.himnos) {
        if (this.himnos[i].number === number) {
          return this.himnos[i]
        }
      }
      return false
    },
    mostrar (number = 1) {
      if (number < 1) {
        number = 1
      }
      if (number > this.himnos.length) {
        number = this.himnos.length
      }
      this.showHimno = false
      this.showState = false
      this.$store.commit('showLoading')
      let himno = this.searchHimno(number)
      this.image = null
      this.image2 = null
      this.search = ''
      this.urlMp3 = null

      this.$nextTick(() => {
        this.number = number
        this.showHimno = true

        this.$store.commit('hideLoading')
        this.showState = true
        let file = (this.number + '').padStart(3, '0')
        if (himno.pages === 1) {
          this.image = `${url}scores/${file}.png`
        } else {
          this.image = `${url}scores/${file}a.png`
          this.image2 = `${url}scores/${file}b.png`

          const width = document.body.getBoundingClientRect().width / 2
          for (let i in zoom) {
            if (width > zoom[i]) {
              break
            }
          }
        }
        this.urlMp3 = `${url}mp3/${file}.mp3`
        this.resetTrack()
        this.zoom = 960
        this.$store.commit('setPosition', 0)
        this.openSearch = false
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
      if (this.$store.state.tipo === 'LETRAS') {
        this.$store.commit('setAction', 'zoomNIn')
      } else {
        if (this.zoom > this.zoomMin) {
          this.zoom -= this.zoomStep
        }
      }
    },
    zoomOut () {
      if (this.$store.state.tipo === 'LETRAS') {
        this.$store.commit('setAction', 'zoomNOut')
      } else {
        if (this.zoom < this.zoomMax) {
          this.zoom += this.zoomStep
        }
      }
    },
    getTouches (e) {
      return e.touches || e.originalEvent.touches // browser API | jQuery
    },
    handleTouchStart (e) {
      this.xDown = this.getTouches(e)[0].clientX
      this.yDown = this.getTouches(e)[0].clientY

      // console.log('start', this.xDown, this.yDown)
    },
    handleTouchMove (e) {
      if (!this.xDown || !this.yDown) {
        return
      }

      let xUp = e.touches[0].clientX
      let yUp = e.touches[0].clientY

      let xDiff = this.xDown - xUp
      let yDiff = this.yDown - yUp

      // console.log('move', xDiff, yDiff)

      if (Math.abs(xDiff) > Math.abs(yDiff)) { /* most significant */
        const width = document.body.getBoundingClientRect().width
        if (xDiff > 0) {
          if (this.xDown > width - width / 4) {
            this.next()
          }
        } else {
          if (this.xDown < width / 4) {
            this.prev()
          }
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
      let widthMin = window.outerWidth > 768 ? 60 : 48
      this.stick = window.scrollY > widthMin
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

<style lang="scss" src="./buscador.scss"></style>
