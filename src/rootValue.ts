import projectList from "./projectList";
import Project from "./project";

import * as I from "./interfaces";
import { IdType } from "./types";
import Placement from "./placement";
import Page from "./page";

const rlog = (...args: any[]) => {
  console.log(...args);
};

const rootValue = {
  createProject: ({ input }: I.Input<I.CreateProjectInput>): Project => {
    rlog("createProject");
    return projectList.createProject(input.name);
  },

  deleteProject: ({ input }: I.Input<I.DeleteProjectInput>): IdType => {
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

  pages: ({ projectId }: { projectId: string }): Page[] | null => {
    rlog("pages");
    const project = projectList.getProject(projectId);
    if (project) {
      return project.pages;
    } else {
      return null;
    }
  },

  createPage: ({ input }: I.Input<I.CreatePageInput>): Page | null => {
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
  },

  // -----------
  /*
  placements: ({ projectId, pageId }) => {
    rlog("graphics");
    return graphicList.getGraphics(projectId, pageId);
  },
*/

  createPlacement: ({
    input
  }: I.Input<I.CreatePlacementInput>): Placement | null => {
    rlog("createPlacement");
    const project = projectList.getProject(input.projectId);
    if (!project) {
      return null;
    }
    const page = project.getPage(input.pageId);
    if (!page) {
      return null;
    }

    return page.createPlacement(input.type, input.content);
  },

  updatePlacement: ({
    input
  }: I.Input<I.UpdatePlacementInput>): Placement | null => {
    rlog("updatePlacement");
    const project = projectList.getProject(input.projectId);
    if (!project) {
      return null;
    }
    const page = project.getPage(input.pageId);
    if (!page) {
      return null;
    }

    return page.updatePlacement(input.id, input.content);
  },

  deletePlacement: ({
    input
  }: I.Input<I.DeletePlacementInput>): IdType | null => {
    rlog("deletePlacement");
    const project = projectList.getProject(input.projectId);
    if (!project) {
      return null;
    }
    const page = project.getPage(input.pageId);
    if (!page) {
      return null;
    }

    return page.deletePlacement(input.id);
  }
};

export default rootValue;
