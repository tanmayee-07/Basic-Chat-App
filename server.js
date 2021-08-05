var express = require("express")
var bodyParser = require("body-parser")
var app = express() //setting the variable to an instance of express
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')
var port = process.env.PORT || 5000

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

var dbUrl = ' mongodb+srv://admin:abcd1234@cluster0.pohxf.mongodb.net/mongo-node?retryWrites=true&w=majority '

var Message = mongoose.model('Message', {
    name : String,
    message: String
})

// entering dynamic messages into our application
app.get('/messages', (req,res)=>{
    Message.find({}, (err, messages) =>{
        res.send(messages)

    })
    
})

app.post('/messages', (req,res)=>{
    var message = new Message(req.body)
    message.save((err) => {
        if(err)
            res.status(500).send("Server Error") //server error
            io.emit('message', req.body) //req.body will contain the msg
            res.sendStatus(200) //200 is a status request which informs the client(web browser) that everything went well with the request and receive

    })
    
})

io.on('connection', (socket)=> {
    console.log(' user connected')
})

//connecting mongoose
mongoose.connect(dbUrl, (err)=> {
    console.log('mongodb connection successful')
})

//get the express server to start and listen for request
var server = http.listen(port, () => {
    console.log("Server listening to port %d", port )
})


