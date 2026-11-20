// A newsletter sign-up. One row per email address.
module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Subscriber',
    {
      email: { type: DataTypes.STRING(254), allowNull: false, unique: true },
      source: { type: DataTypes.STRING(30), allowNull: false, defaultValue: 'newsletter' },
      unsubscribedAt: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: 'subscribers' }
  );
