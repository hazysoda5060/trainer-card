require('dotenv').config()
const express = require('express')
const session = require('express-session')
const massive = require('massive')

const {CONNECTION_STRING, SESSION_SECRET, SERVER_PORT} = process.env

// CONTROLLERS

const authCtrl = require('./controllers/authController')
const cardCtrl = require('./controllers/cardController')
const searchCtrl = require('./controllers/searchController')
const buddyCtrl = require('./controllers/buddyController')

// INSTANCE CREATION
const app = express()

// TOP LEVEL MIDDLEWARE
app.use(express.json())
app.use(session ({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 1000 *60 *60 *24}
}))

// DATABASE CONNECTION
massive({
    connectionString: CONNECTION_STRING,
    ssl: {rejectUnauthorized: false}
}).then(db => {
    app.set('db', db)
    console.log('database connected!')
    app.listen(SERVER_PORT, () => console.log(`server is listening on port ${SERVER_PORT} :3`))
}).catch(err => console.log(err))

// ENDPOINTS
// auth
    app.post('/auth/register', authCtrl.register)
    app.post('/auth/login', authCtrl.login)
    app.get('/auth/logout', authCtrl.logout)
    app.get('/auth/me', authCtrl.getUser)

// card
    app.get('/api/card/:username', cardCtrl.getCard)
    app.put('/api/card/:user_id', cardCtrl.editCard)
    app.get('/api/card/', cardCtrl.getProfilePics)

// request
    // app.post('/api/request', requestCtrl.addRequest)
    // app.delete('/api/request/:request_id', requestCtrl.deleteRequest)
    // app.put('/api/request/:request_id', requestCtrl.editRequest)

// search
    app.get('/api/search/:username', searchCtrl.searchUsers)

// feed
    app.post('/api/dash/:buddy_id', buddyCtrl.addBuddy)
    app.get('/api/dash', buddyCtrl.getBuddies)
    // app.delete('/api/dash/:user_id', dashCtrl.removeUser)