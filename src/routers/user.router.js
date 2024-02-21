import { Router } from "express";
import userController from "../controllers/user.controller.js";
import {
  userValidator,
  handleValidationErrors,
  passwordValidator,
} from "../middleware/users.validators.js";
import passport from "passport";
import { deleteCartUser } from "../middleware/daleteCascade.js";
import { uploader, jwtAuth, tokenGenerator, createHash, isValidPassword } from "../utils.js";

const router = Router();

router.get("/users", async (req, res, next) => {
  try {
    const { query = {} } = req;
    const user = await userController.get(query);
    res.status(200).json(user);
  } catch (error) {
    req.logger.log('error', error);
    res.status(error.statusCode || 500).json({ message: error.message })
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
    req.logger.log('error', error);
    res.status(error.statusCode || 500).json({ message: error.message })
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
      req.logger.log('error', error);
      res.status(error.statusCode || 500).json({ message: error.message });
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

      const userToken = await userController.findUserByEmail(email);

      const token = tokenGenerator(userToken);
      await userController.updateById(_id, { last_connection: new Date() })
      res
        .cookie("accessToken", token, {
          maxAge: (60 * 60 * 24 * 1000),
          httpOnly: true,
          signed: true,
        })
        .status(200)
        .json(userToken);
    } catch (error) {
      req.logger.log('error', error);
      res.status(error.statusCode || 500).json({ message: error.message });
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
  async (req, res, next) => {
    try {
      const { _id, username, lastname, email } = req.user;
      const token = tokenGenerator(req.user);
      await userController.updateById(_id, { last_connection: new Date() })
      res
        .cookie("accessToken", token, {
          maxAge: (60 * 60 * 24),
          httpOnly: true,
          signed: true,
        })
        .redirect("/");
    } catch (error) {
      req.logger.log('error', error);
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }
);

router.put("/users/:uid", passwordValidator, async (req, res, next) => {
  try {
    const { uid } = req.params;
    const { body } = req;
    if(body.password){
      const password = createHash(body.password);

      const user = await userController.getById(uid);
      if (isValidPassword(body.password, user)) {
        return res
          .status(404)
          .json({ message: "No pueden coincidir contraseñas" });
      } 
      const result = await userController.updatePassword(uid, password);
    }else{
      const result = await userController.updateById(uid, body);
    }
    
    res.status(201).json({ message: "Actualizado exitosamente" });
  } catch (error) {
    req.logger.log('error', error);
    res.status(error.statusCode || 500).json({ message: error.message })
  }
});

router.delete("/users/:uid", deleteCartUser, async (req, res, next) => {
  try {
    const { uid } = req.params;
    const result = await userController.deleteById(uid);
    res.status(200).json(result);
  } catch (error) {
    req.logger.log('error', error);
    res.status(error.statusCode || 500).json({ message: error.message })
  }
});
router.get("/logout", async (req, res, next) => {
  try {
    const { _id, username, lastname, email } = req.user;
    await userController.updateById(_id, { last_connection: new Date() })
    res.cookie("accessToken", "", { maxAge: -1 }).redirect("/login");
  } catch (error) {
    req.logger.log('error', error);
    res.status(error.statusCode || 500).json({ message: error.message })
  }
});

router.put("/users/premium/:uid", async (req, res)=>{
  try {
    const { uid } = req.params;
    const data = {'rol': 'premium'}

    const docs = await userController.getById(uid);
    const requiredDocs = ['documento', 'domicilio', 'cuenta'];
    const documents = docs.documents.map(doc => Object.keys(doc)[0]);
    
    const allDocumentsExist = requiredDocs.every(doc => documents.includes(doc));
    
    if (allDocumentsExist) {
      const user = await userController.updateById(uid, data);
      res.status(201).json({ message: "Bienvenido al servicio premium" });
    } else {
      res.status(406).json({ message: "Faltan documentos para ser un usuario premium" });
    }
  } catch (error) {
    req.logger.log('error', error);
    res.status(error.statusCode || 500).json({ message: error.message })
  }
})

router.post("/users/:uid/documents/:typeFile",jwtAuth, uploader.single("file"), async (req, res)=>{
  try {
    const { file, params: {uid, typeFile } } = req
    const user = userController.uploadFile(uid, typeFile, file)
    res.status(204).end()
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message })
  }
})
export default router;
