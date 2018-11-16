import * as uuidv4 from "uuid/v4";
import { IdType } from "./types";

class Element {
  projectId: IdType;
  type: string;
  name: string;
  content: string;
  id: IdType;

  constructor(projectId: IdType, type: string, name: string, content: string) {
    this.projectId = projectId;
    this.type = type;
    this.id = uuidv4();
    this.name = name;
    this.content = content;
  }
}

export default Element;
