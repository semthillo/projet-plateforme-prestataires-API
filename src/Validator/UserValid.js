import { check, param, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import prisma from "../config/prisma.js";
import i18n from "../i18n.js";

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

// Validation pour la création de l'utilisateur
export const createUserValid = [
  check("name")
    .notEmpty()
    .withMessage(i18n.__("validation.user.nameRequired"))
    .bail()
    .isLength({ min: 3 })
    .withMessage(i18n.__("validation.user.nameLength"))
    .bail(),

  check("email")
    .notEmpty()
    .withMessage(i18n.__("validation.user.emailRequired"))
    .bail()
    .isEmail()
    .withMessage(i18n.__("validation.user.emailInvalid"))
    .bail()
    .isLength({ max: 50 })
    .withMessage(i18n.__("validation.user.emailMaxLength"))
    .bail()
    .custom(async (value) => {
      const result = await prisma.user.findUnique({
        where: { email: value },
      });
      if (result) {
        throw new Error(i18n.__("validation.user.emailExists"));

      }
      return true;
    }),

  check("password")
    .notEmpty()
    .withMessage(i18n.__("validation.user.passwordRequired"))
    .bail()
    .isLength({ min: 8 })
    .withMessage(i18n.__("validation.user.passwordLength"))
    .bail(),

  check("role")
    .notEmpty()
    .withMessage(i18n.__("validation.user.roleRequired"))
    .bail()
    .isIn(['admin', 'prestataire'])
    .withMessage(i18n.__("validation.user.roleInvalid")),

  check("telephone")
    .optional()
    .custom(async (value) => {
      const result = await prisma.user.findUnique({
        where: { telephone: value },
      });
      if (result) {
        throw new Error(i18n.__("validation.user.phoneExists"));
      }
      return true;
    }),

  handleValidationErrors
];

// Validation pour la modification de l'utilisateur
export const editUserValid = [
  param("id")
    .notEmpty()
    .withMessage(i18n.__("validation.user.idRequired"))
    .bail(),

  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage(i18n.__("validation.user.nameLength"))
    .bail(),

  check("email")
    .optional()
    .isEmail()
    .withMessage(i18n.__("validation.user.emailInvalid"))
    .bail()
    .isLength({ max: 50 })
    .withMessage(i18n.__("validation.user.emailMaxLength"))
    .bail(),

  check("password")
    .optional()
    .isLength({ min: 8 })
    .withMessage(i18n.__("validation.user.passwordLength"))
    .bail(),

  check("role")
    .optional()
    .isIn(['admin', 'prestataire'])
    .withMessage(i18n.__("validation.user.roleInvalid")),

  handleValidationErrors
];

// Validation pour la suppression de l'utilisateur
export const deleteUserValid = [
  param("id")
    .notEmpty()
    .withMessage(i18n.__("validation.user.idRequired"))
    .bail()
    .custom(async (value) => {
      const result = await prisma.user.findUnique({
        where: { id: parseInt(value, 10) }
      });
      if (!result) {
        throw new Error(i18n.__("validation.user.userNotExist"));
      }
      return true;
    }),

  handleValidationErrors
];
