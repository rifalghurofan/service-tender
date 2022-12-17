const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const tendersRoute = require('./routes/tenders.routes')
const membersRoute = require('./routes/members.routes')
const propertyRoute = require('./routes/property.routes')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/tenders', tendersRoute)
app.use('/members', membersRoute)
app.use('/property', propertyRoute)

module.exports = app;
