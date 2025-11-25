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
        }
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
          msg: 'Please enter a value for "last name"',
        },
      }, 
    },
    emailAddress: {
      type: DataTypes.STRING,
      isEmail: {
        msg: 'Please enter a valid email address',
      },
    },
    password: {
      type: DataTypes.STRING,
      set(val){
        //if (val === this.password) {
          const hashedPassword = bcrypt.hashSync(val, 10);
          this.setDataValue('password', hashedPassword);
        //} else {
         // throw new Error('Password is required');
        //}
      },
      // allowNull: false,
      //  validate: {
      //    notNull: {
      //      msg: 'Password is required',
      //      //msg: 'Passwords must match',
      //      },
      //     len: {
      //         args: [6,22],
      //         msg: 'Please ensure password is between 6 and 22 characters',
      //     },
      // },
      
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
