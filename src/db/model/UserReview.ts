import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "./User";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity("UserReview")
export default class UserReview extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => Int!)
    UserReviewID: number

    @Column()
    @Field(() => Int!)
    Rating: number

    @Column()
    @Field(() => String!)
    Review: string

    @Column({ nullable: true })
    @Field(() => Int, { nullable: true })
    MangaID?: number

    @Column({ nullable: true })
    @Field(() => Int, { nullable: true })
    AnimeID?: number

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: "UserID" })
    @Field(() => User!)
    User: User
}