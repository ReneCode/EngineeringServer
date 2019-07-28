import * as uuidv4 from "uuid/v4";
import { IdType } from "./types";
import ItemBase from "./ItemBase";
import Placement from "./placement";

class Symbol extends ItemBase {
  symbolLibId: IdType;
  name: string;
  content: string;
  id: IdType;
  placements: Placement[] = [];

  constructor(symbolLibId: IdType, id: IdType, name: string, content: string) {
    super("symbol");
    this.symbolLibId = symbolLibId;
    this.id = id || uuidv4();
    this.name = name;
    this.content = content;
  }

  toJSON(): object {
    return Object.assign({}, this);
  }

  static fromJSON(json: any): Symbol {
    const symbol = Object.create(Symbol.prototype);
    return Object.assign(symbol, json);
  }

  createPlacement(type: string, content: string, id: IdType): Placement {
    const pl = new Placement(type, content, id);
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

export default Symbol;
