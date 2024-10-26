import { check, param, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import prisma from "../config/prisma.js";

// Middleware pour gérer les erreurs de validation
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.param,
      message: error.msg,
    }));
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ errors: formattedErrors });
  }
  next();
};

// Validation pour la création de domaine
export const createDomainValid = [
  check("name")
    .notEmpty()
    .withMessage("Domain name is required!")
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage("The domain name must be between 3 and 100 characters.")
    .bail()
    .custom(async (value) => {
      const result = await prisma.domain.findUnique({
        where: { name: value },
      });
      if (result) {
        throw new Error("This domain already exists!");
      }
      return true;
    }),
  handleValidationErrors,
];

// Validation pour la modification de domaine
export const editDomainValid = [
  param("id")
    .notEmpty()
    .withMessage("ID is required!")
    .bail()
    .isInt()
    .withMessage("ID must be an integer.")
    .bail(),
  check("name")
    .notEmpty()
    .withMessage("Domain name is required!")
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage("The domain name must be between 3 and 100 characters."),
  handleValidationErrors,
];

// Validation pour la suppression de domaine
export const deleteDomainValid = [
  param("id")
    .notEmpty()
    .withMessage("ID is required!")
    .bail()
    .isInt()
    .withMessage("ID must be an integer.")
    .bail()
    .custom(async (value) => {
      const result = await prisma.domain.findUnique({
        where: { id: parseInt(value, 10) },
      });
      if (!result) {
        throw new Error("This domain doesn't exist.");
      }
      return true;
    }),
  handleValidationErrors,
];
