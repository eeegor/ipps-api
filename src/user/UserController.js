import { pick } from 'lodash';
import { authenticate } from '../middleware';
import { User } from './User';

const UserController = app => {
  app.post('/signup', (req, res) => {
    const body = pick(req.body, ['email', 'password']);
    const user = new User({ ...body });
    user
      .save()
      .then(() => user.generateAuthToken())
      .then(token => {
        res.header('x-auth', token);
        res.status(201).send(user);
      })
      .catch(error => {
        res.status(400).send(error);
      });
  });

  app.post('/login', (req, res) => {
    const body = pick(req.body, ['email', 'password']);

    User.findByEmailPassword(body.email, body.password)
      .then(user => {
        user
          .generateAuthToken()
          .then(token => {
            res.header('x-auth', token);
            res.status(200).send(user);
          })
          .catch(error =>
            Promise.reject({
              message: 'Something went wrong generating the auth token',
              error
            })
          );
      })
      .catch(error => {
        res.status(400).send(error);
      });
  });

  app.delete('/logout', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(
      () => {
        res.status(200).send({
          message: 'Goodby friend!'
        });
      },
      error => res.status(400).send(error)
    );
  });

  app.get('/profile', authenticate, (req, res) => {
    res.status(200).send(req.user);
  });
};

export default UserController;
