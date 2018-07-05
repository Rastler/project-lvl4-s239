export default async (model, id) => {
  try {
    const valueObj = await model.findOne({
      where: {
        id,
      },
    });
    const value = await valueObj.getFullName();
    return value;
  } catch (err) {
    return null;
  }
};
