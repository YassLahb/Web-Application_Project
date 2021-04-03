const express = require('express')
const app = express()

const port = process.env.PORT || 5000 
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const fs = require('fs')

const bodyparser = require('body-parser');
const jsonparser = bodyparser.json();

// We will use MongoDB Atlas type of database so that we can store our images. 
// The code below is taken from the MongoDB Atlas Cluster site.

const mongodb = require('mongodb')
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:admin@cluster0.ar4um.mongodb.net/Image_db?retryWrites=true&w=majority";
let client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

client.connect(err => {
  collection = client.db("Image_db").collection("Images");
  // perform actions on the collection object
});

app.use(express.json())
app.use(express.static('public'))
const imageDataURI= require('image-data-uri')

const insert_paint = async (name, date,img_url) => {
  const data = {
    name: name,
    date: date,
    img_url: img_url
  };
  const result = await collection.insertOne(data);
  console.log(`id: ${result.insertedId}`);
}

// Defining the bodyparser so that we don't have a problem with the data entity being too large.
bodyParser = {
  json: {limit: '50mb', extended: true},
  urlencoded: {limit: '50mb', extended: true}
};

app.post('/save', jsonparser, (req, res) => {
  insert_paint(req.body.name, req.body.date, req.body.img_url)
  const filename = (req.body.date+" "+req.body.name )
  filePath="Images/"+filename+".jpeg"
  imageDataURI.outputFile(req.body.img_url, filePath).then(res => console.log(res))

})

// Mapping our output page for the /images page where our images are displayed.
app.get('/images', jsonparser, async (req, res) => {

  const lines = await collection.find({}).toArray()
  let alldata = [];
  for (const line of lines) {
    data = {
      img_url: line.img_url,
      name: line.name,
      date: line.date,
      id: line._id
    }
    
    alldata.push(data)
  }
  res.send(
    alldata.map((data, index )=>
      `<div class='cont'>
        <div class='cont'>
          <p> The Artist : ${data.name} </p>
          <p> Date of Publication : ${data.date}</p>
          <button onclick="display_img()">Open Image</button>
        </div>
        <img id='${data.id}' src='${data.img_url}'/><br>
      </div>
      <script>
        function display_img(){
          windows = window.open()
          const draw = document.getElementById('${data.id}').src
          windows.document.write('<img src="'+draw+'"/>')
        }
      </script>
      <style>
        .cont{
          margin: 0 auto;
          border: solid black 4px;
        }
        *{
        text-align: center;
        font-family: "Arial", "arial", "cursive";
        }
      </style>
    `).join('')
  )
})

//I listen for socket connection
io.on('connect', (socket) => {
  //Once a user is connected I wait for him to send me figure on the event 'send_figure' or line with the event 'send_line'
  console.log('New connection')
  socket.on('send_figure', (figure_specs) => {
    //Here I received the figure specs, all I do is send back the specs to all other client with the event share figure
    socket.broadcast.emit('share_figure', figure_specs)
  })

  socket.on('send_line', (line_specs) => {
    //Here I received the line specs, all I do is send back the specs to all other client with the event share line
    socket.broadcast.emit('share_line', line_specs)
  })
})



http.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})