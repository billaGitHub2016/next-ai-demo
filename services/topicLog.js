import { db } from '../db'

export const saveTopicLog = async (user, topic, log) => {
    const newLog = await db.topicLog.create({
      userId: user.id,
      topicId: topic?.id,
      question: log.question,
      answer: log.answer,
      orignalQuestion: log.orignalQuestion
    })
    return newLog
}

export const getTopicLogByPage = async (searchParams) => {
  const pageSize = searchParams.pageSize || 10
  const pageNo = searchParams.pageNo
  const topicId = searchParams.topicId

  const where = {
    userId: searchParams.userId,
    topicId
  }
  // if (topicId) {
  //   where.topicId = topicId
  // }
  const topics = await db.topicLog.findAll({
    where,
    limit: pageSize,
    offset: (pageNo - 1) * (pageSize || 10),
    order: [['createdAt', 'ASC']],
    raw: true,
  })
  const count = await db.topicLog.count({
    where
  });

  return {
    topics,
    pageNo,
    pageSize,
    total: count
  }
}
