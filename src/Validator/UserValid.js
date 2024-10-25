import { check, param, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import prisma from "../config/prisma";

const createUserValid = [
  check("name")
    .notEmpty()
    .withMessage("Title can't be empty!")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Minimum 6 characters required!")
    .bail(),

  check("email")
    .notEmpty()
    .withMessage("Title can't be empty!")
    .bail()
    .isEmail.withMessage("Email format is invalid!")
    .bail()
    .isLength({ max: 50 })
    .withMessage("maximum 6 characters required!")
    .bail()
    .custom(async (value, { req }) => {
      const result = await prisma.user.findUnique(value);
      if (result !== 0) {
        throw new Error("user already exists!");
      }
      return true;
    }),

  check("password")
  .notEmpty()
  .withMessage("Password is required!")
  .bail()
  .isLength({min: 8})
  .withMessage("Password must be at least 8 characters!")
  .bail()
  .custom(async  (role, { req }) => {
        
        const validRoles = ['admin', 'prestataire'];
        if (!validator.isIn(role, validRoles)) {
            throw new Error("The role must be 'admin' or 'provider'");
        }
        return true
    }
  ),

  check("telephone")
  .custom(async (value, { req }) => {
    const result = await prisma.user.findUnique(value);
    if (result !== 0) {
      throw new Error("This phone number already exists!");
    }
    return true;
  }),


];


const editUserValid = [
  param("id")
  .notEmpty()
  .withMessage("Id is require!")
  .bail(),

check("name")
  .isLength({ min: 3 })
  .withMessage("Minimum 6 characters required!")
  .bail(),

check("email")
  .notEmpty()
  .withMessage("Title can't be empty!")
  .bail()
  .isEmail.withMessage("Email format is invalid!")
  .bail()
  .isLength({ max: 50 })
  .withMessage("maximum 6 characters required!")
  .bail(),
check("password")
  .notEmpty()
  .withMessage("Password is required!")
  .bail()
  .isLength({min: 8})
  .withMessage("Password must be at least 8 characters!")
  .bail()
  .custom(async  (role, { req }) => {
        
        const validRoles = ['admin', 'prestataire'];
        if (!validator.isIn(role, validRoles)) {
            throw new Error("The role must be 'admin' or 'provider'");
        }
        return true
    }
  ),



]

const deleteUserValid = [
  param("id")
  .notEmpty()
  .withMessage("Id is require!")
  .bail()
  .custom(async (value, { req }) => {
    const result = await prisma.user.findUnique(value)
    if (result === 0) {
      throw new Error("This isn't exist")
    }
    return true
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ errors: errors.array() });
    next();
  },

]



export default { createUserValid, editUserValid, deleteUserValid}