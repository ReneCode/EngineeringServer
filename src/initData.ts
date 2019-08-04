import projectList from "./ProjectList";
import createId from "./util/createId";

const initData = () => {
  const id = createId();
  const project = projectList.createProject(id, "new project");
  project.createPage("new page A");
  project.createPage("new page B");
  // add new project & pages
  // new Page(this.id, "new page A"),
  // new Page(this.id, "new page B")
};

export default initData;
