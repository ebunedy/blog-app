const app = require("./app");
const connectDb = require("./db/db.config");

connectDb();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`app listening on ${PORT}`);
});
