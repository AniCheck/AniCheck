import { Resolver, Query, Arg, ObjectType, Field, Int, Mutation, Ctx } from 'type-graphql'
import { fetchManga, searchManga } from '../fetchManga'
import { ApolloError } from 'apollo-server-express'
import Context from '../../utils/context'
import { UpdateMangaEntryInput } from '../inputs/UpdateMangaEntryInput'
import MangaEntry from '../../db/model/MangaEntry'
import UserProgress from '../../db/model/UserProgress'
import UserReview from '../../db/model/UserReview'



@ObjectType()
class MangaTitle {
    @Field()
    romaji!: string

    @Field({ nullable: true })
    english?: string
}

@ObjectType()
class Manga {
    @Field(() => Int)
    id!: number

    @Field(() => MangaTitle)
    title!: MangaTitle

    @Field(() => Int, { nullable: true })
    chapters?: number

    @Field(() => String)
    status!: string

    @Field(() => [UserReview!])
    userReviews: UserReview[]
}

@Resolver()
export class MangaResolver {
    @Query(() => Manga)
    async getManga(@Arg("id", () => Int) id: number): Promise<Manga> {
        const mangaRes = await fetchManga(id);

        const manga = {
            id: mangaRes.id,
            title: mangaRes.title,
            status: mangaRes.status,
            chapters: mangaRes.chapters,
            userReviews: await UserReview.find({
                where: {
                    MangaID: mangaRes.id
                }
            })
        } as Manga

        return manga
    }

    @Query(() => [Manga!])
    async Manga(@Arg("name", () => String) name: string): Promise<Manga[]> {
        var mangaList = await searchManga(name)
        const reviewList = await UserReview.find()

        const newList = mangaList.map(mangaRes => {
            const manga = {
                id: mangaRes.id,
                title: mangaRes.title,
                status: mangaRes.status,
                chapters: mangaRes.chapters,
                userReviews: reviewList.filter(review => review.MangaID === mangaRes.id)
            } as Manga
            return manga
        })

        return newList;
    }

    @Mutation(() => Boolean)
    async updateMangaEntry(
        @Arg("data") data: UpdateMangaEntryInput, @Ctx() Ctx: Context
    ): Promise<boolean> {

        if (!Ctx.user)
            throw new ApolloError("You are not logged in")

        var entry = await MangaEntry.findOne({
            where: { User: Ctx.user, MangaID: data.mangaId }
        })

        if (!entry) {
            entry = new MangaEntry()
            entry.User = Ctx.user
            entry.MangaID = data.mangaId

        }

        if (data.progress !== undefined) {
            var userProgress = await UserProgress.findOne({ where: { UserProgressID: data.progress } })
            if (!userProgress)
                throw new ApolloError('Invalid input')

            entry.UserProgress = userProgress
        }

        if (data.rating !== undefined) {
            entry.Rating = data.rating
        }

        await MangaEntry.save(entry)
        return true
    }

    @Mutation(() => Boolean)
    async addMangaReview(
        @Arg("mangaid", () => Int) mangaid: number,
        @Arg("review", () => String) mangaReview: string,
        @Arg("rating", () => Int) mangaRating: number,
        @Ctx() Ctx: Context
    ): Promise<boolean> {

        if (!Ctx.user) throw new ApolloError("Login was invalid")

        const newReview = new UserReview()
        newReview.MangaID = mangaid
        newReview.Rating = mangaRating
        newReview.Review = mangaReview
        newReview.User = Ctx.user

        UserReview.save(newReview)
        return true
    }

    @Query(() => [MangaEntry])
    async getTrackedManga(@Ctx() Ctx: Context): Promise<MangaEntry[]> {
        if (!Ctx.user) throw new ApolloError("Not authenticated")
        return Ctx.user.MangaEntries
    }
}
