import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import UserProgress from "./UserProgress"
import User from "./User"


@Entity("AnimeEntry")
export default class AnimeEntry extends BaseEntity{
    @PrimaryGeneratedColumn()
    AnimeEntryID: number

    @Column()
    AnimeID: number

    @ManyToOne(() => User, (User) => User.AnimeEntries, {})
    User: User
    
    @Column()
    Rating: number

    @ManyToOne(() => UserProgress, {eager: true})
    @JoinColumn({name: "UserProgressID"})
    UserProgress: UserProgress
}