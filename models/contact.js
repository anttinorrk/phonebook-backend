const mongoose = require('mongoose')

require('dotenv').config();
const url = process.env.MONGODB_URL
console.log('url: ' + url)

mongoose.connect(url)
  .then(() => {
      console.log('connected to MongoDB')
  })
  .catch((error) => {
      console.log('error connecting to MongoDB: ', error.message)
  })
const contactSchema = new mongoose.Schema({
    name: {
      type: String,
      minlength: 3,
      required: true
    },
    number: {
      type: String,
      minlength: 8,
      validate: {
        validator: (num) => {
          const firstPartLength = num.split('-')[0].length
          console.log(firstPartLength)
          return (
            firstPartLength === 2 || firstPartLength === 3
          )
        },
        message: props => `${props.value} is not correctly formatted`
      }
    }
})
  
//defines what to do when response is transformed to JSON
contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

  module.exports = mongoose.model('Contact', contactSchema)