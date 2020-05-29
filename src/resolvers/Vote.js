const link = (parent, args, context) => {
  return context.prisma.vote({ id: parent.id }).link()
}

const user = (parent, args, context) => {
  return context.prisma.vote({ id: parent.id }).user()
}

module.exports = {
  link,
  user,
}
