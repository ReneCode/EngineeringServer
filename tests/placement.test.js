const {
  gql,
  createProject,
  deleteProject,
  createPage,
  deletePage,
  createPlacement,
  getPlacements
} = require("./util");

describe("placement", () => {
  let projectId;
  let pageId;

  beforeEach(async () => {
    const projectName = "myNewProject";
    const pageName = "myPage";
    projectId = await createProject(projectName);
    const page = await createPage(projectId, pageName);
    pageId = page.id;
  });

  afterEach(async () => {
    await deletePage(projectId, pageId);
    await deleteProject(projectId);
  });

  it("createPlacement", async () => {
    // create new placement

    const type = "line";
    const content = "abc-xyz";

    let mutation = `mutation createPlacement($input: CreatePlacementInput!) {
      createPlacement(input: $input) { id projectId pageId, type content }
    }`;
    let variables = {
      input: {
        projectId: projectId,
        pageId: pageId,
        type,
        content
      }
    };
    let res = await gql(mutation, variables);
    expect(res.data).toBeTruthy();
    expect(res.errors).toBeFalsy();
    let data = res.data;
    const placement = data.createPlacement;
    expect(placement).not.toBeNull();
    const placementId = placement.id;
    expect(placement.type).toBe(type);
    expect(placement.content).toBe(content);

    // get placement
    const query = `query Q($projectId: ID!, $pageId: ID!) {
      project(id: $projectId) {
        page(id: $pageId) {
          placements {
            projectId pageId id type content
          }
        }
      }
    }`;
    variables = {
      projectId: projectId,
      pageId: pageId
    };
    res = await gql(query, variables);
    expect(res.data).toBeTruthy();
    expect(res.errors).toBeFalsy();
    data = res.data;
    const placements = res.data.project.page.placements;
    expect(placements).toHaveLength(1);
    const foundPlacement = placements.find(p => p.id == placementId);
    expect(foundPlacement).toBeTruthy();
    expect(foundPlacement).toHaveProperty("projectId", projectId);
    expect(foundPlacement).toHaveProperty("pageId", pageId);
    expect(foundPlacement).toHaveProperty("id", placementId);
    expect(foundPlacement).toHaveProperty("type", type);
    expect(foundPlacement).toHaveProperty("content", content);
  });

  it("delete Placement", async () => {
    const type = "line";
    const content = "abcdesf";
    const placement = await createPlacement(projectId, pageId, type, content);
    const placementId = placement.id;
    const placements = await getPlacements(projectId, pageId);
    expect(placements).toHaveLength(1);

    let mutation = `mutation M($input: DeletePlacementInput!) {
      deletePlacement(input: $input) 
    }`;
    let variables = {
      input: {
        projectId: projectId,
        pageId: pageId,
        id: placementId
      }
    };
    const res = await gql(mutation, variables);

    const newPlacements = await getPlacements(projectId, pageId);
    expect(newPlacements).toHaveLength(0);
  });

  it("update placements", async () => {
    const type = "line";
    const content = "123456";
    const placement = await createPlacement(projectId, pageId, type, content);
    const placementId = placement.id;
    const newContent = "abcdef";

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
    const res = await gql(mutation, variables);
    expect(res.data).toBeTruthy();
    expect(res.errors).toBeFalsy();

    const newPlacements = await getPlacements(projectId, pageId);
    expect(newPlacements).toHaveLength(1);
    expect(newPlacements[0]).toHaveProperty("id", placementId);
    expect(newPlacements[0]).toHaveProperty("content", newContent);
  });
});