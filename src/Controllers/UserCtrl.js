import prisma from "../config/prisma.js";
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const SECRET_KEY = 'simplon2024';
const RESET_SECRET = 'simplonMars2024';

class UserCtrl {
    
    static async getUserById(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);  
            const result = await prisma.user.findUnique({
                where: { id },
                select: { 
                    id: true, name: true, email: true, address: true, role: true,
                    availability: true, description: true, telephone: true
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
        next();
    }

    
    static async getAllUsers(_req, res, next) {
        try {
            const result = await prisma.user.findMany({
                select: {
                    id: true, name: true, email: true, address: true, role: true,
                    availability: true, description: true, telephone: true
                }
            });
            res.json(result);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Server error" });
        }
        next();
    }


    static async createUser(req, res, next) {
        try {
            const { name, email, password, role, address, telephone, description, availability } = req.body;

            // Hachage du mot de passe
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const newUser = await prisma.user.create({
                data: {
                    name, email, password: hashedPassword, role, address,
                    telephone, description, availability
                }
            });

            res.status(201).json({ ...newUser, password: undefined });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Server error" });
        }
        next();
    }

    static async loginUser(req, res, next) {
        try {
            const { email, password } = req.body;

            const user = await prisma.user.findUnique({
                where: { email }
            });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });

            res.json({ message: "Login successful", token });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Server error" });
        }
        next();
    }


    static async resetPassword(req, res) {
        try {
            const { token, newPassword } = req.body;

            const decoded = jwt.verify(token, RESET_SECRET);
            const userId = decoded.id;

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

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


    static async updateUser(req, res, next) {
        try {
            const id = parseInt(req.params.id, 10);

            if (isNaN(id)) {
                return res.status(400).json({ error: "Invalid user ID format" });
            }

            const { name, email, password, role, address, telephone, description, availability } = req.body;
            const data = { name, email, role, address, telephone, description, availability };

            if (password) {
                const saltRounds = 10;
                data.password = await bcrypt.hash(password, saltRounds);
            }

            const updatedUser = await prisma.user.update({
                where: { id },
                data
            });

            res.json({ ...updatedUser, password: undefined });
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
                where: { id }
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

    static async requestPasswordReset(req, res) {
        try {
            const { email } = req.body;
            const user = await prisma.user.findUnique({ where: { email } });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const resetToken = jwt.sign({ id: user.id }, RESET_SECRET, { expiresIn: '1h' });

            const transporter = nodemailer.createTransport({
                service: 'gmail', 
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            });

            const resetUrl = `http://localhost:3005/api/reset-password?token=${resetToken}`;

            await transporter.sendMail({
                from: 'Plateforme de mis en relation',
                to: user.email,
                subject: "Password Reset Request",
                html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`
            });

            res.json({ message: "Password reset email sent" });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ error: "Server error" });
        }
    }
}

export default UserCtrl;
