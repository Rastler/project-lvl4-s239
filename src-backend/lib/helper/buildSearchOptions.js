import { Tag, TaskStatus } from '../../models';
import parseTagsString from './parseTagsString';

export default (queryObj, creatorId) => {
  const searchOptions = {
    where: {},
    include: [],
  };
  if (queryObj.userTaskOnly && creatorId) {
    searchOptions.where.creator = creatorId;
  }
  if (queryObj.filtredExecuter !== '0') {
    const executerId = queryObj.filtredExecuter;
    searchOptions.where.assignedTo = executerId;
  }
  if (queryObj.filtredStatus !== '0') {
    const includeObj = { model: TaskStatus, as: 'Status', where: { id: queryObj.filtredStatus } };
    searchOptions.include.push(includeObj);
  }
  if (queryObj.searchTags) {
    const tagsArr = parseTagsString(queryObj.searchTags);
    const includeObj = { model: Tag, where: { name: tagsArr } };
    searchOptions.include.push(includeObj);
  }

  return searchOptions;
};
