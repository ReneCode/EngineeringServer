const uuidv4 = require("uuid/v4");
import Placement from "./placement";
import { IdType } from "./types";

class Page {
  id: IdType;
  projectId: string;
  name: string;

  placements: Placement[] = [];

  constructor(projectId: string, name: string) {
    this.id = uuidv4();
    this.projectId = projectId;
    this.name = name;
  }

  createPlacement(graphic: string): Placement {
    const pl = new Placement(this.projectId, this.id, graphic);
    this.placements = this.placements.concat(pl);
    return pl;
  }

  deletePlacement(id: IdType): IdType {
    this.placements = this.placements.filter(p => p.id !== id);
    return id;
  }

  updatePlacement(id: IdType, graphic: string): IdType {
    this.placements = this.placements.map(p => {
      if (p.id !== id) {
        return p;
      } else {
        return {
          ...p,
          graphic: graphic
        };
      }
    });
    return id;
  }
}

export default Page;
