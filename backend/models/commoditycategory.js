'use strict';
module.exports = (sequelize, DataTypes) => {
  const CommodityCategory = sequelize.define('CommodityCategory', {
    name: DataTypes.STRING,
    description: DataTypes.STRING
  },{
      tableName: "commodity_categories",
      timestamp: false
  });
  CommodityCategory.associate = function(models) {
    // associations can be defined here
  };
  return CommodityCategory;
};