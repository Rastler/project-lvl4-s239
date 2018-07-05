import welcome from './welcome';
import users from './users';
import sessions from './sessions';
import taskStatus from './taskStatus';
import tasks from './tasks';

const controllers = [welcome, users, sessions, taskStatus, tasks];

export default router => controllers.forEach(func => func(router));
