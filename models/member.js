'use strict';
module.exports = function(sequelize, DataTypes) {
  var Member = sequelize.define('Member', {
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
  return Member;
};