const { GraphQLServer } = require('graphql-yoga')

let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
}]

let idCount = links.length

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    link: (parent, args) => links.find((link) => link.id === args.id)
  },
  Mutation: {
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url
      }

      links.push(link)

      return link
    },
    updateLink: (parent, {id, url, description}) => {
      let link = links.find((link) => link.id === id)

      if (!link) {
        return
      }

      Object.assign(link, { url, description })

      return link
    },
    deleteLink: (parent, { id }) => {
      let link = links.find((link) => link.id === id)

      links = links.filter(link => link.id !== id)
      return link
    }
  }
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
})

server.start(() => console.log(`Server is running on http://localhost:4000`))
