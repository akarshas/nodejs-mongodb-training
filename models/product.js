const { getDb } = require('../util/database');
const mongodb = require('mongodb');

class Product {
  constructor(title, price, imageUrl, description, id, userID) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
    this.id = id ? new mongodb.ObjectId(id) : null;
    this.userID = userID ? new mongodb.ObjectId(userID) : null;
  }

  save() {
    const db = getDb();
    let dbOp = null;
    if (this.id) {
      dbOp = db.collection('products').updateOne(
        { _id: this.id },
        {
          $set: {
            price: this.price,
            title: this.title,
          },
        }
      );
    } else {
      dbOp = db.collection('products').insertOne(this);
    }

    return dbOp;
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((error) => console.log(error));
  }

  static findById(prodId) {
    const db = getDb();
    return db
      .collection('products')
      .find({ _id: new mongodb.ObjectId(prodId) })
      .next()
      .then((product) => {
        return product;
      })
      .catch((error) => console.log(error));
  }
}

module.exports = Product;
