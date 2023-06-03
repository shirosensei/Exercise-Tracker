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
 },
 {
  versionKey: false
 }
 )
 
const User = mongoose.model("User", userSchema);

const exercisesSchema =  new Schema({
  description: String,
  duration: Number,
  date: {
    type: String, 
    default: Date
  },
  userId: String,
}, 
{
 versionKey: false
}
)
const Exercise = mongoose.model("Exercise", exercisesSchema)


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
app.post('/api/users/:_id/exercises',   (req, res) => {
  let { duration, description, date } = req.body;
  let userId = req.body[':_id'];

  if(!date) {
    date = new Date().toDateString();
   } else {
     date = new Date(date).toDateString();
   }
  
  User.findById(userId, (err, data) => {
      if(!err && data !== null) {

        let exercises = new Exercise({ description: description, duration: Number(duration),  date: date, _id: userId, })

        exercises.save((err, docs) => {
          if(!err) {

            const result = docs.map((doc) => {
              username: doc.userId;
              description: doc.description;
              duration: doc.duration;
              date: doc.date.toDateString();
              _id: doc.userId;
            })
            
            res.json(result);
          }     
        });

      } else {
        return res.json({ message: 'user not found' });
      }    
    });
  
  })
  
  
//   app.get('/api/users/:_id/exercises', (req, res) => {
//     const userId = req.params._id;

//     User.findById(userId, (err, data) => {
//       if(!err && data !== null) {
//         return res.send(data);
//         console.log(data)
//       } else {
//        return console.log(err)
//       }
//     })
// //    res.redirect('/api/users/' + userId + '/logs');
//   })

//make a GET request to /api/users/:_id/logs to retrieve a full exercise log of any user.
app.get('/api/users/:_id/logs', async (req, res) => {
  let { from, to, limit } = req.query;
  const userId = req.params._id;
  const foundUser = await User.findById(userId);
  if(!foundUser) {
  res.json({ message: 'User not found' });
    }
let filter = { userId };
let dateFilter = {};

    if(from) {
      dateFilter['$gte'] = new Date(from);
    }
  
    if(to) {
      dateFilter['$gte'] = new Date(to);
    }

    if(from || to) {
      filter.date = dateFilter;
    }
  
    if(!limit) {
      limit = 100;
    }

  let exercises = await Exercise.find(filter);
  exercises = exercises.map((exercise) => {
    return {
      description: exercise.description,
      duration: exercise.duration,
      date:  new Date(exercise.date).toDateString(),
    };
  });

  res.json({
    username: foundUser.username,
    count: exercises.length,
    _id: userId,
    log:  exercises
  });
})


const listener = app.listen(process.env.PORT || 3200, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
