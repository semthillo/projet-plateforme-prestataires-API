import express from 'express';
import UserCtrl from '../Controllers/UserCtrl.js';
import { createUserValid, editUserValid, deleteUserValid } from '../Validator/UserValid.js'
import { authenticateToken } from '../middleware/auth.js';


const routerUser = express.Router();


routerUser.post('/login', UserCtrl.loginUser);


routerUser.get('/profile', authenticateToken, (req, res) => {
    res.json({ message: "Ceci est votre profil", user: req.user });
});
routerUser.post('/request-password-reset', UserCtrl.requestPasswordReset);
routerUser.post('/reset-password', UserCtrl.resetPassword);
routerUser.get('/users/:id', UserCtrl.getUserById);
routerUser.get('/users', UserCtrl.getAllUsers);
routerUser.post('/users', createUserValid, UserCtrl.createUser);


routerUser.put('/users/:id', editUserValid, UserCtrl.updateUser);   
routerUser.delete('/users/:id', deleteUserValid, UserCtrl.deleteUser);

export default routerUser;
