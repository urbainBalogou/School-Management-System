require("dotenv").config();
const cors = require("cors");
const http = require("http");
require("./config/dbConnect");
const app = require("./app/app");
app.use(cors());
const PORT = process.env.PORT || 3000;
//server
const server = http.createServer(app);
server.listen(PORT, console.log(`Server is running on port ${PORT}`));
