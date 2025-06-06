import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import UserProgress from "./UserProgress"
import User from "./User"
import { Field, Int, ObjectType } from "type-graphql"

@ObjectType()
@Entity("AnimeEntry")
export default class AnimeEntry extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => Int!)
    AnimeEntryID: number

    @Column()
    @Field(() => Int!)
    AnimeID: number

    @ManyToOne(() => User, (User) => User.AnimeEntries, {})
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