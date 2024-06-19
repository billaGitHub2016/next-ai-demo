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

export const deleteTopicById = async (params) => {
  try {
    const result = await db.sequelize.transaction(async (t) => {
      await db.topicLog.destroy({
        where: {
          userId: params.userId,
          topicId: params.id
        }
      })

      await db.topic.destroy({
        where: {
          userId: params.userId,
          id: params.id
        }
      })
  
      return 0
    });
    return result
    // 如果执行到此行,则表示事务已成功提交,`result`是事务返回的结果
    // `result` 就是从事务回调中返回的结果(在这种情况下为 0)
  
  } catch (error) {
    // 如果执行到此,则发生错误.
    // 该事务已由 Sequelize 自动回滚！
    console.error('删除话题失败:', error)
    throw new Error(error.message)
  }
}

