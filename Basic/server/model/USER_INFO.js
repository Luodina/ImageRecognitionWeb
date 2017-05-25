"use strict";
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('USER_INFO', {
    USER_ID: {
      type: DataTypes.INTEGER(16),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    USER_NAME: {
      type: DataTypes.STRING,
      allowNull: false
    },
    PASSWORD: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ""
    },
    NOTEBOOK_SERVER_URL: {
      type: DataTypes.STRING,
      allowNull: true
    },
    JUPYTER_TOKEN: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    createdAt: false,
    updatedAt: false,
    tableName: 'USER_INFO'
  });
};