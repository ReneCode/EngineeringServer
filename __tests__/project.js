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

describe("project", () => {
  it("createProject & deleteProject", async () => {
    const projectName = "myNewProject";

    // create new project
    let mutation = `mutation createProject($input: CreateProjectInput!) {
      createProject(input: $input) { id name }
    }`;
    let variables = {
      input: {
        name: projectName
      }
    };
    let projectId;
    const { data } = await gql(mutation, variables);
    expect(data.createProject).not.toBeNull;
    expect(data.createProject.name).toBe(projectName);
    expect(data.createProject.id).not.toBeNull;
    projectId = data.createProject.id;

    // get projectList and check if there is the new project
    let projects = await getProjects();
    newProject = projects.find(p => p.id === projectId);
    expect(newProject).toHaveProperty("id", projectId);
    expect(newProject).toHaveProperty("name", projectName);

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

    // check if the project is deleted
    projects = await getProjects();
    newProject = projects.find(p => p.id === projectId);
    expect(newProject).toBeNull;
  });
});
