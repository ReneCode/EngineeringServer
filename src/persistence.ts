import express = require("express");

const router = express.Router();

router.get("/save", (req, res) => {
  res.send("save");
});

export default router;
