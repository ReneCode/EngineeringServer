import projectList from "./projectList";
import Project from "./project";

import * as I from "./interfaces";

const rlog = (...args: any[]) => {
  console.log(...args);
};

const rootValue = {
  createProject: ({ input }: I.Input<I.CreateProjectInput>): Project => {
    rlog("createProject");
    return projectList.createProject(input.name);
  },

  deleteProject: ({ input }: I.Input<I.DeleteProjectInput>): string => {
    rlog("deleteProject");
    return projectList.deleteProject(input.id);
  },

  projects: (): Project[] => {
    rlog("projects");
    return projectList.getProjects();
  },

  project: ({ id }: { id: string }): Project | undefined => {
    return projectList.getProject(id);
  },

  // --------

  pages: ({ projectId }: { projectId: string }) => {
    rlog("pages");
    const project = projectList.getProject(projectId);
    if (project) {
      return project.pages;
    } else {
      return null;
    }
  },

  createPage: ({ input }: I.Input<I.CreatePageInput>) => {
    rlog("createPage");
    const project = projectList.getProject(input.projectId);
    if (project) {
      return project.createPage(input.name);
    } else {
      return null;
    }
  },

  deletePage: ({ input }: I.Input<I.DeletePageInput>) => {
    rlog("deletePage");
    const project = projectList.getProject(input.projectId);
    if (project) {
      return project.deletePage(input.id);
    }
  }

  // -----------
  /*
  graphics: ({ projectId, pageId }) => {
    rlog("graphics");
    return graphicList.getGraphics(projectId, pageId);
  },

  createGraphic: ({ input }) => {
    rlog("createGraphic");
    return graphicList.createGraphic(
      input.projectId,
      input.pageId,
      input.type,
      input.content
    );
  },

  updateGraphics: ({ input }) => {
    rlog("updateGraphics");
    return graphicList.updateGraphics(input);
  },

  deleteGraphic: ({ input }) => {}
  */
};

export default rootValue;
