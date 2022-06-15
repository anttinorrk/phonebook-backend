require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contact')

app.use(express.static('build'))
app.use(express.json())

app.use(morgan('tiny'))
app.use(cors())

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "040 654321"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "123 4567"
  }
]

app.get('/api/persons', (request, response) => {
  Contact.find({}).then(cur => {
    response.json(cur)
  })
})

//TODO 3.16: Error handling with express middleware
app.get('/api/persons/:id', (request, response, next) => {
  Contact.findById(request.params.id)
  .then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  Contact.countDocuments({})
  .then(count => {
    response.send(`Phonebook has ${count} persons saved<br><br>${new Date()}`)
  })
  .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  console.log('posting: ', body)
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }
  const person = new Contact({
    name: body.name,
    number: body.number
  })
  person.save()
    .then(newContact => {
      response.json(newContact)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number
  }

  Contact.findByIdAndUpdate(request.params.id, person)
  .then(updated => {
    response.json(updated)
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Contact.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})