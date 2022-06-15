const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://anttinorrk:${password}@cluster0.m0usr.mongodb.net/phonebookDB?retryWrites=true&w=majority`
mongoose.connect(url)

const ContactSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Contact = mongoose.model('Contact', ContactSchema)

if (process.argv.length>4) {
    const contact = new Contact({
        name: process.argv[3],
        number: process.argv[4]
    })
    contact.save().then(res => {
        console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
        mongoose.connection.close()
    })
} else {
    Contact.find({}).then(res => {
        res.forEach(cur => {
            console.log(cur)
        })
        mongoose.connection.close()
    })
}

