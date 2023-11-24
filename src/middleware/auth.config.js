import passport from "passport";
import { Strategy } from "passport-local";

export const authMiddleware = (Strategy) => (req, res, next) =>{
    passport.authenticate(Strategy, function(error, user, info){
        if(error) next(error);
        if(!user) res.status(401).json({message: info.message ? info.message : info.toString()});
        req.user = user;
        next();
    })(req, res, next);
};