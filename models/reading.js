'use strict'
module.exports = function (sequelize, DataTypes) {
  var Reading = sequelize.define('Reading', {
    region: DataTypes.STRING,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    timestamp: DataTypes.DATE,
    concentration: DataTypes.FLOAT
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  })
  return Reading
}
