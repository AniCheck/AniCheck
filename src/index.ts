import 'reflect-metadata'
import log from 'fancy-log'
import { buildSchema } from 'type-graphql'
import express from 'express'
import * as asc from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import { AnimeResolver } from './anilist/resolvers/AnimeResolver'
import { MangaResolver } from './anilist/resolvers/MangaResolver'
import Context from './utils/context'
import User from './db/model/User'
import { verifyJwt } from './utils/jwt'
import UserResolver from './anilist/resolvers/UserResolver'
import { connectToDB } from './db/mysql'
import UserProgress from './db/model/UserProgress'



async function startEndPoint() {
log("Connecting to database")
    await connectToDB()

    if(await UserProgress.count() == 0) {
        const entries = ["PLANNING", "WATCHING", "PAUSED", "DROPPED", "COMPLETED"];

        entries.forEach(async entry => {
            const newEntry = new UserProgress();

            newEntry.UserProgress = entry;
            await UserProgress.save(newEntry);
        })
    }
    log("Building schema")
    const schema = await buildSchema({ resolvers: [AnimeResolver, MangaResolver, UserResolver] })

    log("initializing express")
    const app = express() //REST server
    app.set("trust proxy", true)

    log("initializing apollo server")
    const server = new ApolloServer({
        schema,
        context: async (ctx: Context) => {
            if (!ctx.req.headers.token)
                return ctx; //bus token verify

            var user = verifyJwt<{ id: number }>(ctx.req.headers.token as string);

            if (!user)
                return ctx;

            ctx.user = await User.findOneBy({ UserID: user.id })

            return ctx;
        },
        plugins: [asc.ApolloServerPluginLandingPageLocalDefault()] //query
    })

    await server.start()
    log("Server started.Applying Middleware")
    server.applyMiddleware({ app })

    app.listen({ port: 8080 }, () => { log("App is listening on http://localhost:8080/graphql") })

    //TO BE DONE connect to db
    log("System to be initialized")
}
startEndPoint().catch((error) => { log.error(error) })