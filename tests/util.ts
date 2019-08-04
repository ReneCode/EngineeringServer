const fetch = require("node-fetch");

export const gql = async (query: string, variables: object = {}) => {
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

export const getProjects = async () => {
  const query = `{
    projects { id name}
  }`;
  const json = await gql(query);
  return json.data.projects;
};

export const createPage = async (projectId: string, pageName: string) => {
  let mutation = `mutation createProject($input: CreatePageInput!) {
      createPage(input: $input) { id name }
    }`;
  let variables = {
    input: {
      projectId: projectId,
      name: pageName
    }
  };
  const { data } = await gql(mutation, variables);
  const page = data.createPage;
  return page;
};

const getPage = async (projectId: string, pageId: string) => {
  const query = `query Q($projectId: ID!, $pageId: ID!) {
    project(id: $projectId) {
      page(id: $pageId) { id name }
    }
  }`;
  const variables = {
    projectId: projectId,
    pageId: pageId
  };
  const res = await gql(query, variables);
  const page = res.data.project.page;
  return page;
};

export const getPages = async (projectId: string) => {
  const query = `query project($id: ID!) {
    project(id: $id) {
      pages { id name }
    }
  }`;
  const variables = {
    id: projectId
  };
  const json = await gql(query, variables);
  return json.data.project.pages;
};

export const deletePage = async (projectId: string, pageId: string) => {
  let mutation = `mutation deletePage($input: DeletePageInput!) {
    deletePage(input: $input) 
  }`;
  let variables = {
    input: {
      projectId: projectId,
      id: pageId
    }
  };
  await gql(mutation, variables);
};

export const createProject = async (projectName: string) => {
  let mutation = `mutation createProject($input: CreateProjectInput!) {
        createProject(input: $input) { id  }
      }`;
  let variables = {
    input: {
      name: projectName
    }
  };
  const { data } = await gql(mutation, variables);
  return data.createProject.id;
};

export const deleteProject = async (projectId: string) => {
  // delete the new project
  const mutation = `mutation deleteProject($input: DeleteProjectInput!) {
        deleteProject(input: $input)
    }`;
  const variables = {
    input: {
      id: projectId
    }
  };
  await gql(mutation, variables);
};

export const createPlacement = async (
  parentIds: string[],
  parentType: string,
  type: string,
  content: string,
  id: string
) => {
  let mutation = `mutation M($input: [CreatePlacementInput]!) {
    createPlacement(input: $input) { id type content }
  }`;
  let variables = {
    input: [
      {
        parentIds,
        parentType,
        type,
        content,
        id
      }
    ]
  };

  const res = await gql(mutation, variables);
  expect(res).toBeTruthy();
  expect(res.errors).toBeFalsy();
  const data = res.data;
  expect(data).toBeTruthy();
  expect(data.createPlacement).toBeTruthy();

  return data.createPlacement[0];
};

export const getPlacements = async (
  parentIds: string[],
  parentType: string
) => {
  let query = "";
  let variables = {};

  switch (parentType) {
    default:
      expect(true).toEqual(false);
      break;

    case "symbol":
      query = `query Q($symbolLibId: ID!, $symbolId: ID!) {
          symbolLib(id: $symbolLibId) {
            symbol(id: $symbolId) {
              placements {
                type id content
              }
            }
          }
        }`;
      variables = {
        symbolLibId: parentIds.shift(),
        symbolId: parentIds.shift()
      };
      break;

    case "page":
      query = `query Q($projectId: ID!, $pageId: ID!) {
        project(id: $projectId) {
          page(id: $pageId) {
            placements {
              type id content
              }
            }
          }
        }`;
      variables = {
        projectId: parentIds.shift(),
        pageId: parentIds.shift()
      };
      break;
  }
  const res = await gql(query, variables);
  expect(res.errors).toBeFalsy();
  expect(res.data).toBeTruthy();
  const data = res.data;
  let placements = [];
  switch (parentType) {
    case "page":
      placements = data.project.page.placements;
      break;
    case "symbol":
      placements = data.symbolLib.symbol.placements;
      break;
  }
  return placements;
};

export const deletePlacements = async (
  parentIds: string[],
  parentType: string,
  id: string
) => {
  let mutation = `mutation M($input: [DeletePlacementInput]!) {
    deletePlacements(input: $input) 
  }`;
  let variables = {
    input: [
      {
        parentIds,
        parentType,
        id
      }
    ]
  };
  const res = await gql(mutation, variables);
  expect(res.errors).toBeFalsy();
  expect(res.data).toBeTruthy();
  return res.data.deletePlacements[0];
};

export const updateOnePlacement = async (
  parentIds: string[],
  parentType: string,
  placementId: string,
  newContent: string
) => {
  const mutation = `mutation updatePlacements($input: [UpdatePlacementInput]!) {
    updatePlacements(input: $input) 
  }`;
  const variables = {
    input: [
      {
        parentIds,
        parentType,
        id: placementId,
        content: newContent
      }
    ]
  };
  const res = await gql(mutation, variables);
  expect(res.errors).toBeFalsy();
  expect(res.data).toBeTruthy();
  return res.data.updatePlacements[0];
};

export const createElement = async (
  projectId: string,
  type: string,
  name: string,
  content: string
) => {
  let mutation = `mutation createElement($input: CreateElementInput!) {
    createElement(input: $input) { projectId id name type content }
  }`;
  let variables = {
    input: {
      projectId,
      type,
      name,
      content
    }
  };
  let res = await gql(mutation, variables);
  return res.data.createElement;
};

export const getElements = async (projectId: string) => {
  const query = `query Q($projectId: ID!) {
        project(id: $projectId) {
          elements { projectId id name type content }
        }
      }`;
  const variables = {
    projectId
  };
  const res = await gql(query, variables);
  expect(res.data).toBeTruthy();
  expect(res.errors).toBeFalsy();
  return res.data.project.elements;
};

export const deleteElement = async (projectId: string, elementId: string) => {
  let mutation = `mutation deleteElement($input: DeleteElementInput!) {
    deleteElement(input: $input) 
  }`;
  let variables = {
    input: {
      projectId: projectId,
      id: elementId
    }
  };
  const res = await gql(mutation, variables);
};

export const updateElement = async (
  projectId: string,
  elementId: string,
  type: string,
  name: string,
  content: string
) => {
  let mutation = `mutation UpdateElement($input: UpdateElementInput!) {
    updateElement(input: $input) 
  }`;
  let variables = {
    input: {
      projectId,
      id: elementId,
      type,
      name,
      content
    }
  };
  let res = await gql(mutation, variables);
  return res.data.updateElement;
};

export const createSymbol = async (
  symbolLibId: string,
  id: string,
  name: string,
  content: string
) => {
  let mutation = `mutation createSymbol($input: CreateSymbolInput!) {
    createSymbol(input: $input) { id name content }
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
      symbols { id name content }
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
      symbol(id: $symbolId) { id name content }
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
export const getSymbolLibByName = async (name: string) => {
  const query = `query Q($name: String!) {
    symbolLibByName(name: $name) { id name }
  }`;
  const variables = {
    name
  };
  const json = await gql(query, variables);
  expect(json).toBeTruthy();
  expect(json.errors).toBeFalsy();
  expect(json.data).toBeTruthy();
  return json.data.symbolLibByName;
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
