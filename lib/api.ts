import * as constants from './constants'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { graphql } = require('@octokit/graphql')

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${constants.GH_TOKEN}`,
  },
})

export async function getPostBySlug(slug, isPage = false, digest = false) {
  const allPosts = await getAllPosts(isPage, digest)
  return allPosts.filter((item) => item.slug === slug)[0]
}

export async function getAllPosts(isPage = false, digest = false) {
  try {
    const { repository } = await graphqlWithAuth(
      `
      query lastIssues($owner: String!, $repo: String!, $labels: [String!] $num: Int = 100) {
        repository(owner: $owner, name: $repo) {
          issues(
            last: $num
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
  } catch (error) {
    // if (error instanceof GraphqlResponseError) {
    // do something with the error, allowing you to detect a graphql response error,
    // compared to accidentally catching unrelated errors.

    // server responds with an object like the following (as an example)
    // class GraphqlResponseError {
    //  "headers": {
    //    "status": "403",
    //  },
    //  "data": null,
    //  "errors": [{
    //   "message": "Field 'bioHtml' doesn't exist on type 'User'",
    //   "locations": [{
    //    "line": 3,
    //    "column": 5
    //   }]
    //  }]
    // }

    console.log('Request failed:', error.request) // { query, variables: {}, headers: { authorization: 'token secret123' } }
    console.log(error.message) // Field 'bioHtml' doesn't exist on type 'User'
    // } else {
    // handle non-GraphQL error
    // }
    return []
  }
}
