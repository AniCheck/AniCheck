import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import UserProgress from "./UserProgress"


@Entity("MangaEntry")
export default class MangaEntry extends BaseEntity{
    @PrimaryGeneratedColumn()
    MangaEntryID: number

    @Column()
    Rating: number

    @ManyToOne(() => UserProgress, {eager: true})
    @JoinColumn({name: "UserProgressID"})
    UserProgress: UserProgress
}