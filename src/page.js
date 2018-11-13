const uuidv4 = require("uuid/v4");

class Page {
  constructor(projectId, name) {
    this.id = uuidv4();
    this.projectId = projectId;
    this.name = name;
  }
}

module.exports = Page;
