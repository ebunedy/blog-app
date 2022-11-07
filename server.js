const app = require("./app");
const connectDb = require("./db/db.config");

connectDb();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
