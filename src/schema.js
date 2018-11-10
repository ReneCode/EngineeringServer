const { buildSchema } = require("graphql");

const { Project, projectList } = require("./project");

const schema = buildSchema(`
  type Query {
    projects: [Project],
    project(id:String!): Project
  }

  type Mutation {
    createProject(name: String!): Project
  }

  type Project {
    id: String,
    name: String

    pages: [Int]
  }

  type Page {
    id: String,
    name: String
  }

`);

const rootValue = {
  createProject: ({ name }) => {
    return projectList.createProject(name);
  },

  projects: () => {
    return projectList.getProjects();
  },

  project: ({ id }) => {
    return projectList.getProject(id);
  }
};

module.exports = {
  schema,
  rootValue
};
