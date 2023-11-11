import { body, validationResult } from "express-validator";

export const addressValidator = [
  body("address.street").notEmpty().withMessage("Street is required"),
  body("address.city").notEmpty().withMessage("City is required"),
  body("address.country").notEmpty().withMessage("Country is required"),
];

export const userValidator = [
  body("username").notEmpty().withMessage("Username is required"),
  body("lastname").notEmpty().withMessage("Lastname is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters")
    .matches(/[\W_]/)
    .withMessage("Password should contain at least one special character"),
  body("email")
    .isEmail()
    .withMessage("Invalid email format")
    .notEmpty()
    .withMessage("Email is required"),
  ...addressValidator,
  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Invalid status"),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
