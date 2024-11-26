import prisma from "../config/prisma.js";

class DomainCtrl {
    // Récupérer un domaine par son ID
    static async getDomainById(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({ error: "Invalid ID" });
            }

            const result = await prisma.domain.findUnique({
                where: { id },
                include: {
                    users: {
                        include: {
                            user: true,
                        },
                    },
                    projects: true,
                    services: true,
                },
            });

            if (!result) {
                return res.status(404).json({ message: "Domain not found" });
            }

            res.json(result);
        } catch (error) {
            console.error("Error in getDomainById:", error.message);
            res.status(500).json({ error: "Server error" });
        }
        next();
    }

    // Récupérer tous les domaines
    static async getAllDomains(_req, res, next) {
        try {
            const result = await prisma.domain.findMany({
                include: {
                    users: {
                        include: {
                            user: true, // Inclure les utilisateurs associés au domaine
                        },
                    },
                    projects: true, // Inclure les projets associés au domaine
                    services: true, // Inclure les services associés au domaine
                },
            });

            res.json(result);
        } catch (error) {
            console.error("Error in getAllDomains:", error.message);
            res.status(500).json({ error: "Server error" });
        }
        next();
    }

    static async createDomain(req, res, next) {
        try {
            const { name } = req.body;
    
            // Vérifier si le nom du domaine est fourni
            if (!name) {
                return res.status(400).json({ error: "Domain name is required" });
            }
    
            // Vérifier si un domaine avec ce nom existe déjà
            const existingDomain = await prisma.domain.findFirst({
                where: { name },
            });
    
            if (existingDomain) {
                return res.status(400).json({ error: "Domain with this name already exists" });
            }
    
            // Créer un nouveau domaine
            const newDomain = await prisma.domain.create({
                data: { name },
            });
    
            res.status(201).json(newDomain);
        } catch (error) {
            console.error("Error in createDomain:", error.message);
            res.status(500).json({ error: "Server error" });
        }
        next();
    }
    
    // Mettre à jour un domaine
    static async updateDomain(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({ error: "Invalid ID" });
            }

            const { name } = req.body;

            // Vérifier si le nom est fourni
            if (!name) {
                return res.status(400).json({ error: "Domain name is required" });
            }

            // Mettre à jour le domaine dans la base de données
            const updatedDomain = await prisma.domain.update({
                where: { id },
                data: { name },
            });

            res.json(updatedDomain);
        } catch (error) {
            if (error.code === "P2025") {
                res.status(404).json({ error: "Domain not found" });
            } else {
                console.error("Error in updateDomain:", error.message);
                res.status(500).json({ error: "Server error" });
            }
        }
        next();
    }

    // Supprimer un domaine
    static async deleteDomain(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({ error: "Invalid ID" });
            }

            console.log("Tentative de suppression du domaine avec ID :", id);

            const deletedDomain = await prisma.domain.delete({
                where: { id },
            });

            res.json({ message: "Domain deleted successfully", deletedDomain });
        } catch (error) {
            if (error.code === "P2025") {
                res.status(404).json({ error: "Domain not found" });
            } else {
                console.error("Error in deleteDomain:", error.message);
                res.status(500).json({ error: "Server error" });
            }
        }
        next();
    }
}

export default DomainCtrl;
