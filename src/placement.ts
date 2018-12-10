import ItemBase from "./ItemBase";

const uuidv4 = require("uuid/v4");

class Placement extends ItemBase {
  projectId: string;
  pageId: string;
  id: string;
  graphic: string;

  constructor(projectId: string, pageId: string, graphic: string) {
    super("placement");
    this.projectId = projectId;
    this.pageId = pageId;
    this.id = uuidv4();
    this.graphic = graphic;
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
