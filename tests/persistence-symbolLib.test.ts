import SymbolLib from "../src/symbolLib";

describe("persistence-symbolLib", () => {
  // const server = "http://localhost:8080";
  it("get symbolLibs", () => {
    const symbolLib = new SymbolLib("id", "new-SymbolLib");
    const symbol = symbolLib.createSymbol("id-symbol", "symbol", "content");

    const json = symbolLib.toJSON();

    expect(json).toBeTruthy();

    const newSymbolLib = SymbolLib.fromJSON(json);
    expect(newSymbolLib).toHaveProperty("id", symbolLib.id);
    expect(newSymbolLib).toHaveProperty("name", symbolLib.name);
    expect(newSymbolLib.symbols).toHaveLength(1);
    const newSymbol = newSymbolLib.symbols[0];
    expect(newSymbol).toHaveProperty("id", symbol.id);
    expect(newSymbol).toHaveProperty("name", symbol.name);
    expect(newSymbol).toHaveProperty("content", symbol.content);

    expect(1).toEqual(1);
  });
});
