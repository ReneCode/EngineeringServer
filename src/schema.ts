const { buildSchema } = require("graphql");

const schema = buildSchema(`
  type Query {
    projects: [Project],
    project(id:ID!): Project

    pages(projectId: ID!): [Page],
    placements(projectId: ID!, pageId: ID!): [Placement]

    elements(projectID: ID!, type: String!, name: String!): [Element]
  }

  type Mutation {
    createProject(input: CreateProjectInput!): Project
    deleteProject(input: DeleteProjectInput!): ID

    createPage(input: CreatePageInput!): Page
    deletePage(input: DeletePageInput!): ID
    
    createPlacement(input: CreatePlacementInput!): Placement
    updatePlacements(input: [UpdatePlacementInput]!): [ID]
    deletePlacements(input: [DeletePlacementInput]!): [ID]

    createElement(input: CreateElementInput!): Element
    updateElement(input: UpdateElementInput!): ID
    deleteElement(input: DeleteElementInput!): ID
  }

  input CreateProjectInput {
    name: String!
  }
  input DeleteProjectInput {
    id: ID!
  }

  type Project {
    id: ID,
    name: String,
    pages: [Page],
    page(id: ID!): Page,

    elements: [Element]
  }


  input CreatePageInput {
    projectId: ID!,
    name: String!
  }
  input DeletePageInput {
    projectId: ID!,
    id: ID!
  }


  type Page {
    projectId: ID,
    id: ID,
    name: String
    placements: [Placement]
  }

  type Placement {
    projectId: ID,
    pageId: ID,
    id: ID,
    type: String,
    graphic: String
  }

  input CreatePlacementInput {
    projectId: ID!,
    pageId: ID!,
    type: String!,
    graphic: String!
  }

  input UpdatePlacementInput {
    projectId: ID!,
    pageId: ID!,
    id: ID!,
    graphic: String!
  }

  input DeletePlacementInput {
    projectId: ID!,
    pageId: ID!,
    id: ID!
  }

  type Element {
    projectId: ID
    id: ID
    type: String,
    name: String,
    content: String,
  }

  input CreateElementInput {
    projectId: ID!,
    type: String!,
    name: String!,
    content: String!
  }

  input DeleteElementInput {
    projectId: ID!,
    id: ID!
  }

  input UpdateElementInput {
    projectId: ID!,
    id: ID!,
    type: String!,
    name: String!,
    content: String!
  }

`);

export default schema;
