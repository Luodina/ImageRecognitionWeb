"use strict";
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('MODEL_INFO', {
    MODEL_ID: {
      type: DataTypes.CHAR(32),
      allowNull: false,
      primaryKey: true
    },
    USER_ID: {
      type: DataTypes.CHAR(32),
      allowNull: true
    },
    VIEW_OR_CODE: {
      type: DataTypes.CHAR(2),
      allowNull: true,
      defaultValue: ""
    },
    VIEW_MENU_ID: {
      type: DataTypes.CHAR(3),
      allowNull: true
    },
    MODEL_NAME: {
      type: DataTypes.CHAR(64),
      allowNull: true
    },
    NOTEBOOK_PATH: {
      type: DataTypes.CHAR(64),
      allowNull: true
    },
    USER_INPUT_ITEMS: {
      type: DataTypes.CHAR(256),
      allowNull: true
    },
    MODEL_INFO: {
      type: DataTypes.CHAR(256),
      allowNull: true
    },
    TRAINNING_RESULT: {
      type: DataTypes.CHAR(512),
      allowNull: true
    },
    REGULAR_TRAINNING: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    TRAINNING_PERIOD: {
      type: DataTypes.CHAR(32),
      allowNull: true
    },
    UPDATED_TIME: {
      type: DataTypes.DATE(),
      allowNull: true
    },
    COMMENT: {
      type: DataTypes.CHAR(256),
      allowNull: true
    },
  }, {
    createdAt: false,
    updatedAt: false,
    tableName: 'MODEL_INFO'
  });
};