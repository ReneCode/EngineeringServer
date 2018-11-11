const { projectList } = require("./project");
const { pageList } = require("./page");

const rlog = args => {
  console.log(">", args);
};

const rootValue = {
  createProject: ({ name }) => {
    rlog("createProject");
    return projectList.createProject(name);
  },

  projects: () => {
    rlog("projects");
    return projectList.getProjects();
  },

  project: ({ id }) => {
    return projectList.getProject(id);
  },

  // --------

  pages: ({ projectId }) => {
    rlog("pages");
    return pageList.getPages(projectId);
  },

  createPage: ({ projectId, name }) => {
    rlog("createPage");
    return pageList.createPage(projectId, name);
  }
};

module.exports = rootValue;
