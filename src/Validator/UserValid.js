import { check, param, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import prisma from "../config/prisma.js";
// import i18n from "../i18n.js";

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    
    // const formattedErrors = errors.array().map((error) => ({
    //   field: error.param, 
    //   message: error.msg, 
    //   path: error.location, 
    // }));
    return res.status(400).json({ errors: errors.array() });

    // Retourner la réponse JSON formatée
    // return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ errors: formattedErrors });
  }

  next(); // Passer au middleware suivant si aucune erreur
};

// Validation pour la création de l'utilisateur
export const createUserValid = [
  check("name")
  .notEmpty()
  .withMessage("Le nom de l'utilisateur est obligatoire !")
  .bail()
  .isLength({ min: 3, max: 100 })
  .withMessage("Le nom de l'utilisateur doit avoir au moins 3 caractères !")
  .bail()
  .matches(/^(?=.*[a-zA-Z])([a-zA-Z0-9\s]+)$/)
  .withMessage("Le nom doit contenir au moins une lettre, peut inclure des chiffres, mais ne doit pas être uniquement des chiffres ou contenir des caractères spéciaux !")
  .bail(),





  check("email")
    .notEmpty()
    .withMessage("L'email de l'utilisateur est oligatoire !")
    .bail()
    .isEmail()
    .withMessage("Veuillez entrez le bon format exemple: 'nom@exemple.com' !")
    .bail()
    .isLength({ max: 50 })
    .withMessage("l'email de l'utilisateur doit avoir maximum 50 caractères !")
    .bail()
    .custom(async (value) => {
      const result = await prisma.user.findUnique({
        where: { email: value },
      });
      if (result) {
        throw new Error("Un utilisateur avec  cet email existe déja !")
      }
      return true;
    }),

  check("password")
    .notEmpty()
    .withMessage("Le mot de passe est obligatoire !")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Le mot de passe doit etre au minimum 8 caractères")
    .bail(),

  check("role")
    .notEmpty()
    .withMessage("Le role est obligatoire !")
    .bail()
    .isIn(['admin', 'prestataire'])
    .withMessage("Le role doit etre 'admin' ou 'prestataire' !"),

    check("telephone")
    .optional()
    .isLength({ max: 20 })
    .withMessage("Le numéro de téléphone doit avoir maximum 20 caractères !")
    .bail()
    .matches(/^[0-9\s]+$/)
    .withMessage("Le numéro de téléphone ne doit contenir que des chiffres et des espaces !")
    .bail()
    .custom(async (value) => {
      const result = await prisma.user.findUnique({
        where: { telephone: value },
      });
      if (result) {
        throw new Error("Ce numéro de téléphone appartient déjà à un utilisateur !");
      }
      return true;
    }),
  

  check("address")
    .optional()
    .isLength({ max: 50 })
    .withMessage("l'adresse doit avoir maximum 100 caractère !")
    .bail(),

  check("availability")
    .optional()
    .isLength({ max: 50 })
    .withMessage("La disponibilité doit avoir maximum 50 caractères !")
    .bail(),

  check("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("La description doit avoir maximum 500 caractères !")
    .bail(),

  handleValidationErrors
];

// Validation pour la modification de l'utilisateur
export const editUserValid = [
  param("id")
    .notEmpty()
    .withMessage("L'id de l'utilisateur est réquit")
    .bail(),

    check("name")
    .notEmpty()
    .withMessage("Le nom de l'utilisateur est obligatoire !")
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage("Le nom de l'utilisateur doit avoir au moins 3 caractères !")
    .bail()
    .matches(/^(?=.*[a-zA-Z])([a-zA-Z0-9\s]+)$/)
    .withMessage("Le nom doit contenir au moins une lettre, peut inclure des chiffres, mais ne doit pas être uniquement des chiffres ou contenir des caractères spéciaux !")
    .bail(),




  check("email")
    .optional()
    .isEmail()
    .withMessage("L'email de l'utilisateur est oligatoire !")
    .bail()
    .isEmail()
    .withMessage("Veuillez entrez le bon format !")
    .bail()
    .isLength({ max: 50 })
    .withMessage("l'email de l'utilisateur doit avoir maximum 50 caractères !")
    .bail(),


  check("role")
    .optional()
    .isIn(['admin', 'prestataire'])
    .withMessage("Le role doit etre 'admin' ou 'prestataire' !"),

  check("telephone")
    .optional()
    .isLength({ max: 20 })
    .withMessage("Le numéro de téléphone doit avoir maximum 20 caractères !")
    .bail()
  
    .custom(async (value, { req }) => {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(req.params.id, 10) },
      });

      // Si le téléphone est identique à l'ancien, aucune vérification supplémentaire
      if (user && user.telephone === value) {
        return true;
      }

      // Vérification si le téléphone est déjà pris
      const result = await prisma.user.findUnique({
        where: { telephone: value },
      });

      if (result) {
        throw new Error("Ce numéro de téléphone appartient déjà à un utilisateur !");
      }

      return true;
    }),
  check("address")
    .optional()
    .isLength({ max: 50 })
    .withMessage("l'adresse doit avoir maximum 100 caractère !")
    .bail(),

  check("availability")
    .optional()
    .isLength({ max: 50 })
    .withMessage("La disponibilité doit avoir maximum 50 caractères !")
    .bail(),

  check("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("La description doit avoir maximum 500 caractères !")
    .bail(),

  handleValidationErrors
];

// Validation pour la suppression de l'utilisateur
export const deleteUserValid = [
  param("id")
    .notEmpty()
    .withMessage("L'id de l'utilisateur est réquit")
    .bail()
    .custom(async (value) => {
      const result = await prisma.user.findUnique({
        where: { id: parseInt(value, 10) }
      });
      if (!result) {
        throw new Error("Cet utilisteur n'existe pas");
      }
      return true;
    }),

  handleValidationErrors
];
