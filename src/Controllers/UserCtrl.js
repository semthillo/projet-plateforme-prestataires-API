// import prisma from "../config/prisma.js";
// import bcrypt from 'bcrypt';
// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';
// import jwt from 'jsonwebtoken';
// import { resetPassword, sendPasswordResetEmail, updateCurrentUser, } from '../serivices/userService.js'
// dotenv.config();
// const SECRET_KEY = 'simplon2024';
// const RESET_SECRET = 'simplonMars2024';

// class UserCtrl {
//     static async getUsersByDomain(req, res) {
//         const { domainName } = req.params; // Récupérer le domaine depuis les paramètres de la requête
      
//         try {
//           // Chercher le domaine par son nom et inclure les utilisateurs associés
//           const domainWithUsers = await prisma.domain.findFirst({
//             where: {
//               name: domainName, // Filtrer par le nom du domaine
//             },
//             include: {
//               users: { // Inclure les utilisateurs via la table de jointure UserDomain
//                 include: {
//                   user: true, // Inclure toutes les informations de l'utilisateur
//                 },
//               },
//             },
//           });
      
//           // Vérifier si le domaine a été trouvé
//           if (!domainWithUsers) {
//             return res.status(404).json({ message: 'Domaine non trouvé' });
//           }
      
//           // Extraire les utilisateurs associés à ce domaine
//           const users = domainWithUsers.users.map(userDomain => userDomain.user);
      
//           // Retourner la liste des utilisateurs avec toutes leurs informations
//           return res.status(200).json(users);
//         } catch (error) {
//           return res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error: error.message });
//         }
//       }

//      static async getUserByService(req, res) {
//         const serviceId = parseInt(req.params.serviceId); // Récupère l'ID du service à partir des paramètres de l'URL
        
//         try {
//           const users = await prisma.user.findMany({
//             where: {
//               services: {
//                 some: {
//                   id: serviceId // Filtre les utilisateurs liés au service spécifique
//                 }
//               }
//             },
//             include: {
//               services: true, // Inclut les services associés à l'utilisateur
//               domains: true,  // Inclut également les domaines associés à l'utilisateur
//             }
//           });
      
//           if (users.length === 0) {
//             return res.status(404).json({ message: 'Aucun utilisateur trouvé pour ce service' });
//           }
      
//           return res.json(users); // Retourne les utilisateurs au frontend
//         } catch (error) {
//           console.error('Erreur lors de la récupération des utilisateurs:', error);
//           return res.status(500).json({ message: 'Erreur du serveur' });
//         }
//       }
  
      
      
      

//     // Fonction utilitaire pour hacher les mots de passe
//     static async hashPassword(password) {
//         const saltRounds = 10;
//         return bcrypt.hash(password, saltRounds);
//     }

//     // Fonction utilitaire pour générer un token
//     static generateToken(user) {
//         return jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
//     }

//     // Récupérer un utilisateur par son ID
//     static async getUserById(req, res) {
//         try {
//             const id = parseInt(req.params.id, 10);
//             const result = await prisma.user.findUnique({
//                 where: { id },
//                 select: { 
//                     id: true,
//                     name: true,
//                     email: true,
//                     address: true,
//                     role: true,
//                     availability: true,
//                     description: true,
//                     telephone: true,
//                     profil: true,
//                     services: { select: { id: true, name: true }},
//                     socialLinks: { select: { id: true, url: true, type: true }},
//                     domains: { select: { domain: { select: { id: true, name: true }}}}
//                 }
//             });

//             if (!result) {
//                 return res.status(404).json({ message: "User not found" });
//             }

//             res.json(result);
//         } catch (error) {
//             console.error(error.message);
//             res.status(500).json({ error: "Server error" });
//         }
//     }

//     // Récupérer tous les utilisateurs
//     static async getAllUsers(req, res) {
//         try {
//             const result = await prisma.user.findMany({
//                 select: {
//                     id: true,
//                     name: true,
//                     email: true,
//                     address: true,
//                     role: true,
//                     availability: true,
//                     description: true,
//                     telephone: true,
//                     profil: true,
//                     domains: { select: { domain: { select: { name: true }}}}, 
//                     services: { select: { name: true }},
//                     socialLinks: { select: { url: true, type: true }}
//                 }
//             });

//             const formattedResult = result.map(user => ({
//                 ...user,
//                 domains: user.domains.map(domain => domain.domain.name),
//                 services: user.services.map(service => service.name),
//                 socialLinks: user.socialLinks.map(link => ({ name: link.type, url: link.url }))
//             }));

//             res.json(formattedResult);
//         } catch (error) {
//             console.error(error.message);
//             res.status(500).json({ error: "Server error" });
//         }
//     }

    
//     static async createUser(req, res) {
//         try {
//             const { name, email, password, role, address, telephone, description, availability, profil, domains, services, socialLinks } = req.body;
    
//             // Vérification du rôle
//             if (!["admin", "prestataire"].includes(role)) {
//                 return res.status(400).json({ error: "Invalid role. Must be 'admin' or 'prestataire'." });
//             }
    
            
//             const hashedPassword = await UserCtrl.hashPassword(password);
    
            
//             const existingServices = await prisma.service.findMany({
//                 where: {
//                     name: {
//                         in: services  
//                     }
//                 }
//             });
//             const validServiceIds = existingServices.map(service => service.id);
    
            
//             const existingDomains = await prisma.domain.findMany({
//                 where: {
//                     name: {
//                         in: domains  
//                     }
//                 }
//             });
//             const validDomainIds = existingDomains.map(domain => domain.id);
    
            
//             const newUser = await prisma.user.create({
//                 data: {
//                     name, 
//                     email, 
//                     password: hashedPassword, 
//                     role, 
//                     address,
//                     telephone, 
//                     description, 
//                     availability, 
//                     profil,
//                     domains: validDomainIds.length > 0 ? {
//                         create: validDomainIds.map(domainId => ({
//                             domain: { connect: { id: domainId } }
//                         }))
//                     } : undefined,
//                     services: validServiceIds.length > 0 ? {
//                         connect: validServiceIds.map(serviceId => ({
//                             id: serviceId
//                         }))
//                     } : undefined,
//                     socialLinks: socialLinks && socialLinks.length > 0 ? {
//                         create: socialLinks.map(link => ({ url: link.url, type: link.type }))
//                     } : undefined
//                 }
//             });
    
//             res.status(201).json({ ...newUser, password: undefined });
//         } catch (error) {
//             if (error.code === 'P2002' && error.meta.target.includes('User_telephone_key')) {
//                 res.status(400).json({ error: "Telephone number already in use" });
//             } else {
//                 console.error(error.message);
//                 res.status(500).json({ error: "Server error" });
//             }
//         }
//     }
    
    
    
    

//     // Connexion de l'utilisateur
//     static async login(req, res) {
//         const { email, password } = req.body;
//         try {
//             const user = await prisma.user.findUnique({ where: { email }});
//             if (!user || !(await bcrypt.compare(password, user.password))) {
//                 return res.status(401).json({ message: "Email ou mot de passe incorrect" });
//             }

//             const token = jwt.sign({ userId: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
//             return res.json({ message: "Connexion réussie", token, role: user.role, userId: user.id });
//         } catch (error) {
//             res.status(500).json({ message: "Erreur lors de la connexion" });
//         }
//         next();
//     }

 
//     static async  restPassword(req, res) {
//         const { token, newPassword } = req.body;
//         try {
//           const response = await resetPassword(token, newPassword);
//           res.status(200).json(response);
//         } catch (error) {
//           res.status(400).json({ message: error.message });
//         }
//       }

//     static async  requestPasswordReset(req, res) {
//         const { email } = req.body;
//         try {
//           const response = await sendPasswordResetEmail(email);
//           res.status(200).json(response);
//         } catch (error) {
//           res.status(400).json({ message: error.message });
//         }
//       }

//     // Mettre à jour un utilisateur
//     static async updateUser(req, res) {
//         try {
//             const id = parseInt(req.params.id, 10);
//             if (isNaN(id)) {
//                 return res.status(400).json({ error: "Invalid user ID format" });
//             }

//             const { name, email, password, role, address, telephone, description, availability, profil, domainIds, serviceIds, socialLinks } = req.body;

//             if (role && !["admin", "prestataire"].includes(role)) {
//                 return res.status(400).json({ error: "Invalid role. Must be 'admin' or 'prestataire'." });
//             }

//             const hashedPassword = password ? await UserCtrl.hashPassword(password) : undefined;

//             const updatedUser = await prisma.user.update({
//                 where: { id },
//                 data: {
//                     name, 
//                     email, 
//                     password: hashedPassword, 
//                     role, 
//                     address, 
//                     telephone, 
//                     description, 
//                     availability, 
//                     profil,
//                     domains: {
//                         create: domainIds?.map(domainId => ({ domain: { connect: { id: domainId }}}))
//                     },
//                     services: {
//                         connect: serviceIds?.map(serviceId => ({ id: serviceId }))
//                     },
//                     socialLinks: {
//                         create: socialLinks?.map(link => ({ url: link.url, type: link.type }))
//                     }
//                 }
//             });

//             res.json({ updatedUser, password: undefined });
//         } catch (error) {
//             console.error(error.message);
//             res.status(500).json({ error: "Server error" });
//         }
//     }

// static async deleteUser(req, res) {
//     try {
//         const id = parseInt(req.params.id, 10);

//         // Vérifie les données associées avant de supprimer l'utilisateur
//         const userProjects = await prisma.project.findMany({ where: { user_id: id } });
//         const userSocialLinks = await prisma.socialLink.findMany({ where: { user_id: id } });
//         const userServices = await prisma.service.findMany({ where: { user_id: id } });
//         const userDomains = await prisma.userDomain.findMany({ where: { user_id: id } });

        

//         // Si des données sont trouvées, essaie de les supprimer
//         if (userProjects.length > 0) {
//             await prisma.project.deleteMany({ where: { user_id: id } });
//         }
//         if (userSocialLinks.length > 0) {
//             await prisma.socialLink.deleteMany({ where: { user_id: id } });
//         }
//         if (userServices.length > 0) {
//             await prisma.service.deleteMany({ where: { user_id: id } });
//         }
//         if (userDomains.length > 0) {
//             await prisma.userDomain.deleteMany({ where: { user_id: id } });
//         }

//         // Supprime l'utilisateur
//         await prisma.user.delete({ where: { id } });

//         res.status(204).json({ message: "User deleted successfully" });
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ error: "Server error" });
//     }
// }


// }


// export default UserCtrl;



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
            const response = await sendPasswordResetEmail(email);
            res.status(200).json(response);
        } catch (error) {
            res.status(400).json({ message: error.message });
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
        try {
          const userId = parseInt(req.params.id, 10);
          await prisma.user.delete({ where: { id: userId } });
          res.status(204).json({ message: "Utilisateur supprimé avec succès" });
        } catch (error) {
          console.error(error.message);
          res.status(500).json({ error: "Erreur lors de la suppression de l'utilisateur" });
        }
      }
}

export default UserCtrl;

