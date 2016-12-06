import debug from 'debug'
import assert from 'assert'
import {asTemplate, evalInContext, isLike, setState, getRequiredState} from 'test-helpr'
import {getDb, createIndices} from 'mongo-helpr'
import {stringify, diffConsole} from 'helpr'

const dbg = debug('test:document:steps')

export default function(context) {
  return function(){
    this.Given(
      /^the following documents exist in the '([^']+)' collection:$/,
      async function (collectionNameString, docsString) {
        try {
          const collectionName = evalInContext({js: asTemplate(collectionNameString), context})
          const docs = evalInContext({js: docsString, context})
          dbg('given-docs-exist: collection=%o, docs=%o', collectionName, docs)
          const db = await getDb()
          const bulk = db.collection(collectionName).initializeUnorderedBulkOp()
          docs.map((elt)=>{
            bulk.insert(elt)
          })
          const result = await bulk.execute()
          assert(result.ok)
          dbg('given-docs-exist: inserted=%o', result.nInserted)
        } catch (error) {
          dbg('given-docs-exist: caught error=%o', error)
          throw error
        }
      }
    )

    this.Given(
      /^the following indices exist on the '([^']+)' collection:$/,
      async function (collectionNameString, indicesString) {
        try {
          const collectionName = evalInContext({js: asTemplate(collectionNameString), context})
          const indices = evalInContext({js: indicesString, context})
          dbg('given-indices-exist: collection=%o, indices=%o', collectionName, indices)
          const db = await getDb()
          createIndices(indices, {collectionName, db})
        } catch (error) {
          dbg('given-indices-exist: caught error=%o', error)
          throw error
        }
      }
    )

    this.Then(
      /^mongo query "([^"]+)" on '([^']+)' should be like:$/,
      async function (queryString, collectionNameString, expectedString) {
        const collectionName = evalInContext({js: asTemplate(collectionNameString), context})
        const query = evalInContext({js: queryString, context})
        const expected = evalInContext({js: expectedString, context})
        dbg('then-mongo-query-should-be-like: query=%o, expected=%s', query, JSON.stringify(expected))
        const db = await getDb()
        const actual = await db.collection(collectionName).find(query).toArray()
        dbg('actual=%s', stringify(actual))
        if (!isLike({expected, actual})) {
          diffConsole({actual, expected})
          throw new Error('actual != expected')
        }
      }
    )

    this.When(
      /^the following aggregation steps execute on the '([^']+)' collection:$/,
      async function (collectionNameString, stepsString) {
        const collectionName = evalInContext({js: asTemplate(collectionNameString), context})
        const steps = evalInContext({js: stepsString, context})
        dbg('when-aggregation-executes-on: collection=%o, steps=%s', collectionName, JSON.stringify(steps))
        const db = await getDb()
        const result = await db.collection(collectionName).aggregate(steps).toArray()
        dbg('result=%s', stringify(result))
        setState({result})
      }
    )

    this.Then(
      /^the result should be like:$/,
      async function (expectedString) {
        const expected = evalInContext({js: expectedString, context})
        dbg('the-result-should-be-like: expectedString=%s', JSON.stringify(expected))
        const actual = getRequiredState('result')
        if (!isLike({expected, actual})) {
          diffConsole({actual, expected})
          throw new Error('actual != expected')
        }
      }
    )
  }
}
