import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ error: 'Accès interdit, token manquant' });
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);

    req.utilisateur = decoded;

    next();
  } catch (error) {
    console.error('Erreur de token:', error);
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};