const fs = require("fs");
const path = require("path");

const getStorageDir = (subDir: string = "") => {
  let dir = process.env.FILE_ROOT || "data";
  if (subDir) {
    dir = path.join(dir, subDir);
  }
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (err) {
    console.log("err:", err);
  }
  return dir;
};

export default getStorageDir;
