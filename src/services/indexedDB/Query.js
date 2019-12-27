class Query {
  constructor (connection, table) {
    this.connection = connection
    this.table = table
  }

  async bulkInsert (items = []) {
    let transaction = this.connection.transaction(this.table, 'readwrite')
    let store = transaction.objectStore(this.table)

    try {
      for (let i in items) {
        await this.create(items[i], store)
      }
      console.log(`Insert ${this.table}!`)
    } catch (error) {
      transaction.abort()
      console.error(`Error Create ${this.table}!`, error)
    }
  }

  create (data, store) {
    if (!store) {
      let transaction = this.connection.transaction(this.table, 'readwrite')
      store = transaction.objectStore(this.table)
    }
    return new Promise((resolve, reject) => {
      let request = store.add(data)

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  getAll () {
    let transaction = this.connection.transaction(this.table, 'readonly')
    let store = transaction.objectStore(this.table)

    return new Promise((resolve, reject) => {
      let request = store.getAll()

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }

  find (data, index = '') {
    console.log('find', data, index, this.table)
    let transaction = this.connection.transaction(this.table, 'readonly')
    let store = transaction.objectStore(this.table)
    index = store.index(index)

    return new Promise((resolve, reject) => {
      let request = index.getAll(data)

      request.onsuccess = () => {
        if (request.result !== undefined) {
          resolve(request.result)
        } else {
          resolve([])
        }
      }

      request.onerror = () => {
        reject(request.error)
      }
    })
  }
}

export default Query
