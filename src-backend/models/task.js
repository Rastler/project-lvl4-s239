export default (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 254],
          msg: 'Cannot be blank',
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true,
      },
    },
    creator: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true,
      },
    },
    assignedTo: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: true,
      },
    },
  });


  Task.associate = function (models) {
    Task.belongsTo(models.TaskStatus, { foreignKey: 'status', as: 'Status' });
    Task.belongsTo(models.User, { foreignKey: 'creator', as: 'Author' });
    Task.belongsTo(models.User, { foreignKey: 'assignedTo', as: 'Executer' });
    Task.belongsToMany(models.Tag, { through: 'TagsForTask' });
  }; // eslint-disable-line

  // Task.prototype.getStatus = async function () { // eslint-disable-line
  //   const status = await this.getStatuses();
  //   return status;
  // };
  return Task;
};
