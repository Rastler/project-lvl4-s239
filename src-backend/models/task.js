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


  Task.associate = function (models) {}; // eslint-disable-line

  // Task.prototype.getStatus = async function () { // eslint-disable-line
  //   const status = await this.getStatuses();
  //   return status;
  // };
  return Task;
};
