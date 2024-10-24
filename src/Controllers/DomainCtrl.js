import prisma from "../config/prisma.js";

class DomainCtrl {

   
    static async getDomainById(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);
            const result = await prisma.domaine.findUnique({
                where: {
                    id: id,
                },
            });

            if (!result) {
                return res.status(404).json({ message: "Domain not found" });
            }

            res.json(result);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Server error" });
        }
        next();
    }

    
    static async getAllDomains(_req, res, next) {
        try {
            const result = await prisma.domaine.findMany();
            res.json(result);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Server error" });
        }
        next();
    }

   
    static async createDomain(req, res, next) {
        try {
            const { name } = req.body;

            const newDomain = await prisma.domaine.create({
                data: {
                    nom: name,
                },
            });

            res.status(201).json(newDomain);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Server error" });
        }
        next();
    }

   
    static async updateDomain(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);
            const { name } = req.body;

            const updatedDomain = await prisma.domaine.update({
                where: { id: id },
                data: {
                    nom: name,
                },
            });

            res.json(updatedDomain);
        } catch (error) {
            if (error.code === 'P2025') {
                res.status(404).json({ error: "Domain not found" });
            } else {
                console.error(error.message);
                res.status(500).json({ error: "Server error" });
            }
        }
        next();
    }

    
    static async deleteDomain(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);

            const deletedDomain = await prisma.domaine.delete({
                where: { id: id },
            });

            res.json({ message: "Domain deleted successfully", deletedDomain });
        } catch (error) {
            if (error.code === 'P2025') {
                res.status(404).json({ error: "Domain not found" });
            } else {
                console.error(error.message);
                res.status(500).json({ error: "Server error" });
            }
        }
        next();
    }
}

export default DomainCtrl;
