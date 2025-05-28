import { DataSource } from "typeorm"
import User from "./model/User"
import UserReview from "./model/UserReview"
import UserProgress from "./model/UserProgress"
import AnimeEntry from "./model/AnimeEntry"
import MangaEntry from "./model/MangaEntry"

export async function connectToDB(){
    try {
        console.log("importing tables")
        const appDataSource = new DataSource({
            type:"mysql",
            host:"localhost",
            port:3306,
            username:"anicheck",
            password:"123456",
            synchronize:true,
            entities:[User, UserReview, UserProgress, AnimeEntry, MangaEntry]
        })
        await appDataSource.initialize()
        console.log("database initialized")
    }    
    catch(error){
        console.error(error)
        process.exit(1)
    }
}