import * as uuidv4 from "uuid/v4";
import { IdType } from "./types";
import ItemBase from "./ItemBase";

class Element extends ItemBase {
  projectId: IdType;
  type: string;
  name: string;
  content: string;
  id: IdType;

  constructor(projectId: IdType, type: string, name: string, content: string) {
    super("element");
    this.projectId = projectId;
    this.type = type;
    this.id = uuidv4();
    this.name = name;
    this.content = content;
  }

  toJSON(): object {
    return Object.assign({}, this);
  }

  static fromJSON(json: any): Element {
    const element = Object.create(Element.prototype);
    return Object.assign(element, json);
  }
}

export default Element;
