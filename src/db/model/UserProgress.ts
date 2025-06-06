import { Field, Int, ObjectType } from "type-graphql"
import { BaseEntity, Column, Entity, In, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@ObjectType()
@Entity("UserProgress")
export default class UserProgress extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => Int!)
    UserProgressID: number

    @Column()
    @Field(() => String!)
    UserProgress: string
}