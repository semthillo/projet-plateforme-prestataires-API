import { check, param, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";

import prisma from "../config/prisma.js";

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const createProjectValid = [
  check("title")
    .notEmpty()
    .withMessage("Le titre du projet est obligatoire.")
    .bail()
    .matches(/^(?=.*[a-zA-Z])([a-zA-Z0-9 ]+)$/)
    .withMessage("Le titre ne doit contenir que des lettres, des chiffres et des espaces, et au moins une lettre.")
    .isLength({ min: 3, max: 100 })
    .withMessage("Le titre du projet doit contenir entre 3 et 100 caractères.")
    .bail(),
    check("description")
    .optional()
    .isLength({ min: 3, max: 500 })
    .withMessage("La doit avoir au minimum 3 caractères et au maximum 500 caractères ")
    .bail(),

  check("startDate")
    .notEmpty()
    .withMessage("La date et l'heure du debut projet sont obligatoires.")
    .bail(),

    check("companyName")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Le nom de l'entreprise doit avoir maximum 50 caractères")
    .bail(),

    check("domain_id")
    .notEmpty()
    .withMessage("Le domain est obligatoire")
    
    .bail(),


  handleValidationErrors,
];

export const editProjectValid = [
  param("id")
    .notEmpty()
    .withMessage("L'ID du projet est obligatoire.")
    .bail(),
    check("title")
    .notEmpty()
    .withMessage("Le titre du projet est obligatoire.")
    .matches(/^(?=.*[a-zA-Z])([a-zA-Z0-9 ]+)$/)
    .withMessage("Le titre ne doit contenir que des lettres, des chiffres et des espaces, et au moins une lettre.")
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage("Le titre du projet doit contenir entre 3 et 100 caractères.")
    .bail(),
    check("description")
    .optional()
    .isLength({ min: 3, max: 500 })
    .withMessage("La doit avoir au minimum 3 caractères et au maximum 500 caractères ")
    .bail(),

  check("startDate")
    .notEmpty()
    .withMessage("La date et l'heure du debut projet sont obligatoires.")
    .bail(),

    check("companyName")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Le nom de l'entreprise doit avoir maximum 50 caractères")
    .bail(),

    check("domain_id")
    .notEmpty()
    .withMessage("Le domain est obligatoire")
    
    .bail(),

  handleValidationErrors,
];

export const deleteProjectValid = [
  param("id")
    .notEmpty()
    .withMessage("L'ID du projet est obligatoire.")
    .bail()
    .custom(async (value) => {
      const result = await prisma.project.findUnique({
        where: { id: parseInt(value, 10) }
      });
      if (!result) {
        throw new Error("Le projet spécifié n'existe pas.");
      }
      return true;
    }),
  handleValidationErrors,
];
