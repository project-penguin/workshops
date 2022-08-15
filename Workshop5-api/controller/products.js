import { ObjectId } from 'mongodb'
import clientPromise from '../util/db';

async function getAllProducts() {
    const client = await clientPromise;
    const collection = client.db('db').collection('products');
    const results = await collection.aggregate([
      {
        $sort: {
          _id: 1
        }
      }
    ])
    .toArray();
    if (results) {
        return results
    } else {
      return null;
    }
}

async function getProducts(id) {
    const client = await clientPromise;
    const collection = client.db('db').collection('products');
    const results = await collection.findOne(
        { _id: ObjectId(id) },
    )
    if (results) {
        return results
    } else {
      return null;
    }
}

async function createProducts(productList) {
    if (typeof productList !== 'object') throw new Error('no')
    const client = await clientPromise;
    const collection = client.db('db').collection('products');
    const result = await collection.insertOne({
        products: productList,
    });

    if (result) {
      return result.insertedId
    } else {
      return null;
    }
}

export { createProducts, getProducts, getAllProducts }