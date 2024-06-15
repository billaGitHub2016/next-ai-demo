const { DataTypes } = require('sequelize')

function user(sequelize) {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '/images/avatar.png'
    }
  }, {
    sequelize, // 要连接的数据库实例
    indexes: [{ unique: true, fields: ['email'] }]
  });

  User.associate = function(models) {
    User.hasMany(models.topic, { foreignKey: 'userId' });
  }

  return User
}

module.exports = user