import Database from './indexedDB/Database'
import Hymn from './Hymn'
import Detail from './Detail'

function migrations (db, version) {
  switch (version) {
    case 1: // Primera versión
      if (!db.objectStoreNames.contains('hymns')) { // if there's no "hymns" store
        db.createObjectStore('hymns', { keyPath: 'id' }) // create it
      }
      if (!db.objectStoreNames.contains('details')) { // if there's no "details" store
        let details = db.createObjectStore('details', { keyPath: 'id' }) // create it
        details.createIndex('id_hymn', 'id_hymn')
      }
  }
}

async function init () {
  const dbname = 'himnario'
  const version = 1

  let db = new Database(dbname, version, migrations)
  let conn = await db.connect()

  return {
    hymn: new Hymn(conn),
    detail: new Detail(conn)
  }
}

export default {
  init
}
