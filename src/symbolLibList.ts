import SymbolLib from "./symbolLib";
import { IdType } from "./types";

class SymbolLibList {
  symbolLibs: SymbolLib[] = [];

  constructor() {
    this.symbolLibs = [];
  }

  getSymbolLibs(): SymbolLib[] {
    return this.symbolLibs;
  }

  createSymbolLib(id: IdType, name: string): SymbolLib {
    const p = new SymbolLib(id, name);
    this.symbolLibs.push(p);
    return p;
  }

  deleteSymbolLib(id: IdType): IdType {
    this.symbolLibs = this.symbolLibs.filter(sl => sl.id !== id);
    return id;
  }
}

const symbolLibList = new SymbolLibList();

export default symbolLibList;
