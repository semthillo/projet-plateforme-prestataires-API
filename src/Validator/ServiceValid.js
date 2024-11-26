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
    // return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ errors: formattedErrors });
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validation pour la création de service
export const createServiceValid = [
  check("name")
    .notEmpty()
    .withMessage("Le nom du service est obligatoire.")
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage("Le nom du service doit contenir entre 3 et 100 caractères.")
    .bail()
    .custom(async (value) => {
      const result = await prisma.service.findUnique({
        where: { name: value },
      });
      if (result) {
        throw new Error("Un service avec ce nom existe déjà.");
      }
      return true;
    }),
  check("user_id")
    .notEmpty()
    .withMessage("L'ID de l'utilisateur est obligatoire.")
    .bail()
    .isInt()
    .withMessage("L'ID de l'utilisateur doit être un entier.")
    .bail()
    .custom(async (value) => {
      const userExists = await prisma.user.findUnique({
        where: { id: parseInt(value, 10) },
      });
      if (!userExists) {
        throw new Error("L'utilisateur spécifié n'existe pas.");
      }
      return true;
    }),
  handleValidationErrors,
];

// Validation pour la modification de service
export const editServiceValid = [
  param("id")
    .notEmpty()
    .withMessage("L'ID du service est obligatoire.")
    .bail()
    .isInt()
    .withMessage("L'ID du service doit être un entier.")
    .bail(),
  check("name")
    .notEmpty()
    .withMessage("Le nom du service est obligatoire.")
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage("Le nom du service doit contenir entre 3 et 100 caractères."),
  handleValidationErrors,
];

// Validation pour la suppression de service
export const deleteServiceValid = [
  param("id")
    .notEmpty()
    .withMessage("L'ID du service est obligatoire.")
    .bail()
    .isInt()
    .withMessage("L'ID du service doit être un entier.")
    .bail()
    .custom(async (value) => {
      const result = await prisma.service.findUnique({
        where: { id: parseInt(value, 10) },
      });
      if (!result) {
        throw new Error("Le service spécifié n'existe pas.");
      }
      return true;
    }),
  handleValidationErrors,
];
