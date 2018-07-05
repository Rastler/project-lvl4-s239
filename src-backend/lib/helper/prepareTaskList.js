export default tasks => Promise.all(tasks.map(async (task) => {
  const obj = task.dataValues;
  const status = await task.getStatus();
  const creator = await task.getAuthor();
  const executer = await task.getExecuter();
  const tagsObj = await task.getTags();
  const tags = tagsObj.map(tag => tag.name);
  obj.status = status ? status.name : '';
  obj.author = creator ? creator.getFullName() : '';
  obj.executer = executer ? executer.getFullName() : '';
  obj.tags = tagsObj ? tags : '';
  return obj;
}));
