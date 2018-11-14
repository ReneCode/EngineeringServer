const { projectList } = require("./projectList");
const { pageList } = require("./pageList");
const { graphicList } = require("./graphic");

const rlog = (...args) => {
  console.log(...args);
};

const rootValue = {
  createProject: ({ input }) => {
    rlog("createProject");
    return projectList.createProject(input.name);
  },

  deleteProject: ({ input }) => {
    rlog("deleteProject");
    return projectList.deleteProject(input.id);
  },

  projects: () => {
    rlog("projects");
    return projectList.getProjects();
  },

  project: ({ id }) => {
    return projectList.getProject(id);
  },

  // --------

  pages: args => {
    rlog("pages:", args);
    const { projectId } = args;
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
  },

  updateGraphics: ({ input }) => {
    rlog("updateGraphics");
    return graphicList.updateGraphics(input);
  },

  deleteGraphic: ({ input }) => {}
};

module.exports = rootValue;
