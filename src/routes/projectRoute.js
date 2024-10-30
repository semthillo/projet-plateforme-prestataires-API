import express from "express";
import ProjectCtrl from "../Controllers/ProjectCtrl.js"; 
import {
  createProjectValid, 
  editProjectValid,    
  deleteProjectValid,  
} from "../Validator/ProjectValid.js";  

const routerProject = express.Router();


routerProject.get("/projects/:id", ProjectCtrl.getProjectById);
routerProject.get("/projects", ProjectCtrl.getAllProjects);
routerProject.post("/projects", createProjectValid, ProjectCtrl.createProject);
routerProject.put("/projects/:id", editProjectValid, ProjectCtrl.updateProject);
routerProject.delete("/projects/:id", deleteProjectValid, ProjectCtrl.deleteProject);

export default routerProject;
