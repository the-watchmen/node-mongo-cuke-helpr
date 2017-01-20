import debug from 'debug'
import {getDb} from 'mongo-helpr'
import {initDb} from 'mongo-test-helpr'

/* eslint-disable new-cap */

const dbg = debug('test:support:hooks')
dbg('loaded hooks')

export default function () {
  // this === World
  this.Before(async function (scenario) {
    try {
      dbg('before: scenario=%o', scenario.getName())
      const db = await getDb()
      await initDb(db)
    } catch (err) {
      dbg('before: caught=%o', err)
      throw err
    }
  })
}
