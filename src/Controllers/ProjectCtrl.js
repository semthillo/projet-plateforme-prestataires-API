import prisma from "../config/prisma.js";

class ProjectCtrl {
    
    
    static async getProjectById(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);  
            const result = await prisma.project.findUnique({
                where: { id: id },
                include: { user: true, images: true }  
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
    static async getProjectByUserId(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);  
            const result = await prisma.project.findMany({
                where: { user_id: id },
                
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


    
    static async getAllProjects(_req, res, next) {
        try {
            const result = await prisma.project.findMany({
                include: { user: true, images: true }  
            });
            res.json(result);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Server error" });
        }
        next();
    }

    
    static async createProject(req, res, next) {
        try {
            const { title, date_heure, description, user_id, images = [] } = req.body;

            const newProject = await prisma.project.create({
                data: {
                    title: title,
                    date_heure: new Date(date_heure),
                    description: description,
                    user: { connect: { id: user_id } },
                },
            });

            for (let i = 0; i < images.length; i++) {
                const newImage = await prisma.image.create({
                    data: {
                        name: images[i]
                    }
                });
                await prisma.projectImage.create({
                    data: {
                        project_id: newProject.id,
                        image_id: newImage.id
                    }
                });
            }

            res.status(201).json(newProject);

        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Server error" });
        }
        next();
    }

   
    static async updateProject(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);

            if (isNaN(id)) {
                return res.status(400).json({ error: "Invalid ID format" });
            }

            const { title, date_heure, description, user_id, images = [] } = req.body;

         
            const updatedProject = await prisma.project.update({
                where: { id: id },
                data: {
                    title: title,
                    date_heure: new Date(date_heure),
                    description: description,
                    user: { connect: { id: parseInt(user_id, 10) } }
                },
            });
            await prisma.toContain.deleteMany({
                where: { project_id: updatedProject.id }
            });

           
            for (let i = 0; i < images.length; i++) {
                const imageName = images[i];

                
                const existingImage = await prisma.image.findUnique({
                    where: { name: imageName }
                });

                let imageId;

                if (existingImage) {
                    
                    const updatedImage = await prisma.image.update({
                        where: { id: existingImage.id },
                        data: { name: imageName }
                    });
                    imageId = updatedImage.id;
                } else {
                    
                    const newImage = await prisma.image.create({
                        data: { name: imageName }
                    });
                    imageId = newImage.id;
                }

                
                await prisma.toContain.create({
                    data: {
                        project_id: updatedProject.id,
                        image_id: imageId
                    }
                });
            }

            res.json(updatedProject);
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
