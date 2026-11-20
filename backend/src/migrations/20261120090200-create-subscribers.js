'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('subscribers', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      email: { type: Sequelize.STRING(254), allowNull: false, unique: true },
      source: { type: Sequelize.STRING(30), allowNull: false, defaultValue: 'newsletter' },
      unsubscribed_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('subscribers');
  },
};
