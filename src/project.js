const uuidv4 = require("uuid/v4");
const Page = require("./page");

class Project {
  constructor(name) {
    this.id = uuidv4();
    this.name = name;
    this.pages = [];
  }

  createPage(input) {
    const page = new Page(this.id, input.name);
    this.pages.push(page);
    return page;
  }

  deletePage(input) {
    this.pages = this.pages.filter(p => p.id !== input.id);
    return input.id;
  }

  page(id) {
    try {
      const page = this.pages.find(p => p.id === id);
      return page;
    } catch (ex) {
      console.log(ex);
    }
  }
}

module.exports = Project;
