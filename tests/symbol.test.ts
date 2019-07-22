import {
  createSymbolLib,
  deleteSymbolLib,
  createSymbol,
  getSymbols,
  getSymbol
} from "./symbol-util";
import { array } from "prop-types";

const { gql } = require("./util");

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
});
