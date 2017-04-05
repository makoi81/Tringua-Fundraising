'use strict';
module.exports = function(sequelize, DataTypes) {
  var Members = sequelize.define('Members', {
    phone: DataTypes.STRING,
    username: DataTypes.STRING,
    fullName: DataTypes.STRING,
    pwd: DataTypes.STRING,
    pswd_repeat: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Members;
};