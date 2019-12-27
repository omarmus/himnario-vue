<template>
  <section class="himno" v-if="detalle">
    <detalle></detalle>
    <div
      v-for="detalle in letra"
      :key="detalle.id"
      class="himno-estrofa"
      :class="classZoom">
      <strong v-if="detalle.type === 'STROPHE'">{{ detalle.order }}. </strong>
      <strong v-else><em>Coro: </em><br></strong>
      <span
        v-if="detalle.type === 'STROPHE'"
        v-html="detalle.content">
      </span>
      <strong
        v-else
        v-html="detalle.content"
        class="himno-coro">
      </strong>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import Detalle from './Detalle'

const url = process.env.API_URL

export default {
  props: {
    db: {
      type: Object,
      default: () => {}
    },
    number: {
      type: Number,
      default: 0
    },
    himnos: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      letra: [],
      detalle: null,
      zoom: 4,
      zoomStep: 1,
      zoomMin: 1,
      zoomMax: 7
    }
  },
  mounted () {
    if (this.number) {
      this.cargarHimno(this.number)
    }
  },
  methods: {
    async cargarHimno (number) {
      this.detalle = this.himnos.filter(item => item.number === number)[0]
      let himno = {
        detalle: this.detalle
      }
      if (this.db && this.db.detail) {
        let letra = await this.db.detail.find(number, 'id_hymn')
        letra.map(item => {
          item.content = item.content.replace(/\n/gi, '<br />')
          return item
        })
        this.letra = letra
        himno.letra = letra
        this.$store.commit('setHimno', himno)
        this.$storage.set('himno', this.himno)
        this.$store.commit('hideLoading')
      } else {
        this.$store.commit('showLoading', `Cargando himno #${number}`)
        axios.get(`${url}api/detalle/${number}`)
          .then(response => {
            let letra = response.data
            letra.map(item => {
              item.content = item.content.replace(/\n/gi, '<br />')
              return item
            })
            this.letra = letra
            himno.letra = letra
            this.$store.commit('setHimno', himno)
            this.$storage.set('himno', this.himno)
            this.$store.commit('hideLoading')
          })
      }
    },
    zoomIn () {
      console.log('zoomIn', this.zoom, this.classZoom)
      if (this.zoom > this.zoomMin) {
        this.zoom -= this.zoomStep
      }
    },
    zoomOut () {
      console.log('zoomOut', this.zoom, this.classZoom)
      if (this.zoom < this.zoomMax) {
        this.zoom += this.zoomStep
      }
    }
  },
  computed: {
    classZoom () {
      return `zoom-n-${this.zoom}`
    }
  },
  watch: {
    '$store.state.action' (val) {
      if (val) {
        if (val === 'zoomNIn') {
          this.zoomIn()
        } else if (val === 'zoomNOut') {
          this.zoomOut()
        }
        this.$store.commit('setAction', null)
      }
    }
  },
  components: {
    Detalle
  }
}
</script>

<style lang="scss">
.himno {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  background-color: #ffffff;
  padding: 30px;
  min-height: 100%;
  // height: 100%;
}

.himno-estrofa {
  margin-bottom: 15px;
}

.grid {
  &.grid-detalle {
    grid-template-columns: 1fr 1fr;
  }
}

.himno-coro {
  font-style: italic;
}

.zoom-n-1 {
  font-size: 0.7rem;
}

.zoom-n-2 {
  font-size: 0.8rem;
}

.zoom-n-3 {
  font-size: 0.9rem;
}

.zoom-n-4 {
  font-size: 1rem;
}

.zoom-n-5 {
  font-size: 1.2rem;
}

.zoom-n-6 {
  font-size: 1.4rem;
}

.zoom-n-7 {
  font-size: 1.6rem;
}

@media (max-width: 768px) {
  .himno-title {
    font-size: 1.2rem;
  }
}
</style>
