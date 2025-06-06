import { InputType, Field, Int } from "type-graphql"

@InputType()
export class UpdateAnimeEntryInput {
  @Field(() => Int)
  animeId!: number

  @Field(() => Int, { nullable: true })
  progress?: number
}
