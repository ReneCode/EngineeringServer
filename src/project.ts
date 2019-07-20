import * as uuidv4 from "uuid/v4";
import Page from "./page";
import { IdType } from "./types";
import Element from "./element";
import ItemBase from "./ItemBase";

class Project extends ItemBase {
  id: IdType;
  name: string;
  pages: Page[] = [];
  elements: Element[] = [];

  constructor(id: IdType, name: string) {
    super("project");
    this.id = id || uuidv4();
    this.name = name;
  }

  toJSON(): object {
    return Object.assign({}, this, {
      pages: this.pages.map(p => p.toJSON()),
      elements: this.elements.map(e => e.toJSON())
    });
  }

  static fromJSON(json: any): Project {
    const project = Object.create(Project.prototype);
    return Object.assign(project, json, {
      pages: json.pages.map((p: any) => Page.fromJSON(p)),
      elements: json.elements.map((p: any) => Element.fromJSON(p))
    });
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

  updatePage(id: IdType, name: string): IdType {
    this.pages = this.pages.map(p => {
      if (p.id === id) {
        p.name = name;
      }
      return p;
    });
    return id;
  }

  getPage(id: IdType): Page | undefined {
    try {
      if (this.pages.length > 0) {
        if (id === "first") {
          return this.pages[0];
        } else {
          return this.pages.find(p => p.id === id);
        }
      } else {
        return undefined;
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  page({ id }: { id: IdType }): Page | undefined {
    console.log("read page:", id);
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
        s.type = type;
        s.name = name;
        s.content = content;
        return s;
      } else {
        return s;
      }
    });
    return id;
  }
}

export default Project;
