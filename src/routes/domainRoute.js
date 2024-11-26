import express from 'express';
import DomainCtrl from '../Controllers/DomainCtrl.js';
import { createDomainValid, editDomainValid, deleteDomainValid} from '../Validator/DomainValid.js'


const routerDomain = express.Router();


routerDomain.get('/domains/:id', DomainCtrl.getDomainById);
routerDomain.get('/domains', DomainCtrl.getAllDomains);
routerDomain.post('/domains', createDomainValid,  DomainCtrl.createDomain);
routerDomain.put('/domains/:id', editDomainValid, DomainCtrl.updateDomain);
routerDomain.delete('/domains/:id', deleteDomainValid, DomainCtrl.deleteDomain);

export default routerDomain;
