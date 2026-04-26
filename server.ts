import express from "express";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

app.get("/api", (req, res) => {
    res.json("Hello world!");
});

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
})