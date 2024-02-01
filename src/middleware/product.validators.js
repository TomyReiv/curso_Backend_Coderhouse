import { body, validationResult } from "express-validator";

export const productValidator = [
    body("title").notEmpty().withMessage("Title is required").isString(),
    body("description").notEmpty().withMessage("Description is required").isString(),
    body("price").notEmpty().withMessage("Price is required").isNumeric(),
    body("code").notEmpty().withMessage("Code is required").isString(),
    body("stock").notEmpty().withMessage("Stock is required").isNumeric(),
    body("category").notEmpty().withMessage("Category is required").isString(),
]

export const validationErrorProduct = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };
