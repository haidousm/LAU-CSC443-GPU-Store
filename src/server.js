const express = require("express");
const connectDB = require("./config/db");

const passport = require("passport");
const setupPassport = require("./config/passport");

const session = require("express-session");
const MongoStore = require("connect-mongo");

const cors = require("cors");
const morgan = require("morgan");

const path = require("path");
require("dotenv").config({
    path: path.resolve(__dirname, "./config/config.env"),
});

setupPassport(passport);
connectDB();

const app = express();
const PORT = process.env.PORT;

app.use(morgan("dev"));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(
    cors({
        origin: "http://localhost:5500",
        credentials: true,
    })
);

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            collection: "sessions",
        }),
        cookie: {
            maxAge: 24 * 60 * 60 * 1000,
            secure: false,
            httpOnly: false,
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.get("/", (req, res) => {
    res.send("nothing to see here");
});

app.use("/auth", require("./routes/auth"));
app.use("/products", require("./routes/products"));
app.use("/account", require("./routes/account"));
app.use("/cart", require("./routes/cart"));
app.use("/orders", require("./routes/orders"));
app.use("/admin", require("./routes/admin"));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
