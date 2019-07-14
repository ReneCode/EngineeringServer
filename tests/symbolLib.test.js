const { gql, getSymbolLibs } = require("./util");

describe("symbolLib", () => {
  it("createSymbolLib", async () => {
    const name = "new-symbol-lib";
    let id = "new-Id";

    let mutation = `mutation createSymbolLib($input: CreateSymbolLibInput!) {
      createSymbolLib(input: $input) { id name }
    }`;
    let variables = {
      input: {
        id: id,
        name: name
      }
    };
    const { data } = await gql(mutation, variables);
    expect(data.createSymbolLib).not.toBeNull();
    expect(data.createSymbolLib.name).toBe(name);
    expect(data.createSymbolLib.id).toBe(id);
    expect(data.createSymbolLib.id).not.toBeNull();
    const newId = data.createSymbolLib.id;

    // read
    let symbolLibs = await getSymbolLibs();
    expect(symbolLibs).toBeTruthy();
    expect(symbolLibs.length).toBeGreaterThan(0);
    const newSymbolLib = symbolLibs.find(sl => sl.id === id);
    expect(newSymbolLib).toBeTruthy();
    expect(newSymbolLib).toHaveProperty("id", id);
    expect(newSymbolLib).toHaveProperty("name", name);

    // delete
    mutation = `mutation deleteSymbolLib($input: DeleteSymbolLibInput!) {
          deleteSymbolLib(input: $input)
      }`;
    variables = {
      input: {
        id: id
      }
    };
    await gql(mutation, variables);

    // check if deleted
    symbolLibs = await getSymbolLibs();
    const found = symbolLibs.find(sl => sl.id === id);
    expect(found).toBeFalsy();
  });
});
