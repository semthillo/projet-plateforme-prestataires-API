import express from 'express';
import LinksCtrl from '../Controllers/LinksCtrl.js';

const routerLinks = express.Router();

routerLinks.get('/links/:id', LinksCtrl.getLinkById);
routerLinks.get('/links', LinksCtrl.getAllLinks);
routerLinks.post('/links', LinksCtrl.createLink);
routerLinks.put('/links/:id', LinksCtrl.updateLink);
routerLinks.delete('/links/:id', LinksCtrl.deleteLink);

export default routerLinks;
