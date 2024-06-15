const { DataTypes } = require('sequelize')

function topic(sequelize) {
  const Topic = sequelize.define('Topic', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize, // 要连接的数据库实例
    indexes: [{ fields: ['title'] }]
  });

  Topic.associate = function(models) {
    Topic.belongsTo(models.user, { foreignKey: 'userId' });
  }

  return Topic
}

module.exports = topic