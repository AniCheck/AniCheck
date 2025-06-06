import { Resolver, Query, Arg, ObjectType, Field, Int, Mutation, Ctx } from 'type-graphql'
import { fetchAnime, searchAnime } from "../fetchAnime"
import AnimeEntry from "../../db/model/AnimeEntry"
import { UpdateAnimeEntryInput } from '../inputs/UpdateAnimeEntryInput'
import Context from '../../utils/context'
import { ApolloError } from 'apollo-server-express'
import UserProgress from '../../db/model/UserProgress'
import User from '../../db/model/User'
import UserReview from '../../db/model/UserReview'

@ObjectType()
class AnimeTitle {
  @Field()
  romaji!: string

  @Field({ nullable: true })
  english?: string
}

@ObjectType()
class Anime {
  @Field(() => Int)
  id!: number

  @Field(() => AnimeTitle)
  title!: AnimeTitle

  @Field(() => Int)
  episodes!: number

  @Field(() => String)
  status!: string

  @Field(() => [UserReview!]!)
  userReviews!: UserReview[]
}

@Resolver()
export class AnimeResolver {
  @Query(() => Anime)
  async getAnime(@Arg("id", () => Int) id: number): Promise<Anime> {
    const anime = await fetchAnime(id) as Anime
    anime.userReviews = await UserReview.find({
      where: {
        AnimeID: anime.id
      }
    })
    return anime
  }

  @Query(() => [Anime!]!)
  async Anime(@Arg("name", () => String) name: string): Promise<Anime[]> {
    var animeList = await searchAnime(name) as Anime[]
    const reviewList = await UserReview.find()
    animeList = animeList.map(anime => {
      anime.userReviews = reviewList.filter(review => review.AnimeID === anime.id)
      return anime
    })
    return animeList
  }

  @Mutation(() => Boolean)
  async updateAnimeEntry(
    @Arg("data") data: UpdateAnimeEntryInput, @Ctx() Ctx: Context
  ): Promise<boolean> {

    if (!Ctx.user)
      throw new ApolloError("You are not logged in")

    var entry = await AnimeEntry.findOne({
      where: { User: Ctx.user, AnimeID: data.animeId }
    })

    if (!entry) {
      entry = new AnimeEntry()
      entry.User = Ctx.user
      entry.AnimeID = data.animeId
    }

    if (data.progress !== undefined) {
      var userProgress = await UserProgress.findOne({ where: { UserProgressID: data.progress } })
      if (!userProgress)
        throw new ApolloError('Invalid input')

      entry.UserProgress = userProgress
    }

    await AnimeEntry.save(entry)
    return true
  }

  @Mutation(() => Boolean)
  async addAnimeReview(
    @Arg("animeid", () => Int) animeid: number,
    @Arg("review", () => String) animeReview: string,
    @Arg("rating", () => Int) animeRating: number,
    @Ctx() Ctx: Context
  ): Promise<boolean> {

    if (!Ctx.user) throw new ApolloError("Login was invalid")

    const newReview = new UserReview()
    newReview.AnimeID = animeid
    newReview.Rating = animeRating
    newReview.Review = animeReview
    newReview.User = Ctx.user

    UserReview.save(newReview)
    return true
  }

  @Query(() => [AnimeEntry])
  async getTrackedAnime(@Ctx() Ctx: Context): Promise<AnimeEntry[]> {
    if (!Ctx.user) throw new ApolloError("Not authenticated")
    return Ctx.user.AnimeEntries
  }
}