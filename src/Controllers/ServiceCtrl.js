import prisma from "../config/prisma.js";

class ServiceCtrl {
  
    
    static async getServiceById(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);
            const result = await prisma.service.findUnique({
                where: {
                    id: id,
                },
              
            });

            if (!result) {
                return res.status(404).json({ message: "Service not found" });
            }

            res.json(result);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Server error" });
        }
        next();
    }

    
    static async getAllServices(_req, res, next) {
        try {
            const result = await prisma.service.findMany({
               
            });
            res.json(result);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Server error" });
        }
        next();
    }

    
    static async createService(req, res, next) {
        try {
            const { name, user_id } = req.body;

            const newService = await prisma.service.create({
                data: {
                    name: name,
                    user: { connect: { id: user_id } },
                },
            });

            res.status(201).json(newService);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Server error" });
        }
        next();
    }

    
    static async updateService(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);
            const { name, user_id } = req.body;

            const updatedService = await prisma.service.update({
                where: { id: id },
                data: {
                    name: name,
                    user: { connect: { id: user_id } },
                },
            });

            res.json(updatedService);
        } catch (error) {
            if (error.code === 'P2025') {
                res.status(404).json({ error: "Service not found" });
            } else {
                console.error(error.message);
                res.status(500).json({ error: "Server error" });
            }
        }
        next();
    }

    
    static async deleteService(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);
            console.log("Tentative de suppression du service avec ID :", id);

            const deletedService = await prisma.service.delete({
                where: { id: id },
            });

            res.json({ message: "Service deleted successfully", deletedService });
        } catch (error) {
            if (error.code === 'P2025') {
                res.status(404).json({ error: "Service not found" });
            } else {
                console.error(error.message);
                res.status(500).json({ error: "Server error" });
            }
        }
        next();
    }
}

export default ServiceCtrl;
