const uuidv4 = require("uuid/v4");

class Page {
  id: string;
  projectId: string;
  name: string;

  constructor(projectId: string, name: string) {
    this.id = uuidv4();
    this.projectId = projectId;
    this.name = name;
  }
}

export default Page;
