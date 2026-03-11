const ensureAuth = (req, res, next) => {
  if (req.session && req.session.userId) return next();
  req.flash("error", "Please log in to access this page.");
  res.redirect("/auth/login");
};

const ensureGuest = (req, res, next) => {
  if (req.session && req.session.userId) return res.redirect("/dashboard");
  next();
};

module.exports = { ensureAuth, ensureGuest };
