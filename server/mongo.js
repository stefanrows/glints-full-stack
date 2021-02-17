require('dotenv').config()

const MongoClient = require('mongodb')

let client
async function getMongoCollection() {
  client = await MongoClient.connect(process.env.MONGO, {
    bufferMaxEntries: 0,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    appname: 'glints-open-hours',
  })

  return client.db().collection('restaurants')
}

async function closeClient() {
  if (!client) return

  await client.close()
}
module.exports = {
  getMongoCollection,
  async closeClient() {
    await client.close()
  },
}
