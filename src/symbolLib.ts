import * as uuidv4 from "uuid/v4";
import { IdType } from "./types";
import ItemBase from "./ItemBase";

class SymbolLib extends ItemBase {
  id: IdType;
  name: string;
  constructor(id: IdType, name: string) {
    super("symbolLib");
    this.id = id || uuidv4();
    this.name = name;
  }

  toJSON(): object {
    return Object.assign({}, this, {});
  }

  static fromJSON(json: any): SymbolLib {
    const project = Object.create(SymbolLib.prototype);
    return Object.assign(project, json, {});
  }
}

export default SymbolLib;
