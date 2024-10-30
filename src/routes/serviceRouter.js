import express from 'express';
import ServiceCtrl from '../Controllers/ServiceCtrl.js';
import { createServiceValid, editServiceValid, deleteServiceValid } from '../Validator/ServiceValid.js';

const routerService = express.Router();

routerService.get('/services/:id', ServiceCtrl.getServiceById);
routerService.get('/services', ServiceCtrl.getAllServices);
routerService.post('/services', createServiceValid, ServiceCtrl.createService);
routerService.put('/services/:id', editServiceValid, ServiceCtrl.updateService);
routerService.delete('/services/:id', deleteServiceValid, ServiceCtrl.deleteService);

export default routerService;
