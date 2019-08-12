const { gql, getProjects } = require("./util");

describe("project", () => {
  it("createProject & deleteProject", async () => {
    const projectName = "myNewProject";

    // create new project
    let mutation = `mutation createProject($input: CreateProjectInput!) {
      createProject(input: $input) { id name symbolLibNames }
    }`;
    let variables = {
      input: {
        name: projectName
      }
    };
    let projectId;
    const { data } = await gql(mutation, variables);
    expect(data.createProject).not.toBeNull();
    expect(data.createProject.name).toBe(projectName);
    expect(data.createProject.id).not.toBeNull();
    projectId = data.createProject.id;

    // get projectList and check if there is the new project
    let projects = await getProjects();
    newProject = projects.find(p => p.id === projectId);
    expect(newProject).toBeTruthy();
    expect(newProject).toHaveProperty("id", projectId);
    expect(newProject).toHaveProperty("name", projectName);
    expect(newProject).toHaveProperty("symbolLibNames", []);

    projects = [];
    newProject = undefined;
    // updateProject
    mutation = `mutation updateProject($input: UpdateProjectInput!) {
      updateProject(input: $input) { id name symbolLibNames }
    }`;
    variables = {
      input: {
        id: projectId,
        name: "changed name",
        symbolLibNames: ["abc", "xyz"]
      }
    };
    await gql(mutation, variables);

    // check if symbolLibNames has changed
    projects = await getProjects();
    newProject = projects.find(p => p.id === projectId);
    expect(newProject).toHaveProperty("id"), projectId;
    expect(newProject).toHaveProperty("name", "changed name");
    expect(newProject).toHaveProperty("symbolLibNames", ["abc", "xyz"]);

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
    expect(newProject).toBeFalsy();
  });
});
