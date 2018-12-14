import { pick } from 'lodash';
import { authenticate } from '../middleware';
import { User } from './User';

const UserController = app => {
  app.post('/users', (req, res) => {
    const body = pick(req.body, ['email', 'password']);
    const user = new User({ ...body });
    user
      .save()
      .then(() => user.generateAuthToken())
      .then(token => res.header('x-auth', token).send(user))
      .catch(error => {
        res.status(400).send(error);
      });
  });

  app.get('/profile', authenticate, (req, res) => {
    res.send(req.user);
  });
};

export default UserController;
