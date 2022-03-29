const express = require("express");
const ejs = require("ejs");
const session = require("express-session");
const flash = require("connect-flash");
require("dotenv/config");
const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
  })
);
app.use(flash());

app.set("view engine", "html");
app.engine("html", ejs.renderFile);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", { message: req.flash("message") });
});

app.post("/send-sms", async (req, res) => {
  await client.messages
    .create({
      body: req.body.msgBody,
      from: "+18596961819",
      to: req.body.toNum,
    })
    .then((message) =>
      req.flash("message", "Congratulations! Your message is sent.")
    )
    .catch((err) =>
      req.flash(
        "message",
        "Ohh! It seems that some error occured. Please try again!"
      )
    );

  res.redirect("/");
});

app.listen(3000, () => console.log("Server started..."));
