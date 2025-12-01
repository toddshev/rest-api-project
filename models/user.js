'use strict';

const bcrypt = require('bcrypt');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Course);
    }
  }

  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'First Name is required',
        },
        notEmpty: {
          msg: 'Please enter a value for "First Name"',
        },
      },
    },

    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Last Name is required',
        },
        notEmpty: {
          msg: 'Please enter a value for "Last Name"',
        },
      }, 
    },

    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {  
        isEmail: {
          msg: 'Please enter a valid email address',
        },
        notNull: {
          msg: 'Email Address is required',
        },
        notEmpty: {
          msg: 'Please enter a value for Email Address'
        },
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
       validate: {
         notNull: {
           msg: 'Password is required',
          },
          notEmpty: {
            msg: 'Please enter a value for "Password"',
          },
        },
      set(val){
        const hashedPassword = bcrypt.hashSync(val, 10);
        this.setDataValue('password', hashedPassword);
      },
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
