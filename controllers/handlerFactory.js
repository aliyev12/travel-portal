const { catchAsync, AppError, APIFeatures } = require("../utils");

const docNotFound = (name, id) =>
  new AppError(`${name} with ID ${id} was not found.`, 404);

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const key = Object.keys(Model)[0];
    const doc = await Model[key].findByIdAndDelete(req.params.id);

    if (!doc) return next(docNotFound(key, req.params.id));

    res.status(204).json({
      status: "success",
      data: null
    });
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    const key = Object.keys(Model)[0];
    let query = Model[key].findById(req.params.id);

    if (populateOptions) {
      query = query.populate(populateOptions);
    }

    const doc = await query;

    if (!doc) return next(docNotFound(key, req.params.id));
    res.status(200).json({
      status: "success",
      data: {
        [key.toLowerCase()]: doc
      }
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const key = Object.keys(Model)[0];
    // Strip body from password in case if it has it
    delete req.body.password;
    delete req.body.passwordConfirm;
    const doc = await Model[key].findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) return next(docNotFound(key, req.params.id));

    res.status(200).json({
      status: "success",
      data: {
        [key.toLowerCase()]: doc
      }
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const key = Object.keys(Model)[0];
    const newSome = await Model[key].create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        [key.toLowerCase()]: newSome
      }
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour
    let filter = {};
    if (req.param.tourId) filter = { tour: req.params.tourId };

    const key = Object.keys(Model)[0];
    // EXECUTE QUERY
    const features = new APIFeatures(Model[key].find(filter), req.query)
      // const features = new APIFeatures(Model[key].find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;

    // // Use this one below with ".explain()" for information about querying etc
    // const doc = await features.query.explain();

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: doc ? doc.length : 0,
      data: { [key.toLowerCase()]: doc }
    });
  });
