import mysql from 'mysql2/promise'

export const connectDB = async () => {
  try {
    const connection = await mysql.createConnection(process.env.MYSQL_URI)
    console.log(`MySQL Connected: ${connection.config.host}`)
    return connection
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}
