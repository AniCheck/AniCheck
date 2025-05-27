import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import UserReview from "./UserReview";

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
}