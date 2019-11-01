export namespace Multiplayer {
  export type ActionType = "create" | "remove" | "update";
  export type ResultType = "ok" | "reject";

  export type ClientMessage = {
    store: string;
    type: ActionType;
    obj: ObjectType | string[];
  };

  // response of the server
  export type ServerMessage = {
    me: boolean;
    store: string;
    result: ResultType;
    type: ActionType;
    obj: ObjectType | string[];
  };

  export type ObjectType = {
    oid: string;
    props: Record<string, any>;
    children?: ObjectType[];
  };
}

export default Multiplayer;
