const fs = require("fs");

export const getDataDir = () => {
  let dir: string = process.env.FILE_ROOT || "data";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  return dir;
};
