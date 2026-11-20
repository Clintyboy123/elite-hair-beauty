'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('wedding_enquiries', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(120), allowNull: false },
      email: { type: Sequelize.STRING(254), allowNull: false },
      phone: { type: Sequelize.STRING(30), allowNull: false },
      wedding_date: { type: Sequelize.DATEONLY, allowNull: false },
      venue: { type: Sequelize.STRING(200), allowNull: true },
      party_size: { type: Sequelize.SMALLINT.UNSIGNED, allowNull: true },
      services: { type: Sequelize.JSON, allowNull: false },
      message: { type: Sequelize.TEXT, allowNull: true },
      status: { type: Sequelize.ENUM('new', 'in_progress', 'booked', 'closed'), allowNull: false, defaultValue: 'new' },
      notified_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('wedding_enquiries', ['wedding_date']);
    await queryInterface.addIndex('wedding_enquiries', ['status']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('wedding_enquiries');
  },
};
