var express = require('express')
var bodyParser=require('body-parser')
var app = express()
const router = require('express').Router();

//const router = require('express').Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const connection = (closure) => {
  return MongoClient.connect('mongodb://localhost:27017/DATAbduser', (err, client) => {
      if (err) return console.log(err);
      let db = client.db('DATAbduser');
      closure(db);
  })
} 

router.get('/aa', function (req, res) {
    console.log(req);
   res.sendFile(__dirname+'/index.html')
    // res.send('Hello World')
})


router.get('/a', (req, res)=> {
    res.send('this is home')
  })
 
  router.post("/",(req, res)=> {
  
  
    console.log(req.body);
    res.send(req.body);
    
  })

  router.get('/api/users', (req, res) => {
    connection( db=>{
        db.collection('users').find().toArray().then(result=>{
            res.send(result);
        })
    })
 })
 
 router.post('/users', (req, res) => {
  connection( db=>{
      db.collection('users').insert(req.body,(err,result)=>{
          res.send(result);
      })
  })
})

router.get('/users/:id', (req, res) => {

  connection( db=>{
    db.collection('users').findOne({_id:ObjectID(req.params.id)},(err,result)=>{
      res.send(result);
    
  })
})
})

router.get('/users/todos/:id', (req, res) => {

  connection( db=>{
    db.collection('users').findOne({_id:ObjectID(req.params.id)},(err,result)=>{
      res.send(result.todos);
    
  })
})
})
router.post('/users/todos/:id',(req,res)=>{
  let qry = {_id:ObjectID(req.params.id)};
  connection(db=>{
      db.collection('users').update(qry,{$push:{todos:req.body}}).then(result=>{
         
          res.send(result);
      })
  })
})
router.get('/users/todos/:id/:iTodo',(req,res)=>{
    let qry = {_id:ObjectID(req.params.id)};
    connection(db=>{
        db.collection('users').findOne(qry).then(result=>{
           
          
            res.send(result.todos[req.params.iTodo]);
        })
    })
})

module.exports = router;

