import Element from "./element";
import { IdType } from "./types";

class ElementList {
  elements: Element[] = [];

  createElement(name: string, content: string): Element {
    const symbol = new Element(name, content);
    this.elements.push(symbol);
    return symbol;
  }

  deleteElement(id: IdType): IdType {
    this.elements = this.elements.filter(s => s.id !== id);
    return id;
  }

  updateElement(id: IdType, name: string, content: string): IdType {
    this.elements = this.elements.map(s => {
      if (s.id !== id) {
        return s;
      } else {
        return {
          ...s,
          name,
          content
        };
      }
    });
    return id;
  }
}

const elementList = new ElementList();

export default elementList;
