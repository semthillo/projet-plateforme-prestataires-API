import { check, param, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import prisma from "../config/prisma.js";



const createPostValid = [
    check("title")
    .isEmpty()
    .withMessage("title require !")
    .bail()
    .isLength({ min: 6, max: 100 })
    .withMessage("The title  must be minimum 3 caracters and maximum 100 caracters")
    .bail(),
   check("date_heure")
   .isEmpty()
   .withMessage("Date and time require !")
   .bail(),
   

]

const editPostValid = [
    param("id")
    .not()
    .isEmpty()
    .withMessage("Id est obligatoire!")
    .bail(),
    check("title")
    .isEmpty()
    .withMessage("title require !")
    .bail()
    .isLength({ min: 6, max: 100 })
    .withMessage("The title  must be minimum 3 caracters and maximum 100 caracters")
    .bail(),
   check("date_heure")
   .isEmpty()
   .withMessage("Date and time require !")
   .bail(),
]

const deletePostValid = [
    param("id")
    .not()
    .isEmpty()
    .withMessage("Id est obligatoire!")
    .bail()
    .custom(async (value, { req }) => {
        const result = await prisma.post.findUnique(value)
        if (result === 0) {
          throw new Error("This Post isn't exist")
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



export default {
    createPostValid, editPostValid, deletePostValid
}