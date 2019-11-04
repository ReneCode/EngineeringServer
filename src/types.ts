import ObjectStore from "./ObjectStore/ObjectStore";

export type IdType = string;

export type ParentType = "page" | "symbol";

export namespace ObjectStore {
  export type Item = {
    oid: string;
    props: any;
    parentOid?: string;
    findex?: string;
    children?: Item[];
  };
}
