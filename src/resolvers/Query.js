const info = () => `This is the API of a Hackernews Clone`

const feed = (root, args, context) => {
  return context.prisma.links()
}

const link = (root, args, context) => {
  return context.prisma.link({ id: args.id })
}

module.exports = {
  info,
  feed,
  link
}
