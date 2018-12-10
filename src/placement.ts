const uuidv4 = require("uuid/v4");

class Placement {
  projectId: string;
  pageId: string;
  id: string;
  graphic: string;

  constructor(projectId: string, pageId: string, graphic: string) {
    this.projectId = projectId;
    this.pageId = pageId;
    this.id = uuidv4();
    this.graphic = graphic;
  }
}

export default Placement;
