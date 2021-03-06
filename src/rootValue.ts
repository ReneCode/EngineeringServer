//

import projectList from "./ProjectList";
import Project from "./Project";

import * as I from "./interfaces";
import { IdType } from "./types";
import Page from "./Page";
import Element from "./Element";
import applicationInsightsLogger from "./applicationInsightsLogger";
import symbolLibList from "./SymbolLibList";
import SymbolLib from "./SymbolLib";
import Symbol from "./Symbol";
import { getPlacementParent } from "./util";

const rlog = (...args: any[]) => {
  console.log(...args);
};

const rootValue = {
  symbolLibs: (): SymbolLib[] => {
    rlog("symbolLibs");
    return symbolLibList.getSymbolLibs();
  },

  symbolLib: ({ id }: { id: IdType }): SymbolLib | undefined => {
    rlog("symbolLib:", id);
    return symbolLibList.getSymbolLib(id);
  },
  symbolLibByName: ({ name }: { name: string }): SymbolLib | undefined => {
    rlog("symbolLibByName:", name);
    return symbolLibList.getSymbolLibByName(name);
  },

  createSymbol: ({ input }: I.Input<I.CreateSymbolInput>): Symbol | null => {
    rlog("createSymbol");
    const symbolLib = symbolLibList.getSymbolLib(input.symbolLibId);
    if (symbolLib) {
      return symbolLib.createSymbol(input.id, input.name, input.content);
    } else {
      return null;
    }
  },
  updateSymbol: ({ input }: I.Input<I.UpdateSymbolInput>): IdType | null => {
    rlog("updateSymbol");
    const symbolLib = symbolLibList.getSymbolLib(input.symbolLibId);
    if (symbolLib) {
      return symbolLib.updateSymbol(input.id, input.name, input.content);
    }
    return null;
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
  updateProject: ({
    input
  }: I.Input<I.UpdateProjectInput>): Project | undefined => {
    rlog("updateProject");
    return projectList.updateProject(
      input.id,
      input.name,
      input.symbolLibNames
    );
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
  // placements: ({
  //   projectId,
  //   pageId
  // }: {
  //   projectId: IdType;
  //   pageId: IdType;
  // }): Placement[] => {
  //   // rlog("placements");

  //   const project = projectList.getProject(projectId);
  //   if (project) {
  //     const page = project.getPage(pageId);
  //     if (page) {
  //       const props = {
  //         projectId,
  //         pageId,
  //         count: "" + page.placements.length
  //       };
  //       applicationInsightsLogger.trackTrace("/placements", props);
  //       return page.placements;
  //     }
  //   }
  //   return [];
  // },

  createPlacement: ({ input }: I.Input<I.CreatePlacementInput[]>): any[] => {
    rlog("createPlacement");

    const result = input.map(i => {
      const parent = getPlacementParent(i);
      if (!parent) {
        return null;
      }
      return parent.createPlacement(i.type, i.content, i.id);
    });
    return result;
  },

  updatePlacements: ({ input }: I.Input<I.UpdatePlacementInput[]>): any[] => {
    rlog("updatePlacements");

    const result = input.map(i => {
      rlog("update one placement");
      const parent = getPlacementParent(i);
      if (parent) {
        return parent.updatePlacement(i.id, i.content);
      }
    });
    return result;
  },

  deletePlacements: ({ input }: I.Input<I.DeletePlacementInput[]>): any[] => {
    rlog("deletePlacements");
    const result = input.map(i => {
      rlog("deleteOnePlacement");
      const parent = getPlacementParent(i);
      if (parent) {
        return parent.deletePlacement(i.id);
      }
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
