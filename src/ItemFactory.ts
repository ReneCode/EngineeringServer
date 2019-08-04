import ItemBase from "./ItemBase";
import Element from "./Element";
import Page from "./Page";
import Placement from "./Placement";
import Project from "./Project";
import SymbolLib from "./SymbolLib";

class ItemFactory {
  static fromJSON(json: any): ItemBase | Array<ItemBase> {
    if (Array.isArray(json)) {
      return json.map((item: any) => {
        return <ItemBase>ItemFactory.fromJSON(item);
      });
    }
    const itemType: string = json["_type"];

    switch (itemType) {
      case "element":
        return Element.fromJSON(json);
      case "page":
        return Page.fromJSON(json);
      case "placement":
        return Placement.fromJSON(json);
      case "project":
        return Project.fromJSON(json);
      case "symbolLib":
        return SymbolLib.fromJSON(json);
      default:
        // console.log("bad item type:", json.type);
        throw new Error("bad item type:" + itemType + " / " + json);
    }
  }
}

export default ItemFactory;
