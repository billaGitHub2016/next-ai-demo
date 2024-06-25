const { DataTypes } = require('sequelize')

function topicLog(sequelize) {
  const TopicLog = sequelize.define('TopicLog', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    answer: {
      type: DataTypes.TEXT
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    topicId: {
      type: DataTypes.INTEGER,
    },
    orignalQuestion: {
      type: DataTypes.TEXT,
    }
  }, {
    sequelize, // 要连接的数据库实例
    indexes: [{ fields: ['createdAt'] }, { fields: ['userId'] }, { fields: ['topicId'] }],
  });

  TopicLog.associate = function(models) {
    // TopicLog.belongsTo(models.user, { foreignKey: 'userId' });
    TopicLog.belongsTo(models.topic, { foreignKey: 'topicId' });
  }

  return TopicLog
}

module.exports = topicLog