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

export const createPostValid = [
  check("title")
    .notEmpty()
    .withMessage(i18n.__("validation.post.titleRequired"))
    .bail()
    .isLength({ min: 6, max: 100 })
    .withMessage(i18n.__("validation.post.titleLength"))
    .bail(),
  check("date_heure")
    .notEmpty()
    .withMessage(i18n.__("validation.post.dateRequired"))
    .bail(),
  handleValidationErrors,
];

export const editPostValid = [
  param("id")
    .notEmpty()
    .withMessage(i18n.__("validation.id.required"))
    .bail(),
  check("title")
    .notEmpty()
    .withMessage(i18n.__("validation.post.titleRequired"))
    .bail()
    .isLength({ min: 6, max: 100 })
    .withMessage(i18n.__("validation.post.titleLength"))
    .bail(),
  check("date_heure")
    .notEmpty()
    .withMessage(i18n.__("validation.post.dateRequired"))
    .bail(),
  handleValidationErrors,
];

export const deletePostValid = [
  param("id")
    .notEmpty()
    .withMessage(i18n.__("validation.id.required"))
    .bail()
    .custom(async (value) => {
      const result = await prisma.post.findUnique({
        where: { id: parseInt(value, 10) }
      });
      if (!result) {
        throw new Error(i18n.__("validation.post.postNotExist"));
      }
      return true;
    }),
  handleValidationErrors,
];
