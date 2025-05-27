import { DataSource } from "typeorm"

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
            entities:
        })
        await appDataSource.initialize()
        console.log("database initialized")
    }    
    catch(error){
        console.error(error)
        process.exit(1)
    }
}