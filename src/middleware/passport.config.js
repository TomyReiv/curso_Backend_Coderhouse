import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import GithubStrategy from "passport-github2";
import { createHash, isValidPassword } from "../utils.js";
import fetch from "node-fetch";

import { config } from "../config.js";

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
const githubOpts = {
  clientID: config.ClientID,
  clientSecret: config.clientSecret,
  callbackURL: config.callback,
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
          return done(new Error("Usuario o contraseña invalidos"));
        }
        const passwordMatch = isValidPassword(password, user);

        if (!passwordMatch) {
          return done(new Error("Usuario o contraseña invalidos"));
        }

        done(null, user);
      } catch (error) {
        console.log(error);
      }
    })
  );

  passport.use(
    "github",
    new GithubStrategy(
      githubOpts,
      async (accessToken, refreshToken, profile, done) => {
        try {
          let email = profile._json.email;
          if (!email) {
            let data = await fetch(
              "https://api.github.com/user/public_emails",
              {
                headers: {
                  Authorization: `token ${accessToken}`,
                },
              }
            );
            data = await data.json();

            const target = data.find(
              (item) =>
                item.primary && item.verified && item.visibility === "public"
            );
            email = target.email;
          }
          let user = await userModel.findOne({ email });
          if (user) {
            return done(null, user);
          }
          user = {
            username: profile._json.name,
            lastname: "",
            password: "",
            email: email,
            address: {
              street: "",
              city: "",
              state: "",
            },
            status: "active",
            provider: "github",
          };
          const newUser = await userModel.create(user);

          const cartNew = await cartModel.create({ userId: newUser._id });

          const uid = newUser._id.toString();
          const cartUser = await userModel.updateOne(
            { _id: uid },
            { $set: { cart: cartNew._id } }
          );

          done(null, newUser);
        } catch (error) {
          console.error("Error en la estrategia GitHub:", error);
          done(error);
        }
      }
    )
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
