import Query from './indexedDB/Query'

class Detail extends Query {
  constructor (connection) {
    super(connection, 'details')
  }
}

export default Detail
