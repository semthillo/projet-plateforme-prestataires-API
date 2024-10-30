import prisma from "../config/prisma.js";

class LinksCtrl {

    static async getLinkById(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({ error: "Invalid link ID format" });
            }

            const result = await prisma.socialLink.findUnique({
                where: {
                    id: id,
                },
            });

            if (!result) {
                return res.status(404).json({ message: "Link not found" });
            }

            res.json(result);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Server error" });
        }
        next();
    }

    static async getAllLinks(_req, res, next) {
        try {
            const result = await prisma.socialLink.findMany();
            res.json(result);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Server error" });
        }
        next();
    }

    static async createLink(req, res, next) {
        try {
            const { url, type, user_id } = req.body;

            const newLink = await prisma.socialLink.create({
                data: {
                    url: url,
                    type: type,
                    user: { connect: { id: user_id } },
                },
            });

            res.status(201).json(newLink);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Server error" });
        }
        next();
    }

    static async updateLink(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({ error: "Invalid link ID format" });
            }

            const { url, type, user_id } = req.body;

            const updatedLink = await prisma.socialLink.update({
                where: { id: id },
                data: {
                    url: url,
                    type: type,
                    user: { connect: { id: user_id } },
                },
            });

            res.json(updatedLink);
        } catch (error) {
            if (error.code === 'P2025') {
                res.status(404).json({ error: "Link not found" });
            } else {
                console.error(error.message);
                res.status(500).json({ error: "Server error" });
            }
        }
        next();
    }

    static async deleteLink(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({ error: "Invalid link ID format" });
            }

            const deletedLink = await prisma.socialLink.delete({
                where: { id: id },
            });

            res.json({ message: "Link deleted successfully", deletedLink });
        } catch (error) {
            if (error.code === 'P2025') {
                res.status(404).json({ error: "Link not found" });
            } else {
                console.error(error.message);
                res.status(500).json({ error: "Server error" });
            }
        }
        next();
    }

}

export default LinksCtrl;
