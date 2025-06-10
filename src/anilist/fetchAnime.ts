import { GraphQLClient, gql } from 'graphql-request'

const endpoint = 'https://graphql.anilist.co'
const graphQLClient = new GraphQLClient(endpoint)

const GET_ANIME = gql`
  query GetAnime($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title {
        romaji
        english
        }
    episodes
    status
    }
}
`;

const SEARCH_ANIME = gql`
query SearchAnime($name: String) {
  Page(page: 1, perPage: 50) {
    media(search: $name, type: ANIME) {
      id
      title {
        romaji
        english
      }
      episodes
      status
    }
  }
}
`;


type AnimeResponse = {
  Media: {
    id: number
    title: {
      romaji: string
      english: string | null
    };
    episodes: number
    status: string
  };
};

type AnimeArrayResponse = {
  Page: {
    media: {
      id: number
      title: {
        romaji: string
        english: string | null
      }
      episodes: number
      status: string
    }[]
  }
};

export async function fetchAnime(id: number) {
  const variables = { id }
  const data = await graphQLClient.request<AnimeResponse>(GET_ANIME, variables)
  return data.Media
}

export async function searchAnime(name: string) {
  const variables = { name }
  const data = await graphQLClient.request<AnimeArrayResponse>(SEARCH_ANIME, variables)
  return data.Page.media
}