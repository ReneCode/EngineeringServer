import express = require("express");
import pgUtil from "../postgre/pgUtil";

const router = express.Router();

router.get("/:type", async (req, res) => {
  const type = req.params.type;
  console.log("admin:", type);
  try {
    switch (type) {
      case "init":
        const result = await pgUtil.initDatabase();
        res.send(result ? "OK" : "failed");
        break;

      case "database":
        res.json(await pgUtil.getDatabase());
        break;

      default:
        res.sendStatus(204);
        break;
    }
  } catch (ex) {
    console.log(ex);
    res.sendStatus(500);
  }
});

export default router;
