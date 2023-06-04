const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Schema } = mongoose;

//Connect to Mongodb DB
mongoose.connect(process.env.MONGO_URI,  { useNewUrlParser: true, useUnifiedTopology: true }) 
.then(() => console.log("Database connected!"))
.catch(err => console.log(err));


app.use(cors())
app.use(bodyParser.urlencoded({ extended:true }))
app.use(bodyParser.json())

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const userSchema = new Schema(
  {
   username: {
     type: String,
     unique: true,
   }, 
   count: {
    type: Number,
    default: 0
   }, 
   logs: [{
    description: String,
    duration: Number,
    date: String,
   }]
 },
 {
  versionKey: false
 }
 )
 
const User = mongoose.model("User", userSchema);

app.use(express.json());

//GET request to /api/users
app.get('/api/users', async (req, res) => {
  const users = await User.find()
 return res.send(users)
})

// POST to /api/users with form data username to create a new user.
app.post('/api/users', async (req, res) => {
  const username = req.body.username
  const foundUser = await User.findOne({ username });

  if(!username) {
    
    redirect('/')
  }
   
if(foundUser) {
    res.json(foundUser)
  }

  const user = await User.create({
    username,
  })
  
 return res.json(user)
 
})

//POST to /api/users/:_id/exercises with form data description, duration, and optionally date.
app.post('/api/users/:_id/exercises', async  (req, res) => {
  let { _id } = req.params;
  let { duration, description, date } = req.body;
  console.log({ date })

 

    try {
      const user = await User.findById(_id);
    
      if(!date || typeof date === 'undefined'){
        date = new Date();
      } else {
        date = new Date(date);
      }

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
        
      let exercise = {
        description: description,
        duration: Number(duration),
        date: date,
      };
  
      user.logs.push(exercise);
      user.count += 1;
      await user.save();
      console.log(exercise);

     
const logsWithoutId = user.logs.map(log => {
  const { _id, ...rest } = log;
  return rest;
});

const logObject = {
  username: user.username,
  description: exercise.description,
  duration: exercise.duration,
  date: new Date(exercise.date).toDateString(),
  _id: user._id.toString()
};

return res.json({
  ...logObject,
  logs: logsWithoutId
});
   
    } catch (error) {
     return console.error(error);
    }
})

  
  

//make a GET request to /api/users/:_id/logs to retrieve a full exercise log of any user.
app.get('/api/users/:_id/logs', async (req, res) => {
  const { from, to, limit } = req.query;
  const { _id } = req.params;

    try {
      const user = await User.findById(_id);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      let logArray = user.logs.map(log => ({
        description: log.description,
        duration: log.duration,
        date: new Date(log.date).toDateString(),
      }));
  
      if(from) {
        const fromDate = new Date(from);
        logArray = logArray.filter(log => new Date(log.date) >= fromDate)
      }
      
      if(to) {
        const toDate = new Date(to);
        logArray = logArray.filter(log => new Date(log.date) <= toDate)
        }

        if(limit) {
          logArray = logArray.slice(0, limit)
          }

       const responseObject = {
        username: user.username,
        count: user.count,
        _id: user._id.toString(),
        log: logArray,
      };
  
      return res.json(responseObject);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
})


const listener = app.listen(process.env.PORT || 3200, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
