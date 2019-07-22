import * as uuidv4 from "uuid/v4";
import { IdType } from "./types";
import ItemBase from "./ItemBase";

class Symbol extends ItemBase {
  symbolLibId: IdType;
  name: string;
  content: string;
  id: IdType;

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
}

export default Symbol;
