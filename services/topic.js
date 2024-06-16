import { db } from '../db'

export const saveTopic = async (user, topic) => {
    const newTopic = await db.topic.create({
      userId: user.id,
      title: topic.title
    })
    return newTopic
}

export const getTopicByPage = async (searchParams) => {
  const pageSize = searchParams.pageSize || 10
  const pageNo = searchParams.pageNo

  const topics = await db.topic.findAll({
    where: {
      userId: searchParams.userId
    },
    limit: pageSize,
    offset: (pageNo - 1) * (pageSize || 10),
    order: [['createdAt', 'DESC']],
    raw: true,
  })
  const count = await db.topic.count({
    where: {
      userId: searchParams.userId
    }
  });

  return {
    topics,
    pageNo,
    pageSize,
    total: count
  }
}

