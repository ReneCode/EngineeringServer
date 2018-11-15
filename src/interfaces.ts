export interface Input<I> {
  input: I;
}

export interface CreateProjectInput {
  name: string;
}

export interface DeleteProjectInput {
  id: string;
}

export interface CreatePageInput {
  projectId: string;
  name: string;
}

export interface DeletePageInput {
  projectId: string;
  id: string;
}
