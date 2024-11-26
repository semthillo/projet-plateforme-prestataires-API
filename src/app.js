import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import prisma from './config/prisma.js';
import routerUser from './routes/usersRoute.js';
import routerDomain from './routes/domainRoute.js';
import routerProject from './routes/projectRoute.js';
import routerLinks from './routes/linkRoute.js';
import i18n from './i18n.js';
import routerService from './routes/serviceRouter.js';
import cors from 'cors';
import expressFileUpload from 'express-fileupload';
import fs from 'fs';
import path from 'path';

// Utilisation de path.resolve() pour obtenir un chemin absolu sans problème de doublons
const __dirname = path.resolve(); // Cela donne le bon chemin absolu sans duplication

dotenv.config();

const app = express();
const uploadsDir = path.join(__dirname, 'uploads');

// Vérifier si le dossier 'uploads' existe, sinon le créer
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true }); // Crée le dossier 'uploads' s'il n'existe pas
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(i18n.init);
app.use(expressFileUpload({
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de taille de fichier (5MB)
  abortOnLimit: true,
  createParentPath: true,
  useTempFiles: true,
  tempFileDir: uploadsDir, // Dossier temporaire pour le fichier
}));

// Route d'upload
app.post('/api/upload', async (req, res) => {
  try {
    // Vérifier si un fichier a été envoyé
    if (!req.files || !req.files.upload) {
      return res.status(400).json({ message: 'No file uploaded or invalid field name' });
    }

    const uploadedFile = req.files.upload;

    // Limiter la longueur du nom du fichier
    let imageName = uploadedFile.name;
    if (uploadedFile.name.length > 13) {
      imageName = `${uploadedFile.name.substring(0, 13).replace('.', '_')}_.${uploadedFile.name.split('.').pop()}`;
    }

    // Chemin final pour sauvegarder le fichier
    const uploadPath = path.join(uploadsDir, imageName);

    // Vérification si un fichier avec le même nom existe déjà
    const files = await fs.promises.readdir(uploadsDir);

    // Si un fichier avec le même nom existe déjà, le supprimer ou le renommer
    if (files.includes(imageName)) {
      // Option 1: Supprimer l'ancien fichier et remplacer avec le nouveau
      await fs.promises.unlink(path.join(uploadsDir, imageName));  // Supprimer le fichier existant
      console.log(`Old file ${imageName} deleted`);
    }

    // Déplacer le fichier vers le dossier final
    await uploadedFile.mv(uploadPath);

    // Répondre à l'utilisateur avec la réussite de l'upload
    return res.status(200).json({
      success: true,
      name: imageName,
      message: 'File uploaded and saved successfully',
      imageUrl: `http://localhost:3005/uploads/${imageName}`
    });

  } catch (error) {
    console.error('File upload error:', error);
    return res.status(500).json({ message: 'Failed to save file', error: error.message });
  }
});


// Routes supplémentaires
app.use('/api', routerUser);
app.use('/api', routerDomain);
app.use('/api', routerProject);
app.use('/api', routerLinks);
app.use('/api', routerService);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Lancement du serveur
const port = 3005;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
