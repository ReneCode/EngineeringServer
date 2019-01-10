import { IdType } from "./types";

export interface Input<I> {
  input: I;
}

export interface CreateProjectInput {
  name: string;
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
  type: string;
  projectId: IdType;
  pageId: IdType;
  content: string;
}
export interface DeletePlacementInput {
  projectId: IdType;
  pageId: IdType;
  id: IdType;
}

export interface UpdatePlacementInput {
  projectId: IdType;
  pageId: IdType;
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
