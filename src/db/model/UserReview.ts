import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "./User";

@Entity("UserReview")
export default class UserReview extends BaseEntity{
    @PrimaryGeneratedColumn()
    UserReviewID: number
 
    @Column()
    Rating: number
 
    @Column()
    Review: string
 
    @Column({nullable: true})
    MangaID: number
 
    @Column({nullable: true})
    AnimeID: number

    @ManyToOne(() => User, {eager: true})
    @JoinColumn({name: "UserID"})
    User:User
}