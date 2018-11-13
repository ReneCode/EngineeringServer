const uuidv4 = require("uuid/v4");
const Page = require("./page");

class Project {
  constructor(name) {
    this.id = uuidv4();
    this.name = name;
    this._pages = [];
  }

  addPage({ input }) {
    const page = new Page(this.id, input.name);
    this._pages.push(page);
    return page;
  }

  deletePage({ input }) {
    this._pages = this._pages.filter(p => p.id !== input.id);
    return input.id;
  }

  pages() {
    return this._pages;
  }

  page({ id }) {
    try {
      const page = this._pages.find(p => p.id === id);
      return page;
    } catch (ex) {
      console.log(ex);
    }
  }
}

module.exports = Project;
