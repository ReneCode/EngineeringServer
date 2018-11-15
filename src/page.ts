const uuidv4 = require("uuid/v4");
import Placement from "./placement";
import { PlacementType, IdType } from "./types";

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

  createPlacement(type: PlacementType, content: string): Placement {
    const pl = new Placement(this.projectId, this.id, type, content);
    this.placements.push(pl);
    return pl;
  }

  deletePlacement(id: IdType): IdType {
    this.placements = this.placements.filter(p => p.id !== id);
    return id;
  }

  updatePlacement(id: IdType, content: string): Placement | null {
    const placement = this.placements.find(p => p.id !== id);
    if (placement) {
      placement.content = content;
      return placement;
    }
    return null;
  }
}

export default Page;
