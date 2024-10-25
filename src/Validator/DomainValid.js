import { check, param, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import prisma from "../config/prisma";


const createDomainValid = [
    check("name")
    .notEmpty()
    .withMessage("Domain require !")
    .bail()
    .isLength(({ min: 3, max: 100 }))
    .withMessage("the domain name must be minimum 3 caracters and maximum 100 caracters")
    .bail()
    .custom(async (value, { req }) => {
        const result = await prisma.domain.findUnique(value)
        if (result !== 0) {
            throw new Error("This domain already exist !");
          }
          return true;
    })

]

const editDomainValid = [
    param("id")
    .not()
    .isEmpty()
    .withMessage("Id est obligatoire!")
    .bail(),
    check("name")
    .notEmpty()
    .withMessage("")
    .bail()
    .isLength(({ min: 3, max: 100 }))
    .withMessage("the domain name must be minimum 3 caracters and maximum 100 caracters")
    .bail() 
]

const deleteDomainValid = [
    param("id")
    .not()
    .isEmpty()
    .withMessage("Id est obligatoire!")
    .bail()
    .custom(async (value, { req }) => {
        const result = await prisma.domain.findUnique(value)
        if (result === 0) {
          throw new Error("This domain isn't exist")
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

export default { createDomainValid, editDomainValid, deleteDomainValid}