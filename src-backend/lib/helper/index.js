import setTagsToTask from './setTagsToTask';
import prerapeTaskList from './prepareTaskList';
import parseTagsString from './parseTagsString';
import getValueById from './getValueById';
import getFullUserNameById from './getFullUserNameById';
import buildSearchOptions from './buildSearchOptions';
import formObjectBuilder from './formObjectBuilder';

export default {
  prerapeTaskList,
  parseTagsString,
  setTags: ((tagModel, tags, taskInstance) => setTagsToTask(tagModel, tags, taskInstance)),
  isFiltredTasks: (ctx => Object.keys(ctx.query).length !== 0),
  getValueById,
  getFullUserNameById,
  buildSearchOptions,
  formObjectBuilder,
};
