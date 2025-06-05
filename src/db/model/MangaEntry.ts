import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import UserProgress from "./UserProgress"
import User from "./User"


@Entity("MangaEntry")
export default class MangaEntry extends BaseEntity{
    @PrimaryGeneratedColumn()
    MangaEntryID: number

    @Column()
    MangaID: number

    @ManyToOne(() => User, (User) => User.MangaEntries, {})
    User: User

    @Column()
    Rating: number

    @ManyToOne(() => UserProgress, {eager: true})
    @JoinColumn({name: "UserProgressID"})
    UserProgress: UserProgress
}