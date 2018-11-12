const { buildSchema } = require("graphql");

const schema = buildSchema(`
  type Query {
    projects: [Project],
    project(id:String!): Project

    pages(projectId: String): [Page],
  }

  type Mutation {
    createProject(input: ProjectInput!): Project
    createPage(input: PageInput!) : Page
  }

  input ProjectInput {
    name: String
  }

  type Project {
    id: String,
    name: String
  }

  input PageInput {
    projectId: String,
    name: String
  }

  type Page {
    projectId: String,
    id: String,
    name: String
  }

`);

module.exports = schema;
