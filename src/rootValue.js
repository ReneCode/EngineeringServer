const { projectList } = require("./project");
const { pageList } = require("./page");
const { graphicList } = require("./graphic");

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
  },

  // -----------
  graphics: ({ projectId, pageId }) => {
    rlog("graphics");
    return graphicList.getGraphics(projectId, pageId);
  },

  createGraphic: ({ input }) => {
    rlog("createGraphic");
    return graphicList.createGraphic(
      input.projectId,
      input.pageId,
      input.type,
      input.content
    );
  }
};

module.exports = rootValue;
