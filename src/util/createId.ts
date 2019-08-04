import * as UUID from "uuid/v4";

function createId(prefix: string = ""): string {
  let id = UUID().replace(/-/g, "");
  // 109156be-c4fb-41ea-b1b4-efe1671c5836

  if (prefix) {
    return prefix + "-" + id;
  }
  return id;
}

export default createId;
