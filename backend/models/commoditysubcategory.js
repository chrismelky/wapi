'use strict';
module.exports = (sequelize, DataTypes) => {
  var CommoditySubCategory = sequelize.define('CommoditySubCategory', {
    name: DataTypes.STRING,
    category_id: DataTypes.INTEGER
  }, {});
  CommoditySubCategory.associate = function(models) {
    // associations can be defined here
  };
  return CommoditySubCategory;
};