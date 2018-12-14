import User from './User';
import { pick } from 'lodash';

export const UserController = (app, redis) => {
  app.post('/users', (req, res) => {
    console.log('user:::', req.body);
    const body = pick(req.body, ['email', 'password']);
    const newUser = new User({ ...body });
    newUser
      .save()
      .then(user => {
        console.log('user:save:::', error);
        res.send(user);
      })
      .catch(error => {
        console.log('user:error:::', error);
        res.status(400).send(error);
      });
  });
};

export default UserController;
