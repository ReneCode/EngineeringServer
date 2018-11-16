const uuidv4 = require("uuid/v4");

import { PlacementType } from "./types";

class Placement {
  projectId: string;
  pageId: string;
  id: string;
  type: PlacementType = PlacementType.empty;
  graphic: string;

  constructor(
    projectId: string,
    pageId: string,
    type: PlacementType,
    graphic: string
  ) {
    this.projectId = projectId;
    this.pageId = pageId;
    this.type = type;
    this.id = uuidv4();
    this.graphic = graphic;
  }
}

export default Placement;

/*

class GraphicList {
  constructor() {
    const line = {
      type: "line",
      p1: {
        x: 50,
        y: 100
      },
      p2: {
        x: 250,
        y: 120
      }
    };
    const content = { p1: line.p1, p2: line.p2 };
    this.graphics = [
      {
        projectId: "prjId",
        pageId: "pageId",
        id: "graphicId",
        type: "line",
        content: JSON.stringify(content)
      }
    ];
    this.graphics = [];
  }

  createGraphic(projectId, pageId, type, content) {
    const g = { projectId, pageId, type, content, id: uuidv4() };
    this.graphics.push(g);
    return g;
  }

  updateGraphics(newGraphics) {
    try {
      this.graphics = this.graphics.map(g => {
        const newGraphic = newGraphics.find(
          ng => g.projectId === ng.projectId && g.id === ng.id
        );
        if (newGraphic) {
          return {
            ...g,
            content: newGraphic.content
          };
        } else {
          return g;
        }
      });
    } catch (ex) {
      console.log(ex);
    }
  }

  getGraphics(projectId, pageId) {
    return this.graphics.filter(
      g => g.projectId === projectId && g.pageId === pageId
    );
  }
}

const graphicList = new GraphicList();

module.exports = { Graphic, graphicList };
*/
