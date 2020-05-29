const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

const post = (parent, args, context) => {
  const userId = getUserId(context)

  return context.prisma.createLink({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id: userId } }
  })
}

const updateLink = async (parent, {id, url, description}, context) => {
  const userId = getUserId(context)

  const postedBy = await context.prisma.link({ id }).postedBy()

  if (postedBy.id !== userId) {
    throw new Error('Post does not belong to user')
  }

  return context.prisma.updateLink({
    data: {
      url,
      description
    },
    where: {
      id
    }
  })
}

const deleteLink = async (parent, { id }, context) => {
  const userId = getUserId(context)

  const postedBy = await context.prisma.link({ id }).postedBy()

  if (postedBy.id !== userId) {
    throw new Error('Post does not belong to user')
  }

  return context.prisma.deleteLink({ id })
}

const vote = async (parent, args, context, info) => {
  // 1
  const userId = getUserId(context)

  // 2
  const voteExists = await context.prisma.$exists.vote({
    user: { id: userId },
    link: { id: args.linkId },
  })
  if (voteExists) {
    throw new Error(`Already voted for link: ${args.linkId}`)
  }

  // 3
  return context.prisma.createVote({
    user: { connect: { id: userId } },
    link: { connect: { id: args.linkId } },
  })
}

const signup = async (parent, args, context, info) => {
  const hashedPassword = await bcrypt.hash(args.password, 10)
  const {password, ...user} = await context.prisma.createUser({ ...args, password: hashedPassword })

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}

const login = async (parent, args, context, info) => {
  const {password, ...user} = await context.prisma.user({ email: args.email })
  if (!user) {
    throw new Error('No such user found')
  }

  const valid = await bcrypt.compare(args.password, password)
  if (!valid) {
    throw new Error('Invalid password')
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}

module.exports = {
  post,
  updateLink,
  deleteLink,
  vote,
  signup,
  login
}
