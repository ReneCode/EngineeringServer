import { ObjectType } from "./ObjectStore";

export namespace Multiplayer {
  export type ActionType = "create" | "remove" | "update";
  export type ResultType = "ok" | "reject";

  export type ClientMessage = {
    store: string;
    type: ActionType;
    data: ObjectType[] | string[];
  };

  // response of the server
  export type ServerMessage = {
    me: boolean;
    store: string;
    result: ResultType;
    type: ActionType;
    data: ObjectType[] | string[];
  };
}

export default Multiplayer;
