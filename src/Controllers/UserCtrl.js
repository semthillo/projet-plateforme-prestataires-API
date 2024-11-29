

import prisma from "../config/prisma.js";
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import { resetPassword, sendPasswordResetEmail } from "../serivices/userService.js";
dotenv.config();
const SECRET_KEY = 'simplon2024';

class UserCtrl {
    // Récupérer les utilisateurs par domaine
    static async getUsersByDomain(req, res) {
        const { domainName } = req.params;
        try {
            const domainWithUsers = await prisma.domain.findFirst({
                where: { name: domainName },
                include: {
                    users: {
                        include: {
                            user: true,
                        },
                    },
                },
            });

            if (!domainWithUsers) {
                return res.status(404).json({ message: 'Domaine non trouvé' });
            }

            const users = domainWithUsers.users.map(userDomain => userDomain.user);
            return res.status(200).json(users);
        } catch (error) {
            return res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error: error.message });
        }
    }

    // Récupérer les utilisateurs par service
    static async getUserByService(req, res) {
        const serviceId = parseInt(req.params.serviceId);
        try {
            const users = await prisma.user.findMany({
                where: {
                    services: {
                        some: { id: serviceId },
                    },
                },
                include: {
                    services: true,
                    domains: true,
                },
            });

            if (users.length === 0) {
                return res.status(404).json({ message: 'Aucun utilisateur trouvé pour ce service' });
            }

            return res.json(users);
        } catch (error) {
            return res.status(500).json({ message: 'Erreur du serveur', error: error.message });
        }
    }

    // Utilitaire : Hacher les mots de passe
    static async hashPassword(password) {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }

    // Utilitaire : Générer un token JWT
    static generateToken(user) {
        return jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    }

    // Récupérer un utilisateur par ID
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
                    services: { select: { id: true, name: true } },
                    socialLinks: { select: { id: true, url: true, type: true } },
                    domains: { select: { domain: { select: { id: true, name: true } } } },
                },
            });

            if (!result) {
                return res.status(404).json({ message: "Utilisateur introuvable" });
            }

            res.json(result);
        } catch (error) {
            return res.status(500).json({ message: "Erreur du serveur", error: error.message });
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
                    domains: { select: { domain: { select: { name: true } } } },
                    services: { select: { name: true } },
                    socialLinks: { select: { url: true, type: true } },
                },
            });

            const formattedResult = result.map(user => ({
                ...user,
                domains: user.domains.map(domain => domain.domain.name),
                services: user.services.map(service => service.name),
                socialLinks: user.socialLinks.map(link => ({ name: link.type, url: link.url })),
            }));

            res.json(formattedResult);
        } catch (error) {
            return res.status(500).json({ message: "Erreur du serveur", error: error.message });
        }
    }

    // Créer un utilisateur
    static async createUser(req, res) {
        try {
            const { name, email, password, role, address, telephone, description, availability, profil, domains, services, socialLinks } = req.body;

            if (!["admin", "prestataire"].includes(role)) {
                return res.status(400).json({ error: "Rôle invalide. Doit être 'admin' ou 'prestataire'." });
            }

            const hashedPassword = await UserCtrl.hashPassword(password);

            const existingServices = await prisma.service.findMany({
                where: {
                    id: { in: services }, // 'services' contient des IDs
                },
            });
            
            const validServiceIds = existingServices.map(service => service.id);

            const existingDomains = await prisma.domain.findMany({
                where: {
                    id: { in: domains }, // 'domains' est un tableau d'IDs
                },
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
                    domains: validDomainIds.length > 0
                        ? {
                              create: validDomainIds.map(domainId => ({
                                  domain: { connect: { id: domainId } },
                              })),
                          }
                        : undefined,
                    services: validServiceIds.length > 0
                        ? {
                              connect: validServiceIds.map(serviceId => ({ id: serviceId })),
                          }
                        : undefined,
                    socialLinks: socialLinks && socialLinks.length > 0
                        ? {
                              create: socialLinks.map(link => ({ url: link.url, type: link.type })),
                          }
                        : undefined,
                },
            });

            res.status(201).json({ ...newUser, password: undefined });
        } catch (error) {
            if (error.code === 'P2002' && error.meta.target.includes('User_telephone_key')) {
                return res.status(400).json({ error: "Numéro de téléphone déjà utilisé." });
            } else {
                return res.status(500).json({ error: "Erreur du serveur", error: error.message });
            }
        }
    }

    // Connexion utilisateur
    static async login(req, res) {
        const { email, password } = req.body;
        try {
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ message: "Email ou mot de passe incorrect" });
            }

            const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
            return res.json({ message: "Connexion réussie", token, role: user.role, userId: user.id });
        } catch (error) {
            return res.status(500).json({ message: "Erreur lors de la connexion", error: error.message });
        }
    }

    // Réinitialisation de mot de passe
    static async resetPassword(req, res) {
        const { token, newPassword } = req.body;
        try {
            const response = await resetPassword(token, newPassword);
            res.status(200).json(response);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Demande de réinitialisation de mot de passe
    static async requestPasswordReset(req, res) {
        const { email } = req.body;
        try {
            // Vérifiez si l'email existe dans la base de données
            const user = await prisma.user.findUnique({ where: { email } });
    
            if (!user) {
                // Si l'email n'existe pas, retournez une erreur
                return res.status(404).json({ message: "L'adresse e-mail n'existe pas." });
            }
    
            // Envoyer l'email de réinitialisation si l'utilisateur est trouvé
            const response = await sendPasswordResetEmail(email);
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: "Une erreur s'est produite lors du traitement de la demande." });
        }
    }
    

    static async updateUser(req, res) {
        try {
            const userId = parseInt(req.params.id, 10);
    
            const {
                name,
                email,
                password,
                role,
                address,
                telephone,
                description,
                availability,
                profil,
                socialLinks = [],
            } = req.body;
    
            // Hacher le mot de passe si nécessaire
            const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    
            // Construire l'objet de mise à jour
            const updateData = {
                name,
                email,
                role,
                address,
                telephone,
                description,
                availability,
                profil,
            };
    
            // Ajouter le mot de passe uniquement s'il est fourni
            if (hashedPassword) {
                updateData.password = hashedPassword;
            }
    
            // Ajouter ou remplacer les liens sociaux
             if (socialLinks.length > 0) {
            // Déconnecter tous les liens existants pour cet utilisateur
            await prisma.socialLink.deleteMany({
                where: { user_id: userId }, // Supprime uniquement les liens pour cet utilisateur
            });

            // Ajouter les nouveaux liens sociaux
            updateData.socialLinks = {
                create: socialLinks.map((link) => ({
                    type: link.type,
                    url: link.url,
                })),
            };
        }

    
            // Mettre à jour l'utilisateur
            const user = await prisma.user.update({
                where: { id: userId },
                data: updateData,
            });
    
            res.json({ ...user, password: undefined });
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'utilisateur :", error.message);
            res.status(500).json({ error: "Erreur lors de la mise à jour de l'utilisateur" });
        }
    }
    
    
      // Supprimer un utilisateur
      static async deleteUser(req, res) {
        const userId = parseInt(req.params.id, 10);
        
        if (isNaN(userId)) {
          return res.status(400).json({ error: "ID utilisateur invalide." });
        }
      
        try {
          // Démarrer une transaction
          const result = await prisma.$transaction(async (prisma) => {
            // Vérifier si l'utilisateur existe
            const userExists = await prisma.user.findUnique({
              where: { id: userId },
            });
            if (!userExists) {
              throw new Error("Utilisateur non trouvé");
            }
      
            // Supprimer les images des projets de l'utilisateur
            const projects = await prisma.project.findMany({ where: { user_id: userId } });
            for (const project of projects) {
              await prisma.projectImage.deleteMany({ where: { project_id: project.id } });
            }
      
            // Supprimer les projets de l'utilisateur
            await prisma.project.deleteMany({ where: { user_id: userId } });
      
            // Supprimer les services et liens sociaux de l'utilisateur
            await prisma.service.deleteMany({ where: { user_id: userId } });
            await prisma.socialLink.deleteMany({ where: { user_id: userId } });
      
            // Supprimer l'utilisateur
            await prisma.user.delete({ where: { id: userId } });
          });
      
          res.status(204).json({ message: "Utilisateur supprimé avec succès" });
        } catch (error) {
          console.error("Erreur lors de la suppression de l'utilisateur:", error);
          res.status(500).json({ error: `Erreur lors de la suppression de l'utilisateur: ${error.message}` });
        }
      }
      
      
      
      
      
}

export default UserCtrl;

