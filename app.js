const path = require('path');
const { connect } = require('./util/database');
const express = require('express');
const bodyParser = require('body-parser');

const User = require('./models/user');

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('669b600d561905fbd8ec1213').then((user) => {
    req.user = new User(
      user.name,
      user.email,
      user.cart ? user.cart : { items: [], totalPrice: 0 },
      user._id
    );
    next();
  });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

connect()
  .then((db) => {
    app.listen(3000);
  })
  .catch((e) => {
    console.log('Error', e);
  });
