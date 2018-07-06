export default (sequelize, DataTypes) => {
  const TaskStatus = sequelize.define('TaskStatus', {
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 50],
          msg: 'Cannot be blank',
        },
      },
      allowNull: false,
      unique: {
        args: true,
        msg: 'Status name must be unique',
      },
      set(value) {
        this.setDataValue('name', value.toLowerCase());
      },
    },
  });


  TaskStatus.associate = (models) => {
    TaskStatus.hasMany(models.Task, { foreignKey: 'status', as: 'Tasks' });
  };

  return TaskStatus;
};
