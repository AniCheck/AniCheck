import { GraphQLClient, gql } from 'graphql-request'


const endpoint = 'https://graphql.anilist.co'
const graphQLClient = new GraphQLClient(endpoint)

const GET_MANGA = gql`
  query GetManga($id: Int) {
    Media(id: $id, type: MANGA) {
      id
      title {
        romaji
        english
      }
      chapters
      status
    }
  }
`;

const SEARCH_MANGA = gql`
query SearchManga($name: String) {
  Page(page: 1, perPage: 50) {
    media(search: $name, type: MANGA) {
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

type MangaResponse = {
  Media: {
    id: number
    title: {
      romaji: string
      english: string | null
    }
    chapters: number
    status: string
  }
};

type MangaArrayResponse = {
  Page: {
    media: {
      id: number
      title: {
        romaji: string
        english: string | null
      }
      chapters: number
      status: string
    }[]
  }
};
export async function fetchManga(id: number) {
  const variables = { id }
  const data = await graphQLClient.request<MangaResponse>(GET_MANGA, variables)
  return data.Media
}

export async function searchManga(name: string) {
  const variables = { name }
  const data = await graphQLClient.request<MangaArrayResponse>(SEARCH_MANGA, variables)
  return data.Page.media
}
