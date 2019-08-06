import ItemBase from "./ItemBase";
import { IdType } from "./types";

const uuidv4 = require("uuid/v4");

class Placement extends ItemBase {
  id: IdType;
  type: string;
  content: string;

  constructor(type: string, content: string, id: IdType) {
    super("placement");
    this.type = type;
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
