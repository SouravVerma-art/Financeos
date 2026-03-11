const User = require("../models/User");

// GET /auth/login
exports.getLogin = (req, res) => {
  res.render("auth/login", { title: "Login — FinanceOS" });
};

// POST /auth/login
exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      req.flash("error", "Please fill in all fields.");
      return res.redirect("/auth/login");
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/auth/login");
    }
    req.session.userId = user._id;
    req.session.userName = user.name;
    req.flash("success", `Welcome back, ${user.name}!`);
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong.");
    res.redirect("/auth/login");
  }
};

// GET /auth/register
exports.getRegister = (req, res) => {
  res.render("auth/register", { title: "Register — FinanceOS" });
};

// POST /auth/register
exports.postRegister = async (req, res) => {
  try {
    const { name, email, password, password2 } = req.body;
    if (!name || !email || !password) {
      req.flash("error", "Please fill in all fields.");
      return res.redirect("/auth/register");
    }
    if (password !== password2) {
      req.flash("error", "Passwords do not match.");
      return res.redirect("/auth/register");
    }
    const existing = await User.findOne({ email });
    if (existing) {
      req.flash("error", "Email already registered.");
      return res.redirect("/auth/register");
    }
    const user = await User.create({ name, email, password });
    req.session.userId = user._id;
    req.session.userName = user.name;
    req.flash("success", `Welcome to FinanceOS, ${user.name}!`);
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    req.flash("error", "Registration failed.");
    res.redirect("/auth/register");
  }
};

// GET /auth/logout
exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect("/auth/login"));
};
