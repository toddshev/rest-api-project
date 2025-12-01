'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.belongsTo(models.User, {
        foreignKey: {   
          fieldName: 'userId',
         // field: 'userId',
          allowNull: false,
          validate: {
            notNull: {
              msg: 'User ID is required',
            },
            notEmpty: {
              msg: 'Please enter a value for "User ID"',
            },
          },
        },
      })
    }
  }
    
  Course.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Title is required',
        },
        notEmpty: {
          msg: "Please enter a value for 'Title'"
        },
      },
    }, 
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Description is required',
        },
        notEmpty: {
          msg: "Please enter a value for 'Description'",
        },
      },
    },
    estimatedTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    materialsNeeded: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};
