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

// Validation pour la création de service
export const createServiceValid = [
  check("name")
    .notEmpty()
    .withMessage(i18n.__("validation.service.required"))
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage(i18n.__("validation.service.length"))
    .bail()
    .custom(async (value) => {
      const result = await prisma.service.findUnique({
        where: { name: value },
      });
      if (result) {
        throw new Error(i18n.__("validation.service.exists"));
      }
      return true;
    }),
  check("user_id")
    .notEmpty()
    .withMessage(i18n.__("validation.user.required"))
    .bail()
    .isInt()
    .withMessage(i18n.__("validation.user.integer"))
    .bail()
    .custom(async (value) => {
      const userExists = await prisma.user.findUnique({
        where: { id: parseInt(value, 10) },
      });
      if (!userExists) {
        throw new Error(i18n.__("validation.user.notExist"));
      }
      return true;
    }),
  handleValidationErrors,
];

// Validation pour la modification de service
export const editServiceValid = [
  param("id")
    .notEmpty()
    .withMessage(i18n.__("validation.id.required"))
    .bail()
    .isInt()
    .withMessage(i18n.__("validation.id.integer"))
    .bail(),
  check("name")
    .notEmpty()
    .withMessage(i18n.__("validation.service.required"))
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage(i18n.__("validation.service.length")),
  handleValidationErrors,
];

// Validation pour la suppression de service
export const deleteServiceValid = [
  param("id")
    .notEmpty()
    .withMessage(i18n.__("validation.id.required"))
    .bail()
    .isInt()
    .withMessage(i18n.__("validation.id.integer"))
    .bail()
    .custom(async (value) => {
      const result = await prisma.service.findUnique({
        where: { id: parseInt(value, 10) },
      });
      if (!result) {
        throw new Error(i18n.__("validation.id.notExist"));
      }
      return true;
    }),
  handleValidationErrors,
];
