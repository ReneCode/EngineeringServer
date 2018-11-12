const { projectList } = require("./project");
const { pageList } = require("./page");

const rlog = args => {
  console.log(">", args);
};

const rootValue = {
  createProject: ({ input }) => {
    rlog("createProject");
    return projectList.createProject(input.name);
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

  createPage: ({ input }) => {
    rlog("createPage");
    return pageList.createPage(input.projectId, input.name);
  }
};

module.exports = rootValue;
