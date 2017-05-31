"use strict";
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('USER_INFO', {
    USER_ID: {
      type: DataTypes.CHAR(32),
      allowNull: false,
      primaryKey: true
    },
    USER_NAME: {
      type: DataTypes.CHAR(64),
      allowNull: true
    },
    PASSWORD: {
      type: DataTypes.CHAR(32),
      allowNull: true,
      defaultValue: ""
    },
    NOTEBOOK_SERVER_URL: {
      type: DataTypes.CHAR(64),
      allowNull: true
    },
    JUPYTER_TOKEN: {
      type: DataTypes.CHAR(64),
      allowNull: true
    }
  }, {
    createdAt: false,
    updatedAt: false,
    tableName: 'USER_INFO'
  });
};