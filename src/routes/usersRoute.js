import express from 'express';
import UserCtrl from '../Controllers/UserCtrl.js';
import { createUserValid, editUserValid, deleteUserValid } from '../Validator/UserValid.js'


const routerUser = express.Router();


routerUser.get('/users/:id', UserCtrl.getUserById);
routerUser.get('/users', UserCtrl.getAllUsers);
routerUser.post('/users', createUserValid, UserCtrl.createUser);


routerUser.put('/users/:id', editUserValid, UserCtrl.updateUser);   
routerUser.delete('/users/:id', deleteUserValid, UserCtrl.deleteUser);

export default routerUser;
