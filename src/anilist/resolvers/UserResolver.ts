import { ApolloError } from "apollo-server-express";
import { signJwt } from "../../utils/jwt";
import User from "../../db/model/User";
import { Arg, Ctx, Field, Int, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { hashPassword, verifyPassword } from "../../utils/PassHash";
import AnimeEntry from "../../db/model/AnimeEntry";
import Context from "../../utils/context";
import { In } from "typeorm";
import UserProgress from "../../db/model/UserProgress";

@Resolver()
export default class UserResolver {
    // LOGIN
    @Mutation(() => String)
    async login(
        @Arg('username') username: string,
        @Arg('password') password: string,

    ) {
        var user: User | null = await User.findOne({
            where: {
                UserName: username
            }
        });

        if (!user)
            throw new ApolloError("User does not exist!");
        if (!verifyPassword(password, user.PasswordHash))
            throw new ApolloError("Passwords do not match")
        const token = signJwt({ id: user.UserID } as object);

        return token;
    }

    //REGISTER, bus naudojimas is mutation
    @Mutation(() => User)
    async register(
        @Arg('username') username: string,
        @Arg('password') password: string,
        @Arg('profilePic', { nullable: true }) pic?: string,


    ) {
        const hash = hashPassword(password)
        const user = new User();
        user.UserName = username;
        user.PasswordHash = hash;
        user.ProfilePic = pic;

        const dbUser = User.save(user);
        return dbUser

    }
    @Query(() => [UserMediaEntry!]!)
    async getUserMediaList(@Ctx() Ctx: Context): Promise<UserMediaEntry[]> {
        if (!Ctx.user) throw new ApolloError("Not authenticated")

        const user = Ctx.user
        const entries: UserMediaEntry[] = []

        const AnimeEntries = user.AnimeEntries.map((AnimeEntry) => {
            const userEntry = new UserMediaEntry()
            userEntry.id = AnimeEntry.AnimeEntryID
            userEntry.mediaType = "ANIME"
            userEntry.mediaId = AnimeEntry.AnimeID
            userEntry.progressStatus = AnimeEntry.UserProgress
            userEntry.rating = AnimeEntry.Rating
            return userEntry
        })
        entries.push(...AnimeEntries)



        const MangaEntries = user.MangaEntries.map((MangaEntry) => {
            const userEntry = new UserMediaEntry()
            userEntry.id = MangaEntry.MangaEntryID
            userEntry.mediaType = "ANIME"
            userEntry.mediaId = MangaEntry.MangaID
            userEntry.progressStatus = MangaEntry.UserProgress
            userEntry.rating = MangaEntry.Rating
            return userEntry
        })
        entries.push(...MangaEntries)

        return entries.sort((a, b) => b.rating - a.rating)
    }
}

@ObjectType()
class UserMediaEntry {
    @Field(() => Int!)
    id: number

    @Field(() => Int!)
    mediaId: number

    @Field(() => String!)
    mediaType: string

    @Field(() => UserProgress!)
    progressStatus: UserProgress

    @Field(() => Int!)
    rating: number
}
