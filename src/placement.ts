import ItemBase from "./ItemBase";
import { IdType } from "./types";

const uuidv4 = require("uuid/v4");

type PlacementType = "line";

class Placement extends ItemBase {
  id: IdType;
  type: string;
  projectId: IdType;
  pageId: IdType;
  content: string;

  constructor(
    type: string,
    projectId: IdType,
    pageId: IdType,
    content: string,
    id: IdType
  ) {
    super("placement");
    this.type = type;
    this.projectId = projectId;
    this.pageId = pageId;
    this.id = id || uuidv4();
    this.content = content;
  }

  toJSON(): object {
    return Object.assign({}, this);
  }

  static fromJSON(json: any): Placement {
    const page = Object.create(Placement.prototype);
    return Object.assign(page, json);
  }
}

export default Placement;
