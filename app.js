const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const indexRouter = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler.middleware");
const morganMiddleware = require("./middlewares/morgan.middleware");
const logger = require("./utils/logger");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");
require("dotenv").config();

var app = express();
corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(morganMiddleware);
app.use(errorHandler);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

logger.http("Debut session");

app.use("/api", indexRouter);

module.exports = app;
