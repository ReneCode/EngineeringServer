//

import projectList from "./projectList";
import Project from "./project";

import * as I from "./interfaces";
import { IdType } from "./types";
import Placement from "./placement";
import Page from "./page";
import Element from "./element";
import applicationInsightsLogger from "./applicationInsightsLogger";
import symbolLibList from "./symbolLibList";
import SymbolLib from "./symbolLib";

const rlog = (...args: any[]) => {
  console.log(...args);
};

const rootValue = {
  symbolLibs: (): SymbolLib[] => {
    rlog("symbolLibs");
    return symbolLibList.getSymbolLibs();
  },

  createSymbolLib: ({ input }: I.Input<I.CreateSymbolLibInput>): SymbolLib => {
    rlog("createSymbolLib");
    return symbolLibList.createSymbolLib(input.id, input.name);
  },

  deleteSymbolLib: ({ input }: I.Input<I.DeleteSymbolLibInput>): IdType => {
    rlog("deleteSymbolLib");
    return symbolLibList.deleteSymbolLib(input.id);
  },

  createProject: ({ input }: I.Input<I.CreateProjectInput>): Project => {
    rlog("createProject");
    return projectList.createProject(input.id, input.name);
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

  updatePage: ({ input }: I.Input<I.UpdatePageInput>) => {
    rlog("updatePage");
    const project = projectList.getProject(input.projectId);
    if (project) {
      return project.updatePage(input.id, input.name);
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
    // rlog("placements");

    const project = projectList.getProject(projectId);
    if (project) {
      const page = project.getPage(pageId);
      if (page) {
        const props = {
          projectId,
          pageId,
          count: "" + page.placements.length
        };
        applicationInsightsLogger.trackTrace("/placements", props);
        return page.placements;
      }
    }
    return [];
  },

  createPlacement: ({ input }: I.Input<I.CreatePlacementInput[]>): any[] => {
    rlog("createPlacement");

    const result = input.map(i => {
      const project = projectList.getProject(i.projectId);
      if (!project) {
        return null;
      }
      const page = project.getPage(i.pageId);
      if (!page) {
        return null;
      }
      return page.createPlacement(i.type, i.content, i.id);
    });
    return result;
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
