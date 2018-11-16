import * as uuidv4 from "uuid/v4";
import { IdType } from "./types";

class Element {
  name: string;
  content: string;
  id: IdType;

  constructor(name: string, content: string) {
    this.id = uuidv4();
    this.name = name;
    this.content = content;
  }
}

export default Element;
