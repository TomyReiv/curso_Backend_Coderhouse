import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { createHash, isValidPassword } from "../utils.js";

import Exception from "../utils.js";
import { config } from "./config.js";

import userModel from "../models/user.model.js";
import cartModel from "../models/cart.model.js";

function cookieExtractor(req) {
  let token = null;
  if (req && req.signedCookies) {
    token = req.signedCookies["accessToken"];
  }
  return token;
}

const optsJwt = {
  jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
  secretOrKey: config.JwtSecret,
};

const opts = {
  usernameField: "email",
  passReqToCallback: true,
};

export const init = () => {
  passport.use(
    "jwt",
    new JwtStrategy(optsJwt, (payload, done) => {
      try {
        return done(null, payload);
      } catch (error) {
        console.log(error);
      }
    })
  );

  passport.use(
    "register",
    new LocalStrategy(opts, async (req, email, password, done) => {
      const user = await userModel.findOne({ email });
      if (user) {
        return done(new Error("User already register"));
      }
      try {
        const { password, ...body } = req.body;
        let rol = "user";
        email === "ravetomas@gmail.com" ? (rol = "admin") : (rol = "user");

        const newUser = await userModel.create({
          ...req.body,
          rol,
          password: createHash(password),
        });

        const cartNew = await cartModel.create({ userId: newUser._id });

        const uid = newUser._id.toString();
        const cartUser = await userModel.updateOne(
          { _id: uid },
          { $set: { cart: cartNew._id } }
        );

        done(null, newUser);
      } catch (error) {
        done(
          new Error(
            `Ocurrio un error durante la autenticacion ${error.message}`
          )
        );
      }
    })
  );

  passport.use(
    "login",
    new LocalStrategy(opts, async (req, email, password, done) => {
      try {
        
        const user = await userModel.findOne({ email });
        
        if (!user) {
          return done(new Exception("Usuario o contraseña invalidos"));
        }
        const passwordMatch = isValidPassword(password, user);

        if (!passwordMatch) {
          return done(new Exception("Usuario o contraseña invalidos"));
        }

/*         if(user.status !== 'active'){
          return done(new Error("Debe activar el email para ingresar"));
        } */

        done(null, user);
      } catch (error) {
        return done(new Exception("Usuario o contraseña invalidos"));
      }
    })
  );


  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (uid, done) => {
    try {
      const user = await userModel.findById(uid);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};
