import User from './User';
import { pick } from 'lodash';

export const UserController = (app, redis) => {
  app.post('/users', (req, res) => {
    console.log('user:::', req.body);
    const body = pick(req.body, ['email', 'password']);
    const user = new User({ ...body });
    user
      .save()
      .then(() => user.generateAuthToken())
      .then(token => res.header('x-auth', token).send(user))
      .catch(error => {
        console.log('user:error:::', error);
        res.status(400).send(error);
      });
  });
};

export default UserController;
