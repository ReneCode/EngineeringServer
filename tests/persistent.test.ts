const { createProject, deleteProject } = require("./util");
import ItemFactory from "../src/ItemFactory";
import Project from "../src/Project";
import Page from "../src/Page";

describe("persistence", () => {
  it("save", () => {
    const json = {
      _type: "project",
      pages: [
        {
          _type: "page",
          placements: [
            {
              _type: "placement",
              projectId: "9e083452-2443-4355-b4f1-eda116c16196",
              pageId: "8ea9cd83-a1fe-4f02-b32d-8ccda7762bcf",
              id: "374a49ff-2b62-4d6f-829b-f3a3bf337a29",
              content:
                '{"type":"symbolref","name":"symbol-596","pt":{"x":-276,"y":1428}}'
            }
          ],
          id: "8ea9cd83-a1fe-4f02-b32d-8ccda7762bcf",
          projectId: "9e083452-2443-4355-b4f1-eda116c16196",
          name: "new page A"
        },
        {
          _type: "page",
          placements: [],
          id: "5029f9f8-a60f-441f-9b85-187c0b02c2a5",
          projectId: "9e083452-2443-4355-b4f1-eda116c16196",
          name: "new page B"
        }
      ],
      elements: [
        {
          _type: "element",
          projectId: "9e083452-2443-4355-b4f1-eda116c16196",
          type: "symbol",
          id: "5282bbce-687a-4708-9c09-61a720f7df3a",
          name: "symbol-596",
          content:
            '{"items":[{"type":"line","p1":{"x":-272,"y":1428},"p2":{"x":-96,"y":1232}},{"type":"line","p1":{"x":-92,"y":1440},"p2":{"x":-344,"y":1252}}],"insertPt":{"x":-276,"y":1428}}'
        }
      ],
      id: "9e083452-2443-4355-b4f1-eda116c16196",
      name: "new project"
    };

    const obj: any = ItemFactory.fromJSON(json);
    expect(obj).toBeInstanceOf(Project);
    expect(obj.pages[0]).toBeInstanceOf(Page);
  });
});
