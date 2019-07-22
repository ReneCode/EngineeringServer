const fetch = require("node-fetch");

const gql = async (query: string, variables: object) => {
  const url = "http://localhost:8080/graphql";

  const cmd = {
    query,
    variables
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(cmd)
  });
  return await res.json();
};

export const createSymbol = async (
  symbolLibId: string,
  id: string,
  name: string,
  content: string
) => {
  let mutation = `mutation createSymbol($input: CreateSymbolInput!) {
    createSymbol(input: $input) { symbolLibId id name content }
  }`;
  let variables = {
    input: {
      symbolLibId,
      id,
      name,
      content
    }
  };
  const res = await gql(mutation, variables);
  expect(res).toBeTruthy();
  expect(res.errors).toBeFalsy();
  const data = res.data;
  expect(data).toBeTruthy();
  return data.createSymbol;
};

export const getSymbols = async (symbolLibId: string) => {
  let query = `query Q($id: ID!) {
    symbolLib(id: $id) { 
      symbols { id name symbolLibId content }
    }
  }`;
  let variables = {
    id: symbolLibId
  };
  const res = await gql(query, variables);
  expect(res).toBeTruthy();
  expect(res.errors).toBeFalsy();
  const data = res.data;
  expect(data).toBeTruthy();
  expect(data.symbolLib).toBeTruthy();
  return data.symbolLib.symbols;
};
export const getSymbol = async (symbolLibId: string, symbolId: string) => {
  let query = `query Q($symbolLibId: ID!, $symbolId: ID!) {
    symbolLib(id: $symbolLibId) { 
      symbol(id: $symbolId) { id name symbolLibId content }
    }
  }`;
  let variables = {
    symbolLibId,
    symbolId
  };
  const res = await gql(query, variables);
  expect(res).toBeTruthy();
  expect(res.errors).toBeFalsy();
  const data = res.data;
  expect(data).toBeTruthy();
  expect(data.symbolLib).toBeTruthy();
  return data.symbolLib.symbol;
};

export const createSymbolLib = async (id: string, name: string) => {
  let mutation = `mutation M($input: CreateSymbolLibInput!) {
    createSymbolLib(input: $input) { id name }
  }`;
  let variables = {
    input: {
      id: id,
      name: name
    }
  };
  const { data } = await gql(mutation, variables);
  return data.createSymbolLib;
};

export const getSymbolLibs = async () => {
  const query = `{
    symbolLibs { id name}
  }`;
  const json = await gql(query, {});
  return json.data.symbolLibs;
};

export const getSymbolLib = async (id: string) => {
  const query = `query Q($id: ID!) {
    symbolLib(id: $id) { id name}
  }`;
  const variables = {
    id
  };
  const json = await gql(query, variables);
  expect(json).toBeTruthy();
  expect(json.errors).toBeFalsy();
  expect(json.data).toBeTruthy();
  return json.data.symbolLib;
};

export const deleteSymbolLib = async (symbolLibId: string) => {
  const mutation = `mutation deleteSymbolLib($input: DeleteSymbolLibInput!) {
        deleteSymbolLib(input: $input)
    }`;
  const variables = {
    input: {
      id: symbolLibId
    }
  };
  await gql(mutation, variables);
};
