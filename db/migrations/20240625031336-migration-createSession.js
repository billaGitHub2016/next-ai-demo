'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('Sessions', {
        id: {
          type: Sequelize.DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        userId: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false
        },
        token: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
        },
        expireDate: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false
        },
        createdAt: {
          type: Sequelize.DataTypes.DATE,
        },
        updatedAt: {
          type: Sequelize.DataTypes.DATE,
        }
      })

      await queryInterface.addIndex('Sessions', ['userId', 'token'], {
        fields:  ['userId', 'token'],
        unique: true,
        transaction,
      });
      await queryInterface.addIndex('Sessions', ['userId'], {
        fields:  ['userId'],
        unique: true,
        transaction,
      });

    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('Sessions');
  }
};
