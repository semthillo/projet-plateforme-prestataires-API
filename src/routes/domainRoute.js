import express from 'express';
import DomainCtrl from '../Controllers/DomainCtrl.js';

const routerDomain = express.Router();


routerDomain.get('/domains/:id', DomainCtrl.getDomainById);
routerDomain.get('/domains', DomainCtrl.getAllDomains);
routerDomain.post('/domains', DomainCtrl.createDomain);
routerDomain.put('/domains/:id', DomainCtrl.updateDomain);
routerDomain.delete('/domains/:id', DomainCtrl.deleteDomain);

export default routerDomain;
