const fetch = require("node-fetch");

const gql = async (query, variables = null) => {
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

const getProjects = async () => {
  const query = `{
    projects { id name}
  }`;
  const json = await gql(query);
  return json.data.projects;
};

const createPage = async (projectId, pageName) => {
  let mutation = `mutation createProject($input: CreatePageInput!) {
      createPage(input: $input) { id projectId name }
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

const getPage = async (projectId, pageId) => {
  const query = `query Q($projectId: ID!, $pageId: ID!) {
    project(id: $projectId) {
      page(id: $pageId) {
        id projectId, name
      }
    }
  }`;
  variables = {
    projectId: projectId,
    pageId: pageId
  };
  const res = await gql(query, variables);
  const page = res.data.project.page;
  return page;
};

const getPages = async projectId => {
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

const deletePage = async (projectId, pageId) => {
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

const createProject = async projectName => {
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

const deleteProject = async projectId => {
  // delete the new project
  mutation = `mutation deleteProject($input: DeleteProjectInput!) {
        deleteProject(input: $input)
    }`;
  variables = {
    input: {
      id: projectId
    }
  };
  await gql(mutation, variables);
};

const createPlacement = async (projectId, pageId, type, content) => {
  let mutation = `mutation M($input: [CreatePlacementInput]!) {
    createPlacement(input: $input) { id projectId pageId content }
  }`;
  let variables = {
    input: [
      {
        projectId,
        pageId,
        type,
        content
      }
    ]
  };
  try {
    let res = await gql(mutation, variables);
    return res.data.createPlacement[0];
  } catch (ex) {
    console.log("Exception:", ex);
  }
};

const getPlacements = async (projectId, pageId) => {
  // get placement
  const query = `query Q($projectId: ID!, $pageId: ID!) {
        project(id: $projectId) {
          page(id: $pageId) {
            placements {
              projectId pageId id content
            }
          }
        }
      }`;
  variables = {
    projectId,
    pageId
  };
  res = await gql(query, variables);
  expect(res.data).toBeTruthy();
  expect(res.errors).toBeFalsy();
  data = res.data;
  const placements = res.data.project.page.placements;
  return placements;
};

const updateOnePlacement = async (
  projectId,
  pageId,
  placementId,
  newContent
) => {
  const mutation = `mutation updatePlacements($input: [UpdatePlacementsInput]!) {
    updatePlacements(input: $input) 
  }`;
  const variables = {
    input: [
      {
        projectId: projectId,
        pageId: pageId,
        id: placementId,
        content: newContent
      }
    ]
  };
  await gql(mutation, variables);
};

const createElement = async (projectId, type, name, content) => {
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

const getElements = async projectId => {
  const query = `query Q($projectId: ID!) {
        project(id: $projectId) {
          elements { projectId id name type content }
        }
      }`;
  variables = {
    projectId
  };
  res = await gql(query, variables);
  expect(res.data).toBeTruthy();
  expect(res.errors).toBeFalsy();
  return res.data.project.elements;
};

const deleteElement = async (projectId, elementId) => {
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

const updateElement = async (projectId, elementId, type, name, content) => {
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

module.exports = {
  gql,
  getProjects,
  createProject,
  deleteProject,
  createPage,
  deletePage,
  getPages,
  getPage,
  createPlacement,
  getPlacements,
  updateOnePlacement,
  createElement,
  getElements,
  deleteElement,
  updateElement
};
