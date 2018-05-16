module.exports = function Boot(app) {
  const mWork = app.service('model/work');

  app.use(async (req, res, next) => {
    try {
      const works = await mWork.find({});
      res.locals.works = works;
      res.locals.request = req;
    } catch (e) {
      // console.log(e);
    }
    next();
  });

  return true;
};
