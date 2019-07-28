import * as I from "./interfaces";
import Page from "./page";
import Symbol from "./Symbol";
import projectList from "./projectList";
import symbolLibList from "./symbolLibList";
import { ParentType, IdType } from "./types";

export const getPlacementParent = (input: {
  parentIds: IdType[];
  parentType: ParentType;
}): Page | Symbol | null => {
  switch (input.parentType) {
    default:
      console.log("bad parentType:", input.parentType);
      return null;

    case "symbol":
      {
        const symbolLibId = input.parentIds.shift();
        const symbolId = input.parentIds.shift();
        if (!symbolLibId || !symbolId) {
          return null;
        }
        const symbolLib = symbolLibList.getSymbolLib(symbolLibId);
        if (!symbolLib) {
          return null;
        }
        const symbol = symbolLib.getSymbol(symbolId);
        if (!symbol) {
          return null;
        }
        return symbol;
      }
      break;

    case "page":
      {
        const projectId = input.parentIds.shift();
        if (!projectId) {
          return null;
        }

        const project = projectList.getProject(projectId);
        if (!project) {
          return null;
        }
        const pageId = input.parentIds.shift();
        if (!pageId) {
          return null;
        }
        const page = project.getPage(pageId);
        if (!page) {
          return null;
        }
        return page;
      }
      break;
  }
};
