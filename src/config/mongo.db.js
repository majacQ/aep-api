import mongoose from 'mongoose'
import chalk from 'chalk'
import config from '.'

mongoose.connection.on('connected', () => {
  console.info(chalk.green(`Connected to MongoDB`))
})

mongoose.connection.on('error', (err) => {
  console.error(chalk.red('Failed to Connect to MongoDB'), err)
})

mongoose.connection.on('disconnected', () => {
  console.info(chalk.blue('Disconnected to MongoDB'))
})

try {
  console.info(chalk.blue('Attempting to Connect to MongoDB'))
  mongoose.connect(
    config.get('DB.STRING'),
    { useNewUrlParser: true, useCreateIndex: true },
    (err) => {
      if (err) {
        console.error(err)
      }
    },
  )
} catch (err) {
  console.error(chalk.red('Error Connecting to MongoDB'), err)
}

module.exports = mongoose
