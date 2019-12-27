import Query from './indexedDB/Query'

class Hymn extends Query {
  constructor (connection) {
    super(connection, 'hymns')
  }
}

export default Hymn
