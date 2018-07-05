export default async (model, id, field) => {
  try {
    const valueObj = await model.findOne({
      where: {
        id,
      },
    });
    const value = await valueObj[field];
    return value;
  } catch (err) {
    return null;
  }
};
