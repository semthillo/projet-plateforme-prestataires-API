
import prisma from "../config/prisma.js";

class ServiceCtrl {
  
    static async getServiceById(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);
            const result = await prisma.service.findUnique({
                where: {
                    id: id,
                },
                include: {
                    user: true, // Inclure les informations de l'utilisateur associé
                    domain: {
                        select: {
                            name: true, // Inclure le champ 'name' du domaine
                        },
                    }, // Inclure le domaine associé
                    userServices: {
                        include: {
                            user: true, // Inclure les informations des utilisateurs liés via UserService
                        },
                    },
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
                include: {
                    user: true, // Inclure les informations de l'utilisateur
                    domain: true, // Inclure les informations du domaine
                },
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
            const { name, user_id, domain_id } = req.body;

            const newService = await prisma.service.create({
                data: {
                    name: name,
                    user: { connect: { id: user_id } }, // Associer l'utilisateur
                    domain: { connect: { id: domain_id } }, // Associer le domaine
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
            const { name, domain_id } = req.body;

            const updatedService = await prisma.service.update({
                where: { id: id },
                data: {
                    name: name,
                    domain: domain_id ? { connect: { id: domain_id } } : undefined, // Mettre à jour le domaine si fourni
                },
                include: {
                    user: true, // Inclure les informations de l'utilisateur
                    domain: true, // Inclure les informations du domaine
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
    
            // Vérifiez d'abord si le service est associé à un utilisateur
            const service = await prisma.service.findUnique({
                where: { id: id },
                include: { user: true }, // Inclure l'utilisateur associé
            });
    
            if (service && service.user) {
                // Si le service est associé à un utilisateur, ne permettez pas la suppression
                return res.status(400).json({ error: "Ce service est associé à un utilisateur et ne peut pas être supprimé." });
            }
    
            // Si le service n'est pas associé à un utilisateur, procédez à la suppression
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
