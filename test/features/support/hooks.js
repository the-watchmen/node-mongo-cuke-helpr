import debug from 'debug'
import {getDb} from '@watchmen/mongo-helpr'
import {initDb} from '@watchmen/mongo-test-helpr'
import {defineSupportCode} from 'cucumber'

const dbg = debug('test:support:hooks')
dbg('loaded hooks')

defineSupportCode(function({Before}) {
  Before(async function() {
    try {
      dbg('before: this=%j', this)
      const db = await getDb()
      await initDb(db)
    } catch (err) {
      dbg('before: caught=%o', err)
      throw err
    }
  })
})
