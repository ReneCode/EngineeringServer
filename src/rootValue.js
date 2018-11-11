const { projectList } = require("./project");
const { pageList } = require("./page");

const rootValue = {
  createProject: ({ name }) => {
    return projectList.createProject(name);
  },

  projects: () => {
    return projectList.getProjects();
  },

  project: ({ id }) => {
    return projectList.getProject(id);
  },

  // --------

  pages: ({ projectId }) => {
    return pageList.getPages(projectId);
  },

  createPage: ({ projectId, name }) => {
    return pageList.createPage(projectId, name);
  }
};

module.exports = rootValue;
