const uuidv4 = require("uuid/v4");
import Placement from "./placement";
import { IdType } from "./types";
import ItemBase from "./ItemBase";

class Page extends ItemBase {
  id: IdType;
  projectId: string;
  name: string;
  placements: Placement[] = [];

  constructor(projectId: string, name: string) {
    super("page");
    this.id = uuidv4();
    this.projectId = projectId;
    this.name = name;
  }

  toJSON(): object {
    return Object.assign({}, this, {
      placements: this.placements.map(p => p.toJSON())
    });
  }

  static fromJSON(json: any): Page {
    const page = Object.create(Page.prototype);
    return Object.assign(page, json, {
      placements: json.placements.map((p: any) => Placement.fromJSON(p))
    });
  }

  createPlacement(type: string, content: string, id: IdType): Placement {
    const pl = new Placement(type, this.projectId, this.id, content, id);
    this.placements = this.placements.concat(pl);
    return pl;
  }

  deletePlacement(id: IdType): IdType {
    this.placements = this.placements.filter(p => p.id !== id);
    return id;
  }

  updatePlacement(id: IdType, content: string): IdType {
    this.placements = this.placements.map(p => {
      if (p.id !== id) {
        return p;
      } else {
        p.content = content;
        return p;
      }
    });
    return id;
  }
}

export default Page;
