const fetch = require("node-fetch");

const gql = (query, variables = null) => {
  const url = "http://localhost:8080/graphql";

  const cmd = {
    query,
    variables
  };

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(cmd)
  }).then(res => res.json());
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

module.exports = {
  gql,
  getProjects,
  createProject,
  deleteProject,
  createPage,
  deletePage,
  getPages,
  getPage
};
