import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import UserProgress from "./UserProgress"


@Entity("AnimeEntry")
export default class AnimeEntry extends BaseEntity{
    @PrimaryGeneratedColumn()
    AnimeEntryID: number

    @Column()
    Rating: number

    @ManyToOne(() => UserProgress, {eager: true})
    @JoinColumn({name: "UserProgressID"})
    UserProgress: UserProgress
}