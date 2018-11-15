const {
  gql,
  createProject,
  deleteProject,
  createPage,
  getPages,
  deletePage
} = require("./util");

describe("page", () => {
  let projectId;

  beforeEach(async () => {
    const projectName = "myNewProject";
    projectId = await createProject(projectName);
  });

  afterEach(async () => {
    await deleteProject(projectId);
  });

  it("createPage", async () => {
    const pageName = "newPage";
    // create new page
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
    expect(data).not.toBeNull;
    const page = data.createPage;
    expect(page).not.toBeNull();
    expect(page.name).toBe(pageName);
    expect(page.id).not.toBeNull();
    const pageId = page.id;

    // get pages
    const query = `query project($id: ID!) {
      project(id: $id) {
        pages { id name }
      }
    }`;
    variables = {
      id: projectId
    };
    const json = await gql(query, variables);
    const { pages } = json.data.project;
    expect(pages).toHaveLength(1);
    const foundPage = pages.find(p => p.id == pageId);
    expect(foundPage).toBeTruthy();
    expect(foundPage.name).toEqual(pageName);
  });

  it("delete Page", async () => {
    const pageName = "new page";
    const page = await createPage(projectId, pageName);
    let pages = await getPages(projectId);
    expect(pages).toHaveLength(1);

    let mutation = `mutation deletePage($input: DeletePageInput!) {
      deletePage(input: $input) 
    }`;
    let variables = {
      input: {
        projectId: projectId,
        id: page.id
      }
    };
    const res = await gql(mutation, variables);

    pages = await getPages(projectId);
    expect(pages).toHaveLength(0);
  });
});
