import {
  createSymbolLib,
  getSymbolLibs,
  getSymbolLib,
  deleteSymbolLib,
  getSymbolLibByName
} from "./util";

describe("symbolLib", () => {
  it("createSymbolLib", async () => {
    const name = "new-symbol-lib";
    let id = "new-Id";

    const createdSymbolLib = await createSymbolLib(id, name);
    expect(createdSymbolLib).toBeTruthy();
    expect(createdSymbolLib.name).toBe(name);
    expect(createdSymbolLib.id).toBe(id);
    expect(createdSymbolLib.id).not.toBeNull();

    let symbolLibs = await getSymbolLibs();
    expect(symbolLibs).toBeTruthy();
    expect(symbolLibs.length).toBeGreaterThan(0);
    const newSymbolLib = symbolLibs.find((sl: any) => sl.id === id);
    expect(newSymbolLib).toBeTruthy();
    expect(newSymbolLib).toHaveProperty("id", id);
    expect(newSymbolLib).toHaveProperty("name", name);

    let foundSymbolLib = await getSymbolLib(id);
    expect(foundSymbolLib).toBeTruthy();
    expect(foundSymbolLib).toHaveProperty("id", id);
    expect(foundSymbolLib).toHaveProperty("name", name);

    await deleteSymbolLib(id);
    // check if deleted
    symbolLibs = await getSymbolLibs();
    const found = symbolLibs.find((sl: any) => sl.id === id);
    expect(found).toBeFalsy();
  });

  it("symbolLibByName", async () => {
    const name = "abc-lib";
    let id = "abc-Id";

    await createSymbolLib(id, name);

    const foundSymbolLib = await getSymbolLibByName(name);

    expect(foundSymbolLib).toBeTruthy();
    expect(foundSymbolLib).toHaveProperty("id", id);
    expect(foundSymbolLib).toHaveProperty("name", name);

    await deleteSymbolLib(id);
  });
});
