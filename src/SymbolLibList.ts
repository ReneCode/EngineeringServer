import SymbolLib from "./SymbolLib";
import { IdType } from "./types";

class SymbolLibList {
  symbolLibs: SymbolLib[] = [];

  constructor() {
    this.symbolLibs = [];
  }

  getSymbolLib(id: string): SymbolLib | undefined {
    return this.symbolLibs.find(sl => sl.id === id);
  }
  getSymbolLibByName(name: string): SymbolLib | undefined {
    return this.symbolLibs.find(sl => sl.name === name);
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
