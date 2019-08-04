const path = require("path");

const getFullFileName = (dir: string, name: string) => {
  const fileName = path.format({
    dir: dir,
    name: name,
    ext: ".json"
  });
  return fileName;
};

export default getFullFileName;
