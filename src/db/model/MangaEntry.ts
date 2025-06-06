import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import UserProgress from "./UserProgress"
import User from "./User"
import { Field, Int, ObjectType } from "type-graphql"

@ObjectType()
@Entity("MangaEntry")
export default class MangaEntry extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => Int!)
    MangaEntryID: number

    @Column()
    @Field(() => Int!)
    MangaID: number

    @ManyToOne(() => User, (User) => User.MangaEntries, {})
    @Field(() => User!)
    User: User

    @Column()
    @Field(() => Int!)
    Rating: number

    @ManyToOne(() => UserProgress, { eager: true })
    @JoinColumn({ name: "UserProgressID" })
    @Field(() => UserProgress!)
    UserProgress: UserProgress
}