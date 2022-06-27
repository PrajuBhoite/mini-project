// const express = require("express");
// const app = express();
// const path = require("path");
// const logger = require("morgan");
// const mongoose = require("mongoose");

// const PORT = 4000;

// const apiRouter = require("./routes/apis");

// app.use(logger("dev"));
// app.use(express.json({ limit: "5mb" }));
// app.use(express.urlencoded({ extended: true }));

// mongoose.connect("mongodb://localhost:27017/miniprojectbackend")
// .then(res => console.log(`Mongoose connected to db successfully ${res}`))
// .catch(err => console.log(`Mongoose connection to db failed ${err.message}`));

// app.use("/api",apiRouter);

// console.log("let's start")

// app.listen(PORT, () => {
//     console.log(`Server is connected.at adreess ${PORT}`);
// })

const express = require("express");
const http = require("http");
const createError = require("http-errors");
const path = require("path");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

const apiRouter = require("./routes/apis/index");
//const webRouter = require("./routes/web");
//const ProductModel = require("./models/products.model");
const helmet = require("helmet");

app.use(logger("dev"));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet.hidePoweredBy());
app.use(helmet.crossOriginResourcePolicy())

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect("mongodb://localhost:27017/miniprojectbackend")
  .then((res) => console.log(`Mongoose connected to db successfully ${res}`))
  .catch((err) =>
    console.error(`Mongoose connection to db failed ${err.message}`)
  );

class InvalidObjectIdError extends Error {
  constructor(message = "Invalid object id", code = 400) {
    super(message);
    this.code = code;
  }
}

//app.use("/", webRouter);
// app.use("/", (req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
//   if(req.method === "OPTIONS") {
//     console.log('OPTIONS request');
//     return res.status(200).send("OK");
//   }
//   next();
// })

app.use("/api", apiRouter);
app.get("/api/test/:testId", async (req, res) => {
  const { testId } = req.params;
  try {
    const isValidObjectId = mongoose.isValidObjectId(testId);
    if (!isValidObjectId) throw new InvalidObjectIdError();
    const product = await ProductModel.findById(testId);
    return res.json({ product });
  } catch (error) {
    console.error(error.message, error.code);
    return res
      .status(error.code)
      .json({ message: error.message, code: error.code });
  }
});
app.get("/api/test", async (req, res) => {
  const reg = new RegExp("no", "i");
  const products = await ProductModel.find(
    { "images.title": { $regex: reg } },
    { id: 1, name: 1, price: 1, taxes: 1, tags: 1 }
  );
  // const products = await ProductModel.find(
  //   {
  //     $or: [
  //       {
  // { name: { $regex: /^i[a-z]+/, $options: "ig" } },
  //         net_price: { $gte: 100, $lte: 500 },
  //         price: "1023508.71",
  //       },
  //       { name: "Quod tempora aut est et." },
  //     ],
  //   },
  //   { id: 1, name: 1, price: 1, net_price: 1 }
  // );
  // const products = await ProductModel.find({}, { name: 1, price: 1}).sort({ name: 1, price: -1 }).limit(5).skip(5);
  return res.json({ products, count: products.length });
});
app.get("/api/update-test", async (req, res) => {
  const product = await ProductModel.findOne({ id: 21 });
  product.tags = ["first tag", "second tag", "random", "non-random"];
  await product.save();
  // const updatedProduct = await ProductModel.updateOne(
  //   { id: 21 },
  //   { $set: { price: 3299 }},
  //   {
  //     new: true,
  //     upsert: true,
  //   }
  // );
  // const updatedProduct = await ProductModel.findOneAndUpdate(
  //   { id: 2 },
  //   { $set: { "images.$[elem].title": "Laudantium sapiente qui totam et" } },
  //   {
  //     new: true,
  //     arrayFilters: [{ "elem.description": { $regex: /molestias/i } }],
  //   }
  // );
  // const updatedProduct = await ProductModel.findOneAndUpdate(
  //   { "images.title": { $regex: /no/i } },
  //   { $pop: { tags: -1 } },
  //   { new: true }
  // );
  // const updatedProduct = await ProductModel.updateMany(
  //   { "images.title": { $regex: /no/i } },
  //   { $addToSet: { tags: "featured" } },
  //   { new: true }
  // );
  // const updatedProduct = await ProductModel.updateMany(
  //   { "images.title": { $regex: /no/i } },
  //   { $push: { tags: "featured" } },
  //   { new: true }
  // );
  // const updatedProduct = await ProductModel.findOneAndUpdate(
  //   { "images.title": { $regex: /no/i } },
  //   { $inc: { taxes: -10 }, $set: { price: 1029 } },
  //   { new: true }
  // );
  return res.json({ product });
});
// update products set taxes = taxes + 2, price = 238 where id = 2;

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

server.listen(PORT, () => {
  console.log(`Express application is listening at http://localhost:${PORT}`);
});