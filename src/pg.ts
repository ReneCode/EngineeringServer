import pgUtil from "./postgre/pgUtil";

const init = async () => {
  await pgUtil.createDatabaseIfNotExists("engineering");
  const d = await pgUtil.getDatabase();
  console.log(d);
};

init().then(() => {
  console.log("ready");
});
console.log("start");

export default 42;
