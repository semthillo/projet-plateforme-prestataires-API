import prisma from "../config/prisma.js";

class UserCtrl {
    
    static async getUserById(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);  
            const result = await prisma.user.findUnique({
                where: {
                    id: id,  
                },
            });

            if (!result) {
                return res.status(404).json({ message: "User not found" });
            }

            res.json(result);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Server error" });
        }
        next();
    }

    
    static async getAllUsers(_req, res, next) {
        try {
            const result = await prisma.user.findMany();  
            res.json(result);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Server error" });
        }
        next();
    }


    static async createUser(req, res, next) {
        try {
            const { name, email, password, role } = req.body;

            
            const newUser = await prisma.user.create({
                data: {
                    name: name,
                    email: email,
                    password: password,  
                    role: role,
                },
            });

            res.status(201).json(newUser);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Server error" });
        }
        next();
    }




    static async updateUser(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);  
            const { name, email, password, role, address, telephone, description, hours } = req.body;
    
            const updatedUser = await prisma.user.update({
                where: { id: id },
                data: {
                    name: name,
                    email: email,
                    password: password,  
                    role: role,
                    adresse: address,
                    telephone: telephone,
                    description: description,
                    heures_travail: hours,
                },
            });
    
            res.json(updatedUser);
        } catch (error) {
            if (error.code === 'P2025') {
                
                res.status(404).json({ error: "User not found" });
            } else {
                console.error(error.message);
                res.status(500).json({ error: "Server error" });
            }
        }
        next();
    }
    


    static async deleteUser(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);  
    
            const deletedUser = await prisma.user.delete({
                where: { id: id },
            });
    
            res.json({ message: "User deleted successfully", deletedUser });
        } catch (error) {
            if (error.code === 'P2025') {
                res.status(404).json({ error: "User not found" });
            } else {
                console.error(error.message);
                res.status(500).json({ error: "Server error" });
            }
        }
        next();
    }
    
}

export default UserCtrl;
