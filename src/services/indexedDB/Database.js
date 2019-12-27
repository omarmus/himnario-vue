class Database {
  constructor (database, version = 1, migrations) {
    this.database = database
    this.version = version
    this.migrations = migrations
  }

  connect () {
    return new Promise((resolve, reject) => {
      let request = window.indexedDB.open(this.database, this.version)

      request.onupgradeneeded = () => {
        let db = request.result
        if (typeof this.migrations === 'function') {
          this.migrations(db, db.version)
        }
      }

      request.onerror = () => {
        console.error('Error connect DB', request.error)
        reject(request.error)
      }

      request.onsuccess = () => {
        let db = request.result
        // continue to work with database using db object, return connection
        resolve(db)
      }
    })
  }
}

export default Database
