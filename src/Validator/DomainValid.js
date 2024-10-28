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

// Validation pour la création de domaine
export const createDomainValid = [
  check("name")
    .notEmpty()
    .withMessage(i18n.__("validation.domain.required"))
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage(i18n.__("validation.domain.length"))
    .bail()
    .custom(async (value) => {
      const result = await prisma.domain.findUnique({
        where: { name: value },
      });
      if (result) {
        throw new Error(i18n.__("validation.domain.exists"));
      }
      return true;
    }),
  handleValidationErrors,
];

// Validation pour la modification de domaine
export const editDomainValid = [
  param("id")
    .notEmpty()
    .withMessage(i18n.__("validation.id.required"))
    .bail()
    .isInt()
    .withMessage(i18n.__("validation.id.integer"))
    .bail(),
  check("name")
    .notEmpty()
    .withMessage(i18n.__("validation.domain.required"))
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage(i18n.__("validation.domain.length")),
  handleValidationErrors,
];

// Validation pour la suppression de domaine
export const deleteDomainValid = [
  param("id")
    .notEmpty()
    .withMessage(i18n.__("validation.id.required"))
    .bail()
    .isInt()
    .withMessage(i18n.__("validation.id.integer"))
    .bail()
    .custom(async (value) => {
      const result = await prisma.domain.findUnique({
        where: { id: parseInt(value, 10) },
      });
      if (!result) {
        throw new Error(i18n.__("validation.id.notExist"));
      }
      return true;
    }),
  handleValidationErrors,
];
