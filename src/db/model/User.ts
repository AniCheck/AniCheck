import { BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import UserReview from "./UserReview";
import AnimeEntry from "./AnimeEntry";
import MangaEntry from "./MangaEntry";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity("User")
export default class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => Int!)
    UserID: number

    @Column()
    @Field(() => String!)
    PasswordHash: string

    @Column({ unique: true, nullable: true })
    @Field(() => String)
    ProfilePic?: string

    @Column()
    @Field(() => String!)
    UserName: string

    @Column({ nullable: true })
    @Field(() => String)
    TitlePref?: string

    @OneToMany(() => UserReview, (Review) => Review.User)
    @Field(() => [UserReview!]!)
    Reviews: UserReview[]

    @OneToMany(() => AnimeEntry, (Entry) => Entry.User, { eager: true })
    @Field(() => [AnimeEntry!]!)
    AnimeEntries: AnimeEntry[]

    @OneToMany(() => MangaEntry, (Entry) => Entry.User, { eager: true })
    @Field(() => [MangaEntry!]!)
    MangaEntries: MangaEntry[]
}