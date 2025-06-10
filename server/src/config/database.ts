import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log(' MongoDB connected');
  } catch (err) {
    const error = err as Error; //  Type assertion here
    console.error(' DB Error:', error.message);
  }
};
