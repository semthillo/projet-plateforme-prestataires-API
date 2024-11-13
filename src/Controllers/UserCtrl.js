import prisma from "../config/prisma.js";
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const SECRET_KEY = 'simplon2024';
const RESET_SECRET = 'simplonMars2024';

class UserCtrl {

    // Fonction utilitaire pour hacher les mots de passe
    static async hashPassword(password) {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }

    // Fonction utilitaire pour générer un token
    static generateToken(user) {
        return jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    }

    // Récupérer un utilisateur par son ID
    static async getUserById(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const result = await prisma.user.findUnique({
                where: { id },
                select: { 
                    id: true,
                    name: true,
                    email: true,
                    address: true,
                    role: true,
                    availability: true,
                    description: true,
                    telephone: true,
                    profil: true,
                    services: { select: { id: true, name: true }},
                    socialLinks: { select: { id: true, url: true, type: true }},
                    domains: { select: { domain: { select: { id: true, name: true }}}}
                }
            });

            if (!result) {
                return res.status(404).json({ message: "User not found" });
            }

            res.json(result);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Server error" });
        }
    }

    // Récupérer tous les utilisateurs
    static async getAllUsers(req, res) {
        try {
            const result = await prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    address: true,
                    role: true,
                    availability: true,
                    description: true,
                    telephone: true,
                    profil: true,
                    domains: { select: { domain: { select: { name: true }}}}, 
                    services: { select: { name: true }},
                    socialLinks: { select: { url: true, type: true }}
                }
            });

            const formattedResult = result.map(user => ({
                ...user,
                domains: user.domains.map(domain => domain.domain.name),
                services: user.services.map(service => service.name),
                socialLinks: user.socialLinks.map(link => ({ name: link.type, url: link.url }))
            }));

            res.json(formattedResult);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Server error" });
        }
    }

    
    static async createUser(req, res) {
        try {
            const { name, email, password, role, address, telephone, description, availability, profil, domains, services, socialLinks } = req.body;
    
            // Vérification du rôle
            if (!["admin", "prestataire"].includes(role)) {
                return res.status(400).json({ error: "Invalid role. Must be 'admin' or 'prestataire'." });
            }
    
            
            const hashedPassword = await UserCtrl.hashPassword(password);
    
            
            const existingServices = await prisma.service.findMany({
                where: {
                    name: {
                        in: services  
                    }
                }
            });
            const validServiceIds = existingServices.map(service => service.id);
    
            
            const existingDomains = await prisma.domain.findMany({
                where: {
                    name: {
                        in: domains  
                    }
                }
            });
            const validDomainIds = existingDomains.map(domain => domain.id);
    
            
            const newUser = await prisma.user.create({
                data: {
                    name, 
                    email, 
                    password: hashedPassword, 
                    role, 
                    address,
                    telephone, 
                    description, 
                    availability, 
                    profil,
                    domains: validDomainIds.length > 0 ? {
                        create: validDomainIds.map(domainId => ({
                            domain: { connect: { id: domainId } }
                        }))
                    } : undefined,
                    services: validServiceIds.length > 0 ? {
                        connect: validServiceIds.map(serviceId => ({
                            id: serviceId
                        }))
                    } : undefined,
                    socialLinks: socialLinks && socialLinks.length > 0 ? {
                        create: socialLinks.map(link => ({ url: link.url, type: link.type }))
                    } : undefined
                }
            });
    
            res.status(201).json({ ...newUser, password: undefined });
        } catch (error) {
            if (error.code === 'P2002' && error.meta.target.includes('User_telephone_key')) {
                res.status(400).json({ error: "Telephone number already in use" });
            } else {
                console.error(error.message);
                res.status(500).json({ error: "Server error" });
            }
        }
    }
    
    
    
    

    // Connexion de l'utilisateur
    static async login(req, res) {
        const { email, password } = req.body;
        try {
            const user = await prisma.user.findUnique({ where: { email }});
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ message: "Email ou mot de passe incorrect" });
            }

            const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
            return res.json({ message: "Connexion réussie", token, role: user.role, userId: user.id });
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la connexion" });
        }
        next();
    }

    // Réinitialiser le mot de passe
    static async resetPassword(req, res) {
        try {
            const { token, newPassword } = req.body;
            const decoded = jwt.verify(token, RESET_SECRET);
            const userId = decoded.id;

            const hashedPassword = await UserCtrl.hashPassword(newPassword);

            await prisma.user.update({
                where: { id: userId },
                data: { password: hashedPassword }
            });

            res.json({ message: "Password reset successfully" });
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                res.status(400).json({ error: "Token expired" });
            } else {
                console.error(error.message);
                res.status(500).json({ error: "Server error" });
            }
        }
    }

    // Mettre à jour un utilisateur
    static async updateUser(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({ error: "Invalid user ID format" });
            }

            const { name, email, password, role, address, telephone, description, availability, profil, domainIds, serviceIds, socialLinks } = req.body;

            if (role && !["admin", "prestataire"].includes(role)) {
                return res.status(400).json({ error: "Invalid role. Must be 'admin' or 'prestataire'." });
            }

            const hashedPassword = password ? await UserCtrl.hashPassword(password) : undefined;

            const updatedUser = await prisma.user.update({
                where: { id },
                data: {
                    name, 
                    email, 
                    password: hashedPassword, 
                    role, 
                    address, 
                    telephone, 
                    description, 
                    availability, 
                    profil,
                    domains: {
                        create: domainIds?.map(domainId => ({ domain: { connect: { id: domainId }}}))
                    },
                    services: {
                        connect: serviceIds?.map(serviceId => ({ id: serviceId }))
                    },
                    socialLinks: {
                        create: socialLinks?.map(link => ({ url: link.url, type: link.type }))
                    }
                }
            });

            res.json({ updatedUser, password: undefined });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Server error" });
        }
    }

    // Supprimer un utilisateur
    static async deleteUser(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            await prisma.user.delete({ where: { id } });
            res.status(204).json({ message: "User deleted successfully" });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Server error" });
        }
    }
}

export default UserCtrl;
