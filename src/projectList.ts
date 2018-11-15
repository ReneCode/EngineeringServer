import Project from "./project";
import { IdType } from "./types";

class ProjectList {
  projects: Project[] = [];

  constructor() {
    this.projects = [];
  }

  createProject(name: string): Project {
    const p = new Project(name);
    this.projects.push(p);
    return p;
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
