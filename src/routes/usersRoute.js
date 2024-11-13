import express from 'express';
import { createUserValid, editUserValid, deleteUserValid } from '../Validator/UserValid.js';
import { authenticateToken, verifyToken, verifyRole } from '../middleware/auth.js';
import UserCtrl from '../Controllers/UserCtrl.js';

const routerUser = express.Router();

// Route pour l'admin, protégée par `verifyToken` et `verifyRole("admin")`
routerUser.get('/admin', verifyToken, verifyRole('admin'), (req, res) => {
    res.send("Bienvenue, administrateur !");
});

// Route pour le profil prestataire, protégée par `verifyToken` et `verifyRole("prestataire")`
routerUser.get('/prestataire', verifyToken, verifyRole('prestataire'), (req, res) => {
    res.send("Bienvenue, prestataire !");
});

// Route de connexion
routerUser.post('/login', UserCtrl.login);

// Route de profil protégée par `authenticateToken`
routerUser.get('/profile', authenticateToken, (req, res) => {
    res.json({ message: "Ceci est votre profil", user: req.user });
});

// Autres routes utilisateurs
routerUser.post('/reset-password', UserCtrl.resetPassword);
routerUser.get('/users/:id', UserCtrl.getUserById);
routerUser.get('/users', UserCtrl.getAllUsers);
routerUser.post('/users',  UserCtrl.createUser);


routerUser.put('/users/:id', editUserValid, UserCtrl.updateUser);   
routerUser.delete('/users/:id', deleteUserValid, UserCtrl.deleteUser);

export default routerUser;
