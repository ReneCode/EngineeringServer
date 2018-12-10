const { createProject, deleteProject } = require("./util");

describe("persistence", () => {
  let projectId;

  beforeEach(async () => {
    const projectName = "myNewProject";
    projectId = await createProject(projectName);
  });

  afterEach(async () => {
    await deleteProject(projectId);
  });

  it("save", () => {});
});
