import Sequelize from 'sequelize';

class User extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        myField: DataTypes.STRING,
      },
      { sequelize },
    );
  }
}

export default User;

