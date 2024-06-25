const { DataTypes } = require('sequelize')

function session(sequelize) {
  const Session = sequelize.define('Session', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expireDate: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
  }, {
    sequelize, // 要连接的数据库实例
    indexes: [{ fields: ['userId', 'token'], unique: true }, { fields: ['userId'], unique: true }]
  });

  return Session
}

module.exports = session