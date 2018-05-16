module.exports = (app) => {
  const mWork = app.service('model/work');

  app.get('(/:work)?', async (req, res) => {
    const { work } = req.params;
    if (!work) return res.render('page/index.html');
    try {
      const doc = await mWork.findById(work);
      return res.render('page/work.html', { doc, req });
    } catch (error) {
      return res.render('page/work.html', { error, req });
    }
  });

  app.post('/api/work', async (req, res) => {
    const { urun } = req.body;
    try {
      const doc = await mWork.findOrCreate({ urun }, req.body);
      res.json({ doc });
    } catch (error) {
      res.json({ error });
    }
  });

  app.put('/api/work/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const doc = await mWork.update(
        { _id: id },
        { $push: { yapilanIsler: req.body } });
      res.json({ doc });
    } catch (error) {
      res.json({ error });
    }
  });

  app.get('/api/work(/:id)?', async (req, res) => {
    const { id } = req.params;
    let doc;
    try {
      if (id) doc = await mWork.findById(id);
      else doc = await mWork.find({});
      res.json({ doc });
    } catch (error) {
      res.json({ error });
    }
  });
};
