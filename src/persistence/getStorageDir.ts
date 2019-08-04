const fs = require("fs");
const path = require("path");

const getStorageDir = (subDir: string = "") => {
  let dir = process.env.FILE_ROOT || "data";
  if (subDir) {
    dir = path.join(dir, subDir);
  }
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  return dir;
};

export default getStorageDir;
