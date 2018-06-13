import Sequelize from 'sequelize';
import { encrypt } from '../lib/secure';

class User extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        firtName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        email: {
          type: DataTypes.STRING,
          unique: true,
          validate: {
            isEmail: true,
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
          set: (value) => {
            this.setDataValue('passwordDigest', encrypt(value));
            this.setDataValue('password', value);
            return value;
          },
          validate: {
            len: [1, +Infinity],
          },
        },
      },
      { sequelize },
    );
  }
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

export default User;

