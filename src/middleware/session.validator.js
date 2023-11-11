export const privateRouter = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};

export const publicRouter = (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  next();
};

export const adminValidator = (req, res, next) => {
  if (req.session.user.isAdmin === false) {
    return res.redirect("/");
  }
  next();
};
