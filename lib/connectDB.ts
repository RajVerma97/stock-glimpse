import mongoose from 'mongoose'
import Logger from './winstonLogger'

const connection = { isConnected: false }

export const connectDB = async () => {
  if (connection.isConnected) {
    Logger.info('Using existing connection')
    return
  }

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI must be defined')
    }

    const db = await mongoose.connect(process.env.MONGODB_URI)

    connection.isConnected = db.connections[0].readyState === 1
    Logger.info('Connected to MongoDB')
  } catch (error) {
    Logger.error('Failed to connect to MongoDB' + error)
    throw new Error('Failed to connect to MongoDB' + error)
  }
}
