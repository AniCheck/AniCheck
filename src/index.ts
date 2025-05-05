import log, { error } from 'fancy-log'
import { buildSchema } from 'type-graphql'
import express from 'express'
import * as asc from 'apollo-server-core'
import { ApolloServer } from 'apollo-server'

async function startEndPoint() {
    log("Building schema")
    const schema = await buildSchema({resolvers})
    log("initializing express")
    const app = express() //REST server
    app.set("trust proxy", true)
    log("initializing apollo server")
    const server = new ApolloServer({
        schema, context:(ctx:context) =>{return ctx}, plugins:[asc.ApolloServerPluginLandingPageLocalDefault()] //querry
    })
    await server.start()
    log("Server started.Applying Middleware")
    server.applyMiddleware({app})
    app.listen({port:8080}, ()=>{log("App is listening on http://localhost:8080/graphql")})
    
    //TO BE DONE connect to db
    log("System to be initialized")
}
startEndPoint().catch((error)=>{log.error(error)})
