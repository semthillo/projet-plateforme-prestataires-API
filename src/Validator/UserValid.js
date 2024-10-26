import { check, param, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import prisma from "../config/prisma.js";

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Reformate les erreurs pour ne retourner que les messages
    const formattedErrors = errors.array().map((error) => ({
      field: error.path,
      message: error.msg
    }));
    return res
      .status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json({ errors: formattedErrors });
  }
  next();
};


// Validation for creating a user
export const createUserValid = [
  check("name")
    .notEmpty()
    .withMessage("Name can't be empty!")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long!")
    .bail(),

  check("email")
    .notEmpty()
    .withMessage("Email can't be empty!")
    .bail()
    .isEmail()
    .withMessage("Email format is invalid!")
    .bail()
    .isLength({ max: 50 })
    .withMessage("Email must be at most 50 characters!")
    .bail()
    .custom(async (value) => {
      const result = await prisma.user.findUnique({
        where: { email: value },
      });
      if (result) {
        throw new Error("Email already exists!");
      }
      return true;
    }),

  check("password")
    .notEmpty()
    .withMessage("Password is required!")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters!")
    .bail(),

  check("role")
    .notEmpty()
    .withMessage("Role is required!")
    .bail()
    .isIn(['admin', 'prestataire'])
    .withMessage("Role must be either 'admin' or 'prestataire'"),

  check("telephone")
    .optional()
    .custom(async (value) => {
      const result = await prisma.user.findUnique({
        where: { telephone: value },
      });
      if (result) {
        throw new Error("This phone number already exists!");
      }
      return true;
    }),

  handleValidationErrors
];

// Validation for editing a user
export const editUserValid = [
  param("id")
    .notEmpty()
    .withMessage("Id is required!")
    .bail(),

  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long!")
    .bail(),

  check("email")
    .optional()
    .isEmail()
    .withMessage("Email format is invalid!")
    .bail()
    .isLength({ max: 50 })
    .withMessage("Email must be at most 50 characters!")
    .bail(),

  check("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters!")
    .bail(),

  check("role")
    .optional()
    .isIn(['admin', 'prestataire'])
    .withMessage("Role must be either 'admin' or 'prestataire'"),

  handleValidationErrors
];

// Validation for deleting a user
export const deleteUserValid = [
  param("id")
    .notEmpty()
    .withMessage("Id is required!")
    .bail()
    .custom(async (value) => {
      const result = await prisma.user.findUnique({
        where: { id: parseInt(value, 10) }
      });
      if (!result) {
        throw new Error("User does not exist!");
      }
      return true;
    }),

  handleValidationErrors
];

