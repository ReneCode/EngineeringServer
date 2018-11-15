const { buildSchema } = require("graphql");

const schema = buildSchema(`
  type Query {
    projects: [Project],
    project(id:ID!): Project

    pages(projectId: ID!): [Page],
    graphics(projectId: ID!, pageId: ID!): [Graphic]

  }

  type Mutation {
    createProject(input: CreateProjectInput!): Project
    deleteProject(input: DeleteProjectInput!): ID

    createPage(input: CreatePageInput!) : Page
    deletePage(input: DeletePageInput!) : ID
    
    createGraphic(input: CreateGraphicInput!): Graphic
    updateGraphics(input: [UpdateGraphicInput]!): [Graphic]
    deleteGraphic(input: DeleteGraphicInput!): ID
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
    graphics: [Graphic]
  }

  type Graphic {
    projectId: ID,
    pageId: ID,
    id: ID,
    type: String,
    content: String
  }

  input CreateGraphicInput {
    projectId: ID!,
    pageId: ID!,
    type: String!,
    content: String!
  }

  input UpdateGraphicInput {
    projectId: ID!,
    pageId: ID!,
    id: ID!,
    content: String!
  }

  input DeleteGraphicInput {
    projectId: ID!,
    pageID: ID!,
    id: ID!
  }



  input AddPageInput {
    name: String
  }

`);

export default schema;
