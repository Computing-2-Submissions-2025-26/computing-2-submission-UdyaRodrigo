import express from "express";

const app = express();
const port = 8080;

app.use("/node_modules", express.static("node_modules"));
app.use(express.static("web-app"));

app.listen(port, function () {
    console.log(`Battleships is running at http://localhost:${port}`);
});
