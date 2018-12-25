import projectList from "./projectList";
import Project from "./project";

import * as I from "./interfaces";
import { IdType } from "./types";
import Placement from "./placement";
import Page from "./page";
import Element from "./element";

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
  placements: ({
    projectId,
    pageId
  }: {
    projectId: IdType;
    pageId: IdType;
  }): Placement[] => {
    rlog("placements");
    const project = projectList.getProject(projectId);
    if (project) {
      const page = project.getPage(pageId);
      if (page) {
        return page.placements;
      }
    }
    return [];
  },

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

  updatePlacements: ({ input }: I.Input<I.UpdatePlacementInput[]>): any[] => {
    rlog("updatePlacements");

    const result = input.map(i => {
      rlog("update one placement");
      const project = projectList.getProject(i.projectId);
      if (!project) {
        return null;
      }
      const page = project.getPage(i.pageId);
      if (!page) {
        return null;
      }
      return page.updatePlacement(i.id, i.content);
    });
    return result;
  },

  deletePlacements: ({ input }: I.Input<I.DeletePlacementInput[]>): any[] => {
    rlog("deletePlacements");
    const result = input.map(i => {
      rlog("deleteOnePlacement");
      const project = projectList.getProject(i.projectId);
      if (!project) {
        return null;
      }
      const page = project.getPage(i.pageId);
      if (!page) {
        return null;
      }

      return page.deletePlacement(i.id);
    });
    return result;
  },

  // ---------------

  elements: (projectId: IdType, type: string): Element[] | null => {
    rlog("elements");
    const project = projectList.getProject(projectId);
    if (!project) {
      return null;
    }
    // TODO
    return null;
  },

  createElement: ({ input }: I.Input<I.CreateElementInput>): Element | null => {
    rlog("createElement");
    const project = projectList.getProject(input.projectId);
    if (project) {
      return project.createElement(input.type, input.name, input.content);
    }
    return null;
  },

  updateElement: ({ input }: I.Input<I.UpdateElementInput>): IdType | null => {
    rlog("updateElement");
    const project = projectList.getProject(input.projectId);
    if (project) {
      return project.updateElement(
        input.id,
        input.type,
        input.name,
        input.content
      );
    }
    return null;
  },

  deleteElement: ({ input }: I.Input<I.DeleteElementInput>): IdType | null => {
    rlog("updateElement");
    const project = projectList.getProject(input.projectId);
    if (project) {
      return project.deleteElement(input.id);
    }
    return null;
  }
};

export default rootValue;
