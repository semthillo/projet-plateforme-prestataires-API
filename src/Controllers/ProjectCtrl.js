import prisma from "../config/prisma.js";
import fs from 'fs';
import path from 'path'; 
class ProjectCtrl {
    
    // Récupérer un projet par son ID
    static async getProjectById(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);  
            const result = await prisma.project.findUnique({
                where: { id: id },
                include: { 
                    user: true, 
                    images: true,
                    domain: true // Inclure les informations du domaine
                }
            });

            if (!result) {
                return res.status(404).json({ message: "Project not found" });
            }

            res.json(result);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Server error" });
        }
        next();
    }

    static async getProjectByUserDomainId(req, res, next) {
        try {
            const domainId = parseInt(req.params.domainId, 10);
            const userId = parseInt(req.params.userId, 10);
    
            const result = await prisma.project.findMany({
                where: {
                    domain_id: domainId,
                    user_id: userId
                },
                include: {
                    user: true,
                    images: true,
                    domain: true
                }
            });
    
            if (!result.length) {
                return res.status(404).json({ message: "No projects found" });
            }
    
            res.json(result);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Server error" });
        }
        next();
    }
    

    static async getProjectByUserId(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);  
            const result = await prisma.project.findMany({
                where: { user_id: id },
                include: {
                    user: true,
                    images: { // On récupère uniquement les ID des images
                        select: { image_id: true }
                    },
                    domain: true // Inclure le domaine associé
                }
            });
    
            if (!result.length) {
                return res.status(404).json({ message: "No projects found" });
            }
    
            // Manipuler les résultats pour récupérer le nom de l'image
            const projectsWithImages = await Promise.all(result.map(async project => {
                // Pour chaque projet, on récupère les informations de chaque image
                const imagesWithName = await Promise.all(project.images.map(async imageLink => {
                    const image = await prisma.image.findUnique({
                        where: { id: imageLink.image_id },
                        select: { name: true }
                    });
                    return { ...imageLink, name: image?.name };
                }));
    
                return { ...project, images: imagesWithName };
            }));
    
            res.json(projectsWithImages);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Server error" });
        }
        next();
    }
    
    static async getProjectByDomainId(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);  
            const result = await prisma.project.findMany({
                where: { domain_id: id },
                include: {
                    user: true,
                    images: true,
                    domain: true // Inclure le domaine associé
                }
            });

            if (!result.length) {
                return res.status(404).json({ message: "No projects found" });
            }

            res.json(result);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Server error" });
        }
        next();
    }

    // Récupérer tous les projets
    static async getAllProjects(_req, res, next) {
        try {
            const result = await prisma.project.findMany({
                include: { 
                    user: true, 
                    images: true, 
                    domain: true // Inclure le domaine associé
                }
            });
            res.json(result);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Server error" });
        }
        next();
    }

    // Créer un projet
    static async createProject(req, res, next) {
        try {
            const { title, description, companyName, startDate, endDate, user_id, domain_id } = req.body;
    
            // Vérification des fichiers uploadés
            const uploadedFiles = req.files?.images;
            const images = Array.isArray(uploadedFiles) ? uploadedFiles : uploadedFiles ? [uploadedFiles] : [];
    
            if (images.length > 4) {
                return res.status(400).json({ error: "You can upload up to 4 images only." });
            }
    
            // Création du projet
            const newProject = await prisma.project.create({
                data: {
                    title,
                    description,
                    companyName,
                    startDate: new Date(startDate),
                    endDate: endDate ? new Date(endDate) : null,
                    user: { connect: { id: parseInt(user_id, 10) } },
                    domain: { connect: { id: parseInt(domain_id, 10) } },
                },
            });
    
            // Gestion des images
            for (const image of images) {
                const imageName = `${Date.now()}_${image.name}`;
                const imagePath = path.join('uploads', imageName);
    
                // Sauvegarde de l'image
                await image.mv(imagePath);
    
                // Enregistrement de l'image dans la base de données
                const newImage = await prisma.image.create({
                    data: { name: imageName },
                });
    
                // Association de l'image au projet
                await prisma.projectImage.create({
                    data: {
                        project_id: newProject.id,
                        image_id: newImage.id,
                    },
                });
            }
    
            res.status(201).json({ message: "Project created successfully", project: newProject });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Server error" });
        }
        next();
    }
    

    // Mettre à jour un projet
    static async updateProject(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);
            const { title, description, companyName, startDate, endDate, user_id, domain_id } = req.body;
    
            if (isNaN(id)) {
                return res.status(400).json({ error: "Invalid project ID." });
            }
    
            // Vérification des fichiers uploadés
            const uploadedFiles = req.files?.images;
            const images = Array.isArray(uploadedFiles) ? uploadedFiles : uploadedFiles ? [uploadedFiles] : [];
    
            if (images.length > 4) {
                return res.status(400).json({ error: "You can upload up to 4 images only." });
            }
    
            // Mise à jour du projet
            const updatedProject = await prisma.project.update({
                where: { id },
                data: {
                    title,
                    description,
                    companyName,
                    startDate: new Date(startDate),
                    endDate: endDate ? new Date(endDate) : null,
                    user: { connect: { id: parseInt(user_id, 10) } },
                    domain: { connect: { id: parseInt(domain_id, 10) } },
                },
            });
    
            // Supprimer les anciennes associations images-projet
            await prisma.projectImage.deleteMany({
                where: { project_id: updatedProject.id },
            });
    
            // Gestion des nouvelles images
            for (const image of images) {
                const imageName = `${Date.now()}_${image.name}`;
                const imagePath = path.join('uploads', imageName);
    
                // Sauvegarde de l'image
                await image.mv(imagePath);
    
                // Enregistrement de l'image dans la base de données
                const newImage = await prisma.image.create({
                    data: { name: imageName },
                });
    
                // Association de l'image au projet
                await prisma.projectImage.create({
                    data: {
                        project_id: updatedProject.id,
                        image_id: newImage.id,
                    },
                });
            }
    
            res.json({ message: "Project updated successfully", project: updatedProject });
        } catch (error) {
            if (error.code === "P2025") {
                res.status(404).json({ error: "Project not found." });
            } else {
                console.error(error.message);
                res.status(500).json({ error: "Server error" });
            }
        }
        next();
    }
    

    // Supprimer un projet
    static async deleteProject(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);  

            const deletedProject = await prisma.project.delete({
                where: { id: id },
            });

            res.json({ message: "Project deleted successfully", deletedProject });
        } catch (error) {
            if (error.code === 'P2025') {
                res.status(404).json({ error: "Project not found" });
            } else {
                console.error(error.message);
                res.status(500).json({ error: "Server error" });
            }
        }
        next();
    }
}

export default ProjectCtrl;
