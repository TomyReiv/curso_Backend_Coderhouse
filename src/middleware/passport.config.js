import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import  GithubStrategy from "passport-github2";
import { createHash, isValidPassword } from "../utils.js";
import userModel from "../models/user.model.js";
/* import dotenv from "dotenv"; */
import fetch from "node-fetch";
import { config } from "../config.js";

/* dotenv.config(); */

const opts = {
  usernameField: "email",
  passReqToCallback: true,
};
const githubOpts = {
  clientID: config.ClientID,
  clientSecret: config.clientSecret,
  callbackURL: config.callback
};

export const init = () => {
  passport.use(
    "register",
    new LocalStrategy(opts, async (req, email, password, done) => {
      const user = await userModel.findOne({ email });
      if (user) {
        return done(new Error("User already register"));
      }
      try {
        const { password, ...body } = req.body;

        const newUser = await userModel.create({
          ...req.body,
          password: createHash(password),
        });

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
        /*   const { _id, username, lastname} = user;
            if(email === 'ravetomas@gmail.com') {
            req.session.user = {_id, username, lastname, email, isAdmin: true};
            }else{
            req.session.user = {_id, username, lastname, email, isAdmin: false};
            } */

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
          if(!email){
            let data = await fetch('https://api.github.com/user/public_emails', {
              headers:{
                Authorization: `token ${accessToken}`
              },
            });
            data = await data.json();
            const target = data.find((item)=>item.primary && item.verified && item.visibility === 'public');
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
            email: profile._json.email,
            address: {
              street: "",
              city: "",
              state: "",
            },
            status: "active",
            provider: "github",
          };
          const newUser = await userModel.create(user);
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
