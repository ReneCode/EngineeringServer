import { deletePlacements, updateOnePlacement } from "./util";

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
  let projectId: string;
  let pageId: string;

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

    const line = await createPlacement(
      [projectId, pageId],
      "page",
      "line",
      "line-content",
      "id-1234"
    );
    expect(line.content).toEqual("line-content");
    expect(line.id).toEqual("id-1234");

    const circle = await createPlacement(
      [projectId, pageId],
      "page",
      "circle",
      "circle-content"
    );
    expect(circle.content).toEqual("circle-content");

    const placements = await getPlacements([projectId, pageId], "page");
    expect(placements).toHaveLength(2);
    const foundLine = placements[0];
    expect(foundLine).toBeTruthy();
    expect(foundLine).toHaveProperty("type", "line");
    expect(foundLine).toHaveProperty("id", line.id);
    expect(foundLine).toHaveProperty("content", "line-content");

    const foundCircle = placements[1];
    expect(foundCircle).toBeTruthy();
    expect(foundCircle).toHaveProperty("id", circle.id);
    expect(foundCircle).toHaveProperty("type", "circle");
    expect(foundCircle).toHaveProperty("content", "circle-content");
  });

  it("delete Placements", async () => {
    const content = "abcdesf";
    const placement = await createPlacement(
      [projectId, pageId],
      "page",
      "line",
      content
    );
    const placementId = placement.id;
    const placements = await getPlacements([projectId, pageId], "page");
    expect(placements).toHaveLength(1);

    const deletedPlacementId = await deletePlacements(
      [projectId, pageId],
      "page",
      placementId
    );
    expect(deletedPlacementId).toEqual(placementId);

    const newPlacements = await getPlacements([projectId, pageId], "page");
    expect(newPlacements).toHaveLength(0);
  });

  it("update placements", async () => {
    const content = "123456";
    const placement = await createPlacement(
      [projectId, pageId],
      "page",
      "line",
      content
    );
    const placementId = placement.id;
    const newContent = "abcdef";

    const changedId = await updateOnePlacement(
      [projectId, pageId],
      "page",
      placementId,
      newContent
    );

    expect(changedId).toEqual(placementId);

    const newPlacements = await getPlacements([projectId, pageId], "page");
    expect(newPlacements).toHaveLength(1);
    expect(newPlacements[0]).toHaveProperty("id", placementId);
    expect(newPlacements[0]).toHaveProperty("content", newContent);
  });
});
