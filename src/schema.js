const { buildSchema } = require("graphql");

const schema = buildSchema(`
  type Query {
    projects: [Project],
    project(id:String!): Project

    pages(projectId: String): [Page],
  }

  type Mutation {
    createProject(name: String!): Project
    createPage(projectId: String!, name: String!): Page
  }

  type Project {
    id: String,
    name: String

  }

  type Page {
    projectId: String,
    id: String,
    name: String
  }

`);

module.exports = schema;
