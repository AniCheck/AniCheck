import { BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import UserReview from "./UserReview";
import AnimeEntry from "./AnimeEntry";
import MangaEntry from "./MangaEntry";

@Entity("User")
export default class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    UserID: number

    @Column()
    Token: string

    @Column({unique: true})
    ProfilePic: string

    @Column()
    UserName: string

    @Column({nullable: true})
    TitlePref?: string

    @OneToMany(() => UserReview, (Review) => Review.User)
    Reviews: UserReview[]

    @ManyToMany(() => AnimeEntry, {eager:true})
    AnimeEntries: AnimeEntry[]

    @ManyToMany(() => MangaEntry, {eager:true})
    MangaEntries: MangaEntry[]
}