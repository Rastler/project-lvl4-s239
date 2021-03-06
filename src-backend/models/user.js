import { encrypt } from '../lib/secure';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 100],
          msg: 'Cannot be blank',
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 100],
          msg: 'Cannot be blank',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        args: true,
        msg: 'This email already registred',
      },
      validate: {
        isEmail: {
          args: true,
          msg: 'This email is not valid',
        },
      },
      set(value) {
        this.setDataValue('email', value.toLowerCase());
      },
    },
    passwordDigest: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.VIRTUAL,
      set(value) {
        this.setDataValue('passwordDigest', encrypt(value));
        this.setDataValue('password', value);
        return value;
      },
      validate: {
        len: {
          args: [1, +Infinity],
          msg: 'The password is too short',
        },
      },
    },
  });


  User.associate = (models) => {
    User.hasMany(models.Task, { foreignKey: 'creator', as: 'Author' });
    User.hasMany(models.Task, { foreignKey: 'assignedTo', as: 'Executer' });
  };


  User.prototype.getFullName = function () { // eslint-disable-line
    return [this.firstName, this.lastName].join(' ');
  };

  return User;
};
