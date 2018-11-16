const { buildSchema } = require("graphql");

const schema = buildSchema(`
  type Query {
    projects: [Project],
    project(id:ID!): Project

    pages(projectId: ID!): [Page],
    placements(projectId: ID!, pageId: ID!): [Placement]

    elements: [Element]
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
    deleteElement(Input: DeleteElementInput!): ID
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
    pages: [Page]
    page(id: ID!): Page
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
    name: String,
    content: String,
    id: ID!
  }

  input CreateElementInput {
    name: String!,
    content: String
  }

  input DeleteElementInput {
    id: ID!
  }

  input UpdateElementInput {
    id: ID!,
    name: String,
    content: String
  }




`);

export default schema;
