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
      allowNull: false
    },
    VIEW_OR_CODE: {
      type: DataTypes.CHAR(2),
      allowNull: false,
      defaultValue: ""
    },
    VIEW_MENU_ID: {
      type: DataTypes.CHAR(3),
      allowNull: false
    },
    MODEL_NAME: {
      type: DataTypes.CHAR(64),
      allowNull: false
    },
    NOTEBOOK_PATH: {
      type: DataTypes.CHAR(64),
      allowNull: false
    },
    USER_INPUT_ITEMS: {
      type: DataTypes.CHAR(256),
      allowNull: false
    },
    MODEL_INFO: {
      type: DataTypes.CHAR(256),
      allowNull: false
    },
    TRAINNING_RESULT: {
      type: DataTypes.CHAR(512),
      allowNull: false
    },
    REGULAR_TRAINNING: {
      type: DataTypes.CHAR(1),
      allowNull: false
    },
    TRAINNING_PERIOD: {
      type: DataTypes.CHAR(32),
      allowNull: false
    },
    UPDATED_TIME: {
      type: DataTypes.DATE(),
      allowNull: false
    },
    COMMENT: {
      type: DataTypes.CHAR(256),
      allowNull: false
    },
    FILE_PATH: {
      type: DataTypes.CHAR(11),
      allowNull: false
    },
  }, {
    createdAt: false,
    updatedAt: false,
    tableName: 'MODEL_INFO'
  });
};