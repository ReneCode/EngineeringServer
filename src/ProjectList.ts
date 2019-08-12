import Project from "./Project";
import { IdType } from "./types";

class ProjectList {
  projects: Project[] = [];

  constructor() {
    this.projects = [];
  }

  createProject(id: IdType, name: string): Project {
    const p = new Project(id, name);
    this.projects.push(p);
    return p;
  }

  updateProject(
    id: string,
    name: string,
    symbolLibNames: string[]
  ): Project | undefined {
    let foundProject = undefined;
    this.projects = this.projects.map(project => {
      if (project.id === id) {
        console.log(":", symbolLibNames);
        if (symbolLibNames) {
          project.symbolLibNames = symbolLibNames;
        }
        if (name) {
          project.name = name;
        }
        foundProject = project;
      }
      return project;
    });
    return foundProject;
  }

  deleteProject(id: IdType): IdType {
    this.projects = this.projects.filter(p => p.id !== id);
    return id;
  }

  getProjects(): Project[] {
    return this.projects;
  }

  getProject(id: string): Project | undefined {
    return this.projects.find(p => p.id === id);
  }
}

const projectList = new ProjectList();

export default projectList;
