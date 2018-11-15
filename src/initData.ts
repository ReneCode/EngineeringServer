import projectList from "./projectList";

const initData = () => {
  const project = projectList.createProject("new project");
  project.createPage("new page A");
  project.createPage("new page B");
  // add new project & pages
  // new Page(this.id, "new page A"),
  // new Page(this.id, "new page B")
};

export default initData;
