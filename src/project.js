const uuidv4 = require("uuid/v4");

class Project {
  constructor(name) {
    this.id = uuidv4();
    this.name = name;
    this.pages = [1, 2, 3];
  }
}

class ProjectList {
  constructor() {
    this.projects = [
      { id: "a", name: "project-a" },
      { id: "b", name: "project-b" },
      { id: "c", name: "project-c" },
      { id: "d", name: "project-d" },
      { id: "e", name: "project-e" }
    ];
  }

  createProject(name) {
    const p = new Project(name);
    this.projects.push(p);
    return p;
  }

  getProjects() {
    return this.projects;
  }

  getProject(id) {
    return this.projects.find(p => p.id === id);
  }
}

const projectList = new ProjectList();

module.exports = { Project, projectList };
