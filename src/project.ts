import * as uuidv4 from "uuid/v4";
import Page from "./page";
import { IdType } from "./types";
import Element from "./element";

class Project {
  id: IdType;
  name: string;
  pages: Page[] = [];
  elements: Element[] = [];

  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
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

  createElement(type: string, name: string, content: string): Element {
    const symbol = new Element(this.id, type, name, content);
    this.elements.push(symbol);
    return symbol;
  }

  deleteElement(id: IdType): IdType {
    this.elements = this.elements.filter(s => s.id !== id);
    return id;
  }

  updateElement(
    id: IdType,
    type: string,
    name: string,
    content: string
  ): IdType {
    this.elements = this.elements.map(s => {
      if (s.id === id) {
        return {
          ...s,
          type,
          name,
          content
        };
      } else {
        return s;
      }
    });
    return id;
  }
}

export default Project;
