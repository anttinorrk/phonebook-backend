const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

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
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id, typeof id)
    const person = persons.find(person => person.id === id )
    person
      ? response.json(person)
      : response.status(404).end()
})

app.get('/info', (request, response) => {
  const personCount = persons.length
  response.send(`Phonebook has ${personCount} persons saved<br><br>${new Date()}`)
})

const generateId = () => {
  const newId = Math.floor(Math.random() * 10000)
    return newId
}
const duplicateName = (newName) => {
  return persons.map(c => c.name).includes(newName)
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(body)
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  } else if (duplicateName(body.name)){
    console.log(duplicateName())
    return response.status(409).json({
      error: 'name is already on the list'
    })
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }
  persons = persons.concat(person)
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    
    response.status(204).end()
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})