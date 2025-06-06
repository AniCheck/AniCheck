import { InputType, Field, Int } from "type-graphql"

@InputType()
export class UpdateMangaEntryInput {
    @Field(() => Int)
    mangaId!: number

    @Field(() => Int, { nullable: true })
    progress?: number
}
