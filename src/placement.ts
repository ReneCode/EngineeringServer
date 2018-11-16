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
