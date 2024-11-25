import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://21d12chaithanya:FyO6JsIDpypOTjl9@cluster0.1m7tq.mongodb.net/test';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;