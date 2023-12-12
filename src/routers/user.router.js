import { Router } from "express";
import userController from "../controllers/user.controller.js";
import {
  userValidator,
  handleValidationErrors,
} from "../middleware/users.validators.js";
import passport from "passport";
import { tokenGenerator } from "../utils.js";

const router = Router();

router.get("/users", async (req, res, next) => {
  try {
    const { query = {} } = req;
    const user = await userController.get(query);
    res.status(200).json(user);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
    next(error);
  }
});

router.get("/users/:uid", async (req, res, next) => {
  try {
    const { uid } = req.params;
    const users = await userController.getById({ _id: uid });
    if (!users) {
      return res.status(404).json({ message: "No user found" });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
    next(error);
  }
});

router.post(
  "/users",
  userValidator,
  handleValidationErrors,
  passport.authenticate("register", {
    failureMessage: "User already register",
  }),
  async (req, res, next) => {
    try {
      res.status(200).json({ message: "Usuario creado" });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
      next(error);
    }
  }
);

router.post(
  "/users/login",
  passport.authenticate("login", { failureRedirect: "/login" }),
  async (req, res, next) => {
    try {
      const email = req.user.email;
      const { _id, username, lastname } = req.user;

      const user = req.user;
      const userToken = await userController.findUserByEmail(email);
      const token = tokenGenerator(userToken);

      res
        .cookie("accessToken", token, {
          maxAge: 60 * 60 * 24 * 1000,
          httpOnly: true,
          signed: true,
        })
        .status(200)
        .json(user);
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
      next(error);
    }
  }
);

router.get(
  "/users/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/users/github/cb",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res, next) => {
    try {
      const { _id, username, lastname, email } = req.user;
      const token = tokenGenerator(req.user);
      res
        .cookie("accessToken", token, {
          maxAge: 60 * 60 * 24,
          httpOnly: true,
          signed: true,
        })
        .redirect("/");
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message });
      next(error);
    }
  }
);


router.put("/users/uid", async (req, res, next) => {
  try {
    const { uid } = req.params;
    const { body } = req;
    const result = await userController.updateById(uid, body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
    next(error)
  }
});

router.delete("/users/:uid", async (req, res, next) => {
  try {
    const { uid } = req.params;
    const result = await userController.deleteById(uid);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
    next(error)
  }
});
router.get("/logout", (req, res, next) => {
  try {
    res.cookie("accessToken", "", { maxAge: -1 }).redirect("/login");
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
    next(error)
  }
  
});
export default router;
