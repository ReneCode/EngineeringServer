const uuidv4 = require("uuid/v4");

const Project = require("./project");

class ProjectList {
  constructor() {
    this.projects = [new Project("new Project")];
  }

  createProject(name) {
    const p = new Project(name);
    this.projects.push(p);
    return p;
  }

  deleteProject(id) {
    this.projects = this.projects.filter(p => p.id !== id);
    return id;
  }

  getProjects() {
    return this.projects;
  }

  getProject(id) {
    return this.projects.find(p => p.id === id);
  }
}

const projectList = new ProjectList();

module.exports = { projectList };
