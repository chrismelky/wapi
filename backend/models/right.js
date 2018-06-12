'use strict';
module.exports = (sequelize, DataTypes) => {
  const Right = sequelize.define('Right', {
    name: DataTypes.STRING
  }, {
    timestamp: false,
      tableName: "rights"
  });
  Right.associate = function(models) {
  };
  return Right;
};