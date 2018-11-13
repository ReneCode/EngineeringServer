const { buildSchema } = require("graphql");

const schema = buildSchema(`
  type Query {
    projects: [Project],
    project(id:ID!): Project

    pages(projectId: ID!): [Page],

    graphics(projectId: ID!, pageId: ID!): [Graphic]

  }

  type Mutation {
    createProject(input: ProjectInput!): Project

    createPage(input: PageInput!) : Page
    
    createGraphic(input: CreateGraphicInput!): Graphic
    updateGraphics(input: [UpdateGraphicInput]!): [Graphic]
    deleteGraphic(input: DeleteGraphicInput!): ID
  }

  input ProjectInput {
    name: String
  }

  type Project {
    id: ID,
    name: String,
    addPage(input: AddPageInput): Page,
    deletePage(input: DeletePageInput): ID,
    pages(void: String): [Page]
    page(id: ID!): Page
  }


  input AddPageInput {
    name: String
  }
  input DeletePageInput {
    id: ID
  }

  input PageInput {
    projectId: ID!,
    name: String
  }

  type Page {
    projectId: ID,
    id: ID,
    name: String
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
    id: ID!,
    content: String!
  }

  input DeleteGraphicInput {
    id: ID!
  }

`);

module.exports = schema;
