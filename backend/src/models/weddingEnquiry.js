// A wedding enquiry from the Weddings page.
module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'WeddingEnquiry',
    {
      name: { type: DataTypes.STRING(120), allowNull: false },
      email: { type: DataTypes.STRING(254), allowNull: false },
      phone: { type: DataTypes.STRING(30), allowNull: false },
      weddingDate: { type: DataTypes.DATEONLY, allowNull: false },
      venue: { type: DataTypes.STRING(200), allowNull: true },
      partySize: { type: DataTypes.SMALLINT.UNSIGNED, allowNull: true },
      services: { type: DataTypes.JSON, allowNull: false },
      message: { type: DataTypes.TEXT, allowNull: true },
      status: { type: DataTypes.ENUM('new', 'in_progress', 'booked', 'closed'), allowNull: false, defaultValue: 'new' },
      notifiedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: 'wedding_enquiries' }
  );
