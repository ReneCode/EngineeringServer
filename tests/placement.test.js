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

    let mutation = `mutation createPlacement($input: [CreatePlacementInput]!) {
      createPlacement(input: $input) { id projectId pageId type content }
    }`;
    let variables = {
      input: [
        {
          projectId: projectId,
          pageId: pageId,
          type: "line",
          content: "line-content"
        },
        {
          projectId: projectId,
          pageId: pageId,
          type: "circle",
          content: "circle-content"
        }
      ]
    };
    let res = await gql(mutation, variables);
    expect(res.data).toBeTruthy();
    expect(res.errors).toBeFalsy();
    let data = res.data;
    const gotPlacements = data.createPlacement;
    expect(gotPlacements).not.toBeNull();
    expect(gotPlacements).toHaveLength(2);
    expect(gotPlacements[0].content).toEqual("line-content");
    expect(gotPlacements[1].content).toEqual("circle-content");
    const lineId = gotPlacements[0].id;
    const circleId = gotPlacements[1].id;

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
      projectId: projectId,
      pageId: pageId
    };
    res = await gql(query, variables);
    expect(res.data).toBeTruthy();
    expect(res.errors).toBeFalsy();
    data = res.data;
    const placements = res.data.project.page.placements;
    expect(placements).toHaveLength(2);

    const foundLine = placements[0];
    expect(foundLine).toBeTruthy();
    expect(foundLine).toHaveProperty("projectId", projectId);
    expect(foundLine).toHaveProperty("pageId", pageId);
    expect(foundLine).toHaveProperty("id", lineId);
    expect(foundLine).toHaveProperty("content", "line-content");

    const foundCircle = placements[1];
    expect(foundCircle).toBeTruthy();
    expect(foundCircle).toHaveProperty("projectId", projectId);
    expect(foundCircle).toHaveProperty("pageId", pageId);
    expect(foundCircle).toHaveProperty("id", circleId);
    expect(foundCircle).toHaveProperty("content", "circle-content");
  });

  it("delete Placements", async () => {
    const content = "abcdesf";
    const placement = await createPlacement(projectId, pageId, "line", content);
    const placementId = placement.id;
    const placements = await getPlacements(projectId, pageId);
    expect(placements).toHaveLength(1);

    let mutation = `mutation M($input: [DeletePlacementInput]!) {
      deletePlacements(input: $input) 
    }`;
    let variables = {
      input: [
        {
          projectId: projectId,
          pageId: pageId,
          id: placementId
        }
      ]
    };
    const res = await gql(mutation, variables);

    const newPlacements = await getPlacements(projectId, pageId);
    expect(newPlacements).toHaveLength(0);
  });

  it("update placements", async () => {
    const content = "123456";
    const placement = await createPlacement(projectId, pageId, "line", content);
    const placementId = placement.id;
    const newContent = "abcdef";

    const mutation = `mutation updatePlacements($input: [UpdatePlacementInput]!) {
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

  it("placements", async () => {
    const content = "123456";
    const placement = await createPlacement(projectId, pageId, "line", content);
    const placementId = placement.id;

    const query = `query Q($projectId: ID!, $pageId: ID!) {
      placements(projectId: $projectId, pageId: $pageId) {
            projectId pageId id content
      }
    }`;
    variables = {
      projectId,
      pageId
    };
    const res = await gql(query, variables);
    expect(res.data).toBeTruthy();
    expect(res.errors).toBeFalsy();

    const placements = res.data.placements;
    expect(placements).toBeTruthy();
    expect(placements).toHaveLength(1);

    const foundPlacement = placements[0];
    expect(foundPlacement).toHaveProperty("projectId", projectId);
    expect(foundPlacement).toHaveProperty("pageId", pageId);
    expect(foundPlacement).toHaveProperty("id", placementId);
    expect(foundPlacement).toHaveProperty("content", content);
  });
});
