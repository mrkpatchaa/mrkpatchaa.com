import { cache } from 'react'

import { graphql } from '@octokit/graphql'

import * as constants from './constants'

interface Edge {
  node: { title: string; body: string; slug: string; createdAt: string; excerpt: string }
}
interface RepositoryType {
  repository: { issues: { edges: Edge[] } }
}

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${constants.GH_TOKEN}`,
  },
})

export async function getPostBySlug(slug, isPage = false, digest = false) {
  const allPosts = await getAllPosts(isPage, digest)
  return allPosts.filter((item) => item.slug === slug)[0]
}

export const getAllPosts = cache(async function getAllPosts(isPage = false, digest = false) {
  try {
    const { repository } = await graphqlWithAuth<RepositoryType>(
      `
      query lastIssues($owner: String!, $repo: String!, $labels: [String!] $num: Int = 100) {
        repository(owner: $owner, name: $repo) {
          issues(
            first: $num
            states: OPEN
            filterBy: {labels: $labels, milestoneNumber: "1", states: OPEN}
            orderBy: {
              field: CREATED_AT, direction: DESC
            }
          ) {
            edges {
              node {
                title
                body
                createdAt
                labels(last: 10) {
                  nodes {
                    name
                  }
                }
                milestone {
                  title
                }
              }
            }
          }
        }
      }
`,
      {
        owner: constants.REPO_OWNER,
        repo: constants.REPO,
        labels: isPage ? ['page:published'] : digest ? ['blog:digest'] : ['blog:published'],
      }
    )

    // console.log(repository)
    return repository.issues.edges.map((edge) => {
      const metadataRaw = edge.node?.body.match(/(\/\*----)([\s\S]*)(----\*\/)/)?.[2]
      const metadata = metadataRaw.split(metadataRaw.indexOf('\r\n') > -1 ? '\r\n' : '\n').reduce((prev, curr) => {
        if (curr) {
          const content = curr.split(': ')
          prev[content[0]] = content[1]
        }
        return prev
      }, {})
      return {
        ...edge.node,
        ...metadata,
        body: edge.node.body.replace(/(\/\*----)([\s\S]*)(----\*\/)/, ''),
      }
    })
  } catch {
    console.error('Unable to load published GitHub content.')
    throw new Error('Unable to load published GitHub content; refusing to build an empty site.')
  }
})

export async function getAllDigestYears(): Promise<number[]> {
  const posts = await getAllPosts(false, true)
  const yearsSet = new Set(posts.map((p) => new Date(p.createdAt).getFullYear()))
  return Array.from(yearsSet).sort((a, b) => b - a)
}

export async function getPostsByYear(year: number) {
  const posts = await getAllPosts(false, true)
  return posts.filter((p) => new Date(p.createdAt).getFullYear() === year)
}
