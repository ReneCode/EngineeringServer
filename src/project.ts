import * as uuidv4 from "uuid/v4";
import Page from "./page";
import { IdType } from "./types";

class Project {
  id: IdType;
  name: string;
  pages: Page[] = [];

  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
    this.pages = [];
  }

  createPage(name: string): Page {
    const page = new Page(this.id, name);
    this.pages.push(page);
    return page;
  }

  deletePage(id: IdType): IdType {
    this.pages = this.pages.filter(p => p.id !== id);
    return id;
  }

  getPage(id: IdType): Page | undefined {
    try {
      const page = this.pages.find(p => p.id === id);
      return page;
    } catch (ex) {
      console.log(ex);
    }
  }

  page({ id }: { id: IdType }): Page | undefined {
    return this.getPage(id);
  }
}

export default Project;
