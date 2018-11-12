const uuidv4 = require("uuid/v4");

class Page {
  constructor(projectId, name) {
    this.projectId = projectId;
    this.id = uuidv4();
    this.name = name;
  }
}

class PageList {
  constructor() {
    this.pages = [{ projectId: "prjId", id: "pageId", name: "new page" }];
  }

  createPage(projectId, name) {
    const p = new Page(projectId, name);
    this.pages.push(p);
    return p;
  }

  getPages(projectId) {
    return this.pages.filter(p => p.projectId === projectId);
  }

  getPage(projectId, id) {
    return this.pages.find(p => p.projectId == projectId && p.id === id);
  }
}

const pageList = new PageList();

module.exports = { Page, pageList };
