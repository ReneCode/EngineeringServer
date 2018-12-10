export type ItemType = "project" | "page" | "element" | "placement";

class ItemBase {
  _type: ItemType;

  constructor(type: ItemType) {
    this._type = type;
  }

  getItemType() {
    return this._type;
  }

  toJSON(): object {
    return {};
  }
}

export default ItemBase;
