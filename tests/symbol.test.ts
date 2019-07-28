import {
  createSymbolLib,
  deleteSymbolLib,
  createSymbol,
  getSymbols,
  getSymbol,
  createPlacement,
  getPlacements
} from "./util";

describe("symbol", () => {
  let symbolLibId = "symbolLibId-abc";

  beforeEach(async () => {
    await createSymbolLib(symbolLibId, "mySymbolLib");
  });

  afterEach(async () => {
    await deleteSymbolLib(symbolLibId);
  });

  it("createSymbol", async () => {
    const name = "newSymbol";
    const content = "content";
    const id = "symbol-id";

    const symbol = await createSymbol(symbolLibId, id, name, content);
    expect(symbol).toHaveProperty("id", id);
    expect(symbol).toHaveProperty("symbolLibId", symbolLibId);
    expect(symbol).toHaveProperty("name", name);
    expect(symbol).toHaveProperty("content", content);
  });

  it("get Symbols", async () => {
    const name = "anotherNewSymbol";
    const content = "anotherContent";
    const id = "symbol-id-12345";

    await createSymbol(symbolLibId, id, name, content);
    const symbols = await getSymbols(symbolLibId);
    expect(symbols).toBeTruthy();
    expect(symbols).toBeInstanceOf(Array);
    expect(symbols.length).toBeGreaterThan(0);

    const symbol = symbols.find((s: any) => s.id === id);
    expect(symbol).toHaveProperty("id", id);
    expect(symbol).toHaveProperty("symbolLibId", symbolLibId);
    expect(symbol).toHaveProperty("name", name);
    expect(symbol).toHaveProperty("content", content);
  });

  it("get Symbol", async () => {
    const name = "anotherNewSymbol";
    const content = "anotherContent";
    const id = "symbol-id-332211";

    await createSymbol(symbolLibId, id, name, content);
    const symbol = await getSymbol(symbolLibId, id);
    expect(symbol).toBeTruthy();
    expect(symbol).toHaveProperty("id", id);
    expect(symbol).toHaveProperty("symbolLibId", symbolLibId);
    expect(symbol).toHaveProperty("name", name);
    expect(symbol).toHaveProperty("content", content);
  });

  it("create symbol placements", async () => {
    const symbol = await createSymbol(
      symbolLibId,
      "symbolId",
      "symbolName",
      "content"
    );
    const { id } = symbol;

    const placement = await createPlacement(
      [symbolLibId, id],
      "symbol",
      "line",
      "lineContent",
      "lineId"
    );
    expect(placement).toHaveProperty("id", "lineId");
    expect(placement).toHaveProperty("type", "line");
    expect(placement).toHaveProperty("content", "lineContent");

    const placements = await getPlacements([symbolLibId, id], "symbol");
    expect(placements).toHaveLength(1);
    const line = placements[0];
    expect(line).toHaveProperty("id", "lineId");
    expect(line).toHaveProperty("type", "line");
    expect(line).toHaveProperty("content", "lineContent");
  });
});
