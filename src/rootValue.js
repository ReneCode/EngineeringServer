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

  pages: ({ projectId }) => {
    rlog("pages");
    const project = projectList.getProject(projectId);
    if (project) {
      return project.pages;
    } else {
      return null;
    }
  },

  createPage: ({ input }) => {
    rlog("createPage");
    const project = projectList.getProject(input.projectId);
    return project.createPage(input);
  },

  deletePage: ({ input }) => {
    rlog("deletePage");
    const project = projectList.getProject(input.projectId);
    return project.deletePage(input);
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
