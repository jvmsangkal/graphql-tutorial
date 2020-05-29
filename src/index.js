const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client')

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: (root, args, context) => {
      return context.prisma.links()
    },
    link: (root, args, context) => {
      return context.prisma.link({ id: args.id })
    }
  },
  Mutation: {
    post: (parent, args, context) => {
      return context.prisma.createLink({
        url: args.url,
        description: args.description,
      })
    },
    updateLink: (parent, {id, url, description}, context) => {
      return context.prisma.updateLink({
        data: {
          url,
          description
        },
        where: {
          id
        }
      })
    },
    deleteLink: (parent, { id }, context) => {
      return context.prisma.deleteLink({ id })
    }
  }
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { prisma },
})

server.start(() => console.log(`Server is running on http://localhost:4000`))
