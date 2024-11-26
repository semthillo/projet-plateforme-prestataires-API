import { check, param, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";

import prisma from "../config/prisma.js";

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // const formattedErrors = errors.array().map((error) => ({
    //   field: error.param,
    //   message: error.msg,
    // }));
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validation pour la création de domaine
export const createDomainValid = [
  check("name")
    .notEmpty()
    .withMessage("Le nom du domaine est obligatoire.")
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage("Le nom du domaine doit contenir entre 3 et 100 caractères.")
    .bail()
    .custom(async (value) => {
      // Utilisation de findFirst au lieu de findUnique
      const result = await prisma.domain.findFirst({
        where: { name: value },
      });
      if (result) {
        throw new Error("Un domaine avec ce nom existe déjà.");
      }
      return true;
    }),
  handleValidationErrors,
];


// Validation pour la modification de domaine
export const editDomainValid = [
  // Vérification de l'ID
  param("id")
    .notEmpty()
    .withMessage("L'ID du domaine est obligatoire.")
    .bail()
    .isInt()
    .withMessage("L'ID du domaine doit être un entier valide.")
    .bail(),

  // Vérification du nom
  check("name")
    .notEmpty()
    .withMessage("Le nom du domaine est obligatoire.")
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage("Le nom du domaine doit contenir entre 3 et 100 caractères.")
    .bail()
    .custom(async (value, { req }) => {
      const domainId = parseInt(req.params.id); // ID du domaine actuel
      const domainName = value;

      // Récupérer le domaine actuel par ID
      const existingDomain = await prisma.domain.findUnique({
        where: { id: domainId },
      });

      if (!existingDomain) {
        throw new Error("Domaine introuvable.");
      }

      // Si le nom n'a pas changé, passer la validation
      if (domainName === existingDomain.name) {
        return true;
      }

      // Vérifier si un autre domaine existe avec le même nom
      const domainExists = await prisma.domain.findFirst({
        where: { name: value },
      });

      if (domainExists) {
        throw new Error("Ce nom de domaine existe déjà.");
      }

      return true;
    }),

  handleValidationErrors,
];



// Validation pour la suppression de domaine
export const deleteDomainValid = [
  param("id")
    .notEmpty()
    .withMessage("L'ID du domaine est obligatoire.")
    .bail()
    .isInt()
    .withMessage("L'ID du domaine doit être un entier valide.")
    .bail()
    .custom(async (value) => {
      const result = await prisma.domain.findUnique({
        where: { id: parseInt(value, 10) }, // S'assurer que l'ID est un entier
      });
      if (!result) {
        throw new Error("Le domaine spécifié n'existe pas.");
      }
      return true;
    }),
  handleValidationErrors,
];
