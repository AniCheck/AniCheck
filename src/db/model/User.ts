import { BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import UserReview from "./UserReview";
import AnimeEntry from "./AnimeEntry";
import MangaEntry from "./MangaEntry";

@Entity("User")
export default class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    UserID: number

    @Column()
    PasswordHash: string

    @Column({unique: true, nullable: true})
    ProfilePic?: string

    @Column()
    UserName: string

    @Column({nullable: true})
    TitlePref?: string

    @OneToMany(() => UserReview, (Review) => Review.User)
    Reviews: UserReview[]

    @OneToMany(() => AnimeEntry, (Entry) => Entry.User, {eager:true})
    AnimeEntries: AnimeEntry[]

    @OneToMany(() => MangaEntry, (Entry) => Entry.User, {eager:true})
    MangaEntries: MangaEntry[]
}