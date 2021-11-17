const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const mongoUri = `mongodb+srv://new-user_31:lana123@cluster0.x4n3c.mongodb.net/url_shortener?retryWrites=true&w=majority`;
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json());

app.use("/products", require("./routes/products"));

const port = process.env.PORT || 5100;
app.listen(port, () => console.log(`Listening on port ${port}`));
