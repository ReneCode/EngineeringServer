const { buildSchema } = require("graphql");

const schema = buildSchema(`
  type Query {
    projects: [Project],
    project(id:ID!): Project

    pages(projectId: ID!): [Page],
    placement(projectId: ID!, pageId: ID!): [Placement]

  }

  type Mutation {
    createProject(input: CreateProjectInput!): Project
    deleteProject(input: DeleteProjectInput!): ID

    createPage(input: CreatePageInput!) : Page
    deletePage(input: DeletePageInput!) : ID
    
    createPlacement(input: CreatePlacementInput!): Placement
    updatePlacements(input: [UpdatePlacementsInput]!):[ID]
    deletePlacement(input: DeletePlacementInput!): ID
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
    content: String
  }

  input CreatePlacementInput {
    projectId: ID!,
    pageId: ID!,
    type: String!,
    content: String!
  }

  input UpdatePlacementsInput {
    projectId: ID!,
    pageId: ID!,
    id: ID!,
    content: String!
  }

  input PlacementContent {
    id: ID!,
    content: String!
  }

  input DeletePlacementInput {
    projectId: ID!,
    pageId: ID!,
    id: ID!
  }



  input AddPageInput {
    name: String
  }

`);

export default schema;
