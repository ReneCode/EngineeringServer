import * as uuidv4 from "uuid/v4";
import { IdType } from "./types";
import ItemBase from "./ItemBase";
import Symbol from "./Symbol";
import { symbol } from "prop-types";

class SymbolLib extends ItemBase {
  id: IdType;
  name: string;
  symbols: Symbol[];

  constructor(id: IdType, name: string) {
    super("symbolLib");
    this.id = id || uuidv4();
    this.name = name;
    this.symbols = [];
  }

  toJSON(): object {
    return Object.assign({}, this, {});
  }

  static fromJSON(json: any): SymbolLib {
    const project = Object.create(SymbolLib.prototype);
    return Object.assign(project, json, {});
  }

  public createSymbol(id: string, name: string, content: string): Symbol {
    const symbol = new Symbol(this.id, id, name, content);
    this.symbols.push(symbol);
    return symbol;
  }
  updateSymbol(id: string, name: string, content: string): string | null {
    this.symbols = this.symbols.map((sy: Symbol) => {
      if (sy.id === id) {
        sy.name = name;
        sy.content = content;
        return sy;
      } else {
        return sy;
      }
    });
    return id;
  }

  public symbol({ id }: { id: string }): Symbol | undefined {
    return this.symbols.find((sy: Symbol) => sy.id === id);
  }
}

export default SymbolLib;
