const Sequelize = require('sequelize');

const { Op } = Sequelize;

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
  }, {
    scopes: {
      onlyAuthorId: (id => ({
        where: {
          creator: id,
        },
      })),
      assignToId: (id => ({
        where: {
          assignedTo: id,
        },
      })),
      onlyStatusId: (id => ({
        where: {
          status: id,
        },
      })),
    },
  });


  Task.associate = (models) => {
    Task.belongsTo(models.TaskStatus, { foreignKey: 'status', as: 'Status' });
    Task.belongsTo(models.User, { foreignKey: 'creator', as: 'Author' });
    Task.belongsTo(models.User, { foreignKey: 'assignedTo', as: 'Executer' });
    Task.belongsToMany(models.Tag, { through: 'TagsForTask' });
  };

  Task.loadScopes = (models) => {
    Task.addScope('hasTag', tagName => ({
      include: [
        {
          model: models.Tag,
          where: {
            name: {
              [Op.like]: tagName,
            },
          },
        },
      ],
    }));
  };

  // Task.prototype.getStatus = async function () { // eslint-disable-line
  //   const status = await this.getStatuses();
  //   return status;
  // };
  return Task;
};
