import { IdType, ParentType } from "./types";

export interface Input<I> {
  input: I;
}

export interface CreateSymbolInput {
  symbolLibId: IdType;
  id: IdType;
  name: string;
  content: string;
}
export interface UpdateSymbolInput {
  symbolLibId: IdType;
  id: IdType;
  name: string;
  content: string;
}
export interface DeleteSymbolInput {
  symbolLibId: IdType;
  id: IdType;
}

export interface CreateSymbolLibInput {
  id: IdType;
  name: string;
}
export interface DeleteSymbolLibInput {
  id: IdType;
}

export interface CreateProjectInput {
  name: string;
  id: IdType;
}

export interface DeleteProjectInput {
  id: IdType;
}

export interface CreatePageInput {
  projectId: IdType;
  name: string;
}

export interface DeletePageInput {
  projectId: IdType;
  id: IdType;
}
export interface UpdatePageInput {
  projectId: IdType;
  id: IdType;
  name: string;
}

export interface CreatePlacementInput {
  parentIds: IdType[];
  parentType: ParentType;
  id: IdType;
  type: string;
  content: string;
}
export interface DeletePlacementInput {
  parentIds: IdType[];
  parentType: ParentType;
  id: IdType;
}
export interface UpdatePlacementInput {
  parentIds: IdType[];
  parentType: ParentType;
  id: IdType;
  content: string;
}

export interface CreateElementInput {
  projectId: IdType;
  type: string;
  name: string;
  content: string;
}

export interface DeleteElementInput {
  projectId: IdType;
  id: string;
}

export interface UpdateElementInput {
  projectId: IdType;
  id: string;
  type: string;
  name: string;
  content: string;
}
