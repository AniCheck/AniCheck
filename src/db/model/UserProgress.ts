import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity("UserProgress")
export default class UserProgress extends BaseEntity{
    @PrimaryGeneratedColumn()
    UserProgressID: number

    @Column()
    UserProgress: string
}