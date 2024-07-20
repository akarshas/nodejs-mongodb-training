const { getDb } = require('../util/database');
const mongodb = require('mongodb');

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id ? new mongodb.ObjectId(id) : null;
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      if (cp.productId.toString() === product._id.toString()) {
        return true;
      }
      return false;
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
      newQuantity = updatedCartItems[cartProductIndex].quntity + 1;
      updatedCartItems[cartProductIndex].quntity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quntity: newQuantity,
        price: product.price,
      });
    }
    const db = getDb();
    let totalPrice = 0;

    updatedCartItems.forEach((c) => {
      totalPrice = totalPrice + parseFloat(c.price) * c.quntity;
    });

    const updatedCart = {
      items: updatedCartItems,
      totalPrice: totalPrice,
    };

    return db.collection('users').updateOne(
      { _id: new mongodb.ObjectId(this._id) },
      {
        $set: { cart: updatedCart },
      }
    );
  }

  static findById(userID) {
    const db = getDb();
    return db
      .collection('users')
      .find({ _id: new mongodb.ObjectId(userID) })
      .next()
      .then((user) => {
        return user;
      })
      .catch((error) => console.log(error));
  }
}

module.exports = User;
