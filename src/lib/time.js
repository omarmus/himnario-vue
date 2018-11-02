export default {
  methods: {
    formatTime (time) {
      time = Math.floor(time)
      if (time === 0) {
        return '00:00'
      }
      if (time < 60) {
        return `00:${(time + '').padStart(2, '0')}`
      } else {
        return (Math.floor(time / 60) + '').padStart(2, '0') + ':' + ((time % 60) + '').padStart(2, '0')
      }
    }
  }
}
