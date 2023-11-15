import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { generateToken, isAuth } from '../utils.js';

const userRouter = express.Router();

userRouter.get(
  '/createadmin',
  expressAsyncHandler(async (req, res) => {
    try {
      const user = new User({
        name: 'Ember Admin',
        email: 'eduardo.gonzalez.dev@gmail.com',
        password: 'emberadmin',
        isAdmin: true,
      });
      const createdUser = await user.save();
      res.send(createdUser);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  })
);
userRouter.post(
    '/signin',
    expressAsyncHandler(async (req, res) => {
      const signinUser = await User.findOne({
        email: req.body.email,
        password: req.body.password,
      });
      if (!signinUser) {
        res.status(401).send({
          message: 'Invalid email or password',
        });
      } 
      else {
        res.send({
          _id: signinUser._id,
          name: signinUser.name,
          email: signinUser.email,
          isAdmin: signinUser.isAdmin,
          token: generateToken(signinUser),
        });
      }
    })
 );
 userRouter.post(
  '/register',
  expressAsyncHandler(async (req, res) => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    const createdUser = await user.save();
    if (!createdUser) {
      res.status(401).send({
        message: 'Invalid User Data',
      });
    } else {
      res.send({
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        isAdmin: createdUser.isAdmin,
        token: generateToken(createdUser),
      });
    }
  })
);
userRouter.put(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    // Making sure is an existing token || Making sure token corresponds to user
    if (req.user._id !== req.params.id) {res.status(404).send({message: 'Invalid Token'})};
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404).send({
        message: 'User Not Found',
      });
    } else {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.password = req.body.password || user.password;
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    }
  })
);
userRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const {id} = req.params;
    const getUser = await User.findById(id);
    if (!getUser) {
      res.status(401).send({
        message: 'User not found',
      });
    } 
    else {
      res.send({
        _id: getUser._id,
        name: getUser.name,
        email: getUser.email,
        isAdmin: getUser.isAdmin,
        token: generateToken(getUser),
      });
    }
  })
);
export default userRouter;