require('dotenv').config()

import express from 'express'
import next from 'next'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'

const { PORT = '3000', NODE_ENV = 'development' } = process.env
const port = parseInt(PORT, 10) || 3000
const dev = NODE_ENV !== 'production'

console.log('Running env; ' + NODE_ENV)

const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()

nextApp.prepare().then(async () => {
  const server = express()

  //security
  server.use(
    helmet({
      contentSecurityPolicy: false,
    })
  )
  // Generate logs
  server.use(
    morgan(':method :url :status :res[content-length] - :response-time ms')
  )
  server.use(compression())

  server.get('*', (req: any, res: any) => handle(req, res))
  // express().use(handler).listen(3000) //routes handle way
  //@ts-ignore
  server.listen(port, (err) => {
    if (err) throw err
  })
})
