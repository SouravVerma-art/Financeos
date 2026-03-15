require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash");
const morgan = require("morgan");
const methodOverride = require("method-override");
const path = require("path");

const connectDB = require("./config/db");

// ── Connect to MongoDB ──────────────────────────────────────────────
connectDB();

const app = express();

// ── View Engine ─────────────────────────────────────────────────────
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layouts/main");
app.set("layout extractScripts", true);

// ── Middleware ───────────────────────────────────────────────────────
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ── Session & Flash ──────────────────────────────────────────────────
app.use(
  session({
    secret: process.env.SESSION_SECRET || "financeos_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
  })
);

app.use(flash());

// ── Global Locals ─────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.locals.messages = {
    success: req.flash("success"),
    error: req.flash("error"),
  };
  res.locals.req = req;
  res.locals.path = req.path;
  next();
});

// ── Routes ────────────────────────────────────────────────────────────
app.use("/auth", require("./routes/auth"));
app.use("/dashboard", require("./routes/dashboard"));
app.use("/transactions", require("./routes/transactions"));
app.use("/ai", require("./routes/ai"));

// Root redirect
app.get("/", (req, res) => {
  if (req.session.userId) return res.redirect("/dashboard");
  res.redirect("/auth/login");
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, status: "up" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render("404", {
    title: "404 — Not Found",
    layout: "layouts/main",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// ── IMPORTANT FOR VERCEL ─────────────────────────────────────────────
module.exports = app;
