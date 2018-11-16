const {
  gql,
  createProject,
  deleteProject,
  createElement,
  getElements,
  deleteElement,
  updateElement
} = require("./util");

describe("element", () => {
  let projectId;

  beforeEach(async () => {
    const projectName = "myNewProject";
    projectId = await createProject(projectName);
  });

  afterEach(async () => {
    await deleteProject(projectId);
  });

  it("createElement", async () => {
    const elementType = "symbol";
    const elementName = "newSymbol";
    const elementContent = "1234";
    let mutation = `mutation createElement($input: CreateElementInput!) {
      createElement(input: $input) { projectId id name type content }
    }`;
    let variables = {
      input: {
        projectId: projectId,
        type: elementType,
        name: elementName,
        content: elementContent
      }
    };
    let res = await gql(mutation, variables);
    expect(res.data).toBeTruthy();
    expect(res.errors).toBeFalsy();
    let data = res.data;
    expect(data).toBeTruthy();
    const newElement = data.createElement;
    expect(newElement).toBeTruthy();
    expect(newElement).toHaveProperty("id");
    expect(newElement).toHaveProperty("projectId", projectId);
    expect(newElement).toHaveProperty("type", elementType);
    expect(newElement).toHaveProperty("name", elementName);
    expect(newElement).toHaveProperty("content", elementContent);
  });

  it("deleteElement", async () => {
    const element = await createElement(
      projectId,
      "symbol",
      "terminal",
      "1234"
    );
    expect(element).toBeTruthy();

    const elements = await getElements(projectId);
    expect(elements).toHaveLength(1);
    const newElement = elements[0];
    expect(newElement).toHaveProperty("id");
    expect(newElement).toHaveProperty("type", "symbol");

    await deleteElement(projectId, newElement.id);

    const newElements = await getElements(projectId);
    expect(newElements).toHaveLength(0);
  });

  it("updateElement", async () => {
    const element = await createElement(
      projectId,
      "symbol",
      "terminal",
      "1234"
    );

    const newElement = await updateElement(
      projectId,
      element.id,
      "newType",
      "newName",
      "newContent"
    );
    expect(newElement).toBeTruthy();
    expect(newElement).toEqual(element.id);

    const newElements = await getElements(projectId);
    expect(newElements).toHaveLength(1);
    const e = newElements[0];
    expect(e).toHaveProperty("id", element.id);
    expect(e).toHaveProperty("type", "newType");
    expect(e).toHaveProperty("name", "newName");
    expect(e).toHaveProperty("content", "newContent");
  });
});
