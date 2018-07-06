export default (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      set(value) {
        this.setDataValue('name', value.toLowerCase());
      },
    },
  });

  Tag.associate = function (models) {
    Tag.belongsToMany(models.Task, { through: 'TagsForTask' });
  }; // eslint-disable-line

  return Tag;
};
