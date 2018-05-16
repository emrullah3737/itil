const moment = require('moment');

module.exports = (app) => {
  const Plugin = app.service('Plugin');
  const mongoose = app.service('Mongoose');
  const { Schema } = mongoose;
  const yapilanIsler = Schema({
    gun: { type: String },
    yapilanAdet: { type: Number },
    yapilmayanAdet: { type: Number },
  });

  const schema = Schema({
    urun: { type: String, required: true },
    hedeflenenMiktar: { type: Number, required: true },
    toplamSure: { type: String, required: true },
    toplamSureGun: { type: String },
    gunlukBeklenenUrun: { type: Number },
    calisanSayisi: { type: Number, required: true },
    gunlukCalismaSaati: { type: Number, required: true },
    urunZamanMaliyeti: { type: Number, required: true },
    urunMaliyeti: { type: Number, required: true },
    urunBirimFiyati: { type: Number, required: true },
    yapilanIsler: [yapilanIsler],
  }, {
    timestamps: true,
  });

  schema.set('toJSON', { virtuals: true });
  schema.set('toObject', { virtuals: true });

  const gunlukBeklenenUrun = doc => (
    (doc.calisanSayisi * doc.gunlukCalismaSaati) / doc.urunZamanMaliyeti);

  schema.pre('save', function (next) {
    const day = this.toplamSure.split(' to ');
    const start = moment(day[0]);
    const end = moment(day[1]);
    const sumDay = moment.duration(end.diff(start));
    const days = sumDay.asDays();
    this.toplamSureGun = (days + 1);

    this.gunlukBeklenenUrun = gunlukBeklenenUrun(this);
    next();
  });

  Plugin.plugins(schema, {
    patchHistory: { name: 'work' },
    modelPatches: true,
  });

  return mongoose.model('work', schema);
};
