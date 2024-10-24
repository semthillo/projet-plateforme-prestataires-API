import express from 'express';
import UserCtrl from '../Controllers/UserCtrl.js';


const routerUser = express.Router();


routerUser.get('/users/:id', UserCtrl.getUserById);
routerUser.get('/users', UserCtrl.getAllUsers);
routerUser.post('/users', UserCtrl.createUser);


routerUser.put('/users/:id', UserCtrl.updateUser);   
routerUser.delete('/users/:id', UserCtrl.deleteUser);

export default routerUser;
