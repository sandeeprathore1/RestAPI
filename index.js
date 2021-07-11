const express=require('express');
const mongoose= require('mongoose');
const bodyparser=require('body-parser');
const cookieParser=require('cookie-parser');
const db=require('./config/config').get(process.env.NODE_ENV);
const User=require('./models/user');
const Child=require('./models/child');
const State=require('./models/state');
const District=require('./models/district');

const {auth} =require('./middlewares/auth');

const app=express();
// app use
app.use(bodyparser.urlencoded({extended : false}));
app.use(bodyparser.json());
app.use(cookieParser());

// database connection
mongoose.Promise=global.Promise;
mongoose.connect(db.DATABASE,{ useNewUrlParser: true,useUnifiedTopology:true },function(err){
    if(err) console.log(err);
    console.log("database is connected");
});


app.get('/',function(req,res){
    res.status(200).send(`Welcome to Dhwani Rural Information System `);
});

// listening port
const PORT=process.env.PORT||3000;
app.listen(PORT,()=>{
    console.log(`app is live at ${PORT}`);
});


// adding new user (sign-up route)
app.post('/api/register',function(req,res){
   // taking a user
   const newuser=new User(req.body);

  if(newuser.password!=newuser.confirmPassword)return res.status(400).json({message: "password not match"});

   User.findOne({email:newuser.email},function(err,user){
       if(user) return res.status(400).json({ auth : false, message :"email exits"});

       newuser.save((err,doc)=>{
           if(err) {console.log(err);
               return res.status(400).json({ success : false});}
           res.status(200).json({
               succes:true,
               user : doc
           });
       });
   });
});

// create and save a new state
app.post('/api/state/register',function(req,res){

    if(!req.body.state ) {
        return res.status(400).send({
            message: "This field is required"
        });
    }

    const newstate=State({
        state: req.body.state
    });

        newstate.save(function(err,doc){
            if(err) return res.status(400).json(err);
            res.status(201).json({
                post : true,
                state : doc
            });
        });
    });

    // find a state by id
    app.get('/api/findstate/:Id',function(req,res){
        State.findById(req.params.Id,function(err,doc){
            if(err) return res.status(400).send(err);
            if(!doc) return res.status(404).json({message : "State with given Id is not found"});
            res.status(200).json(doc);
        })
});


    // create and save a new district
    app.post('/api/district/register',function(req,res){

        if(!req.body.district) {
            return res.status(400).send({
                message: "This field is required"
            });
        }

        const newdistrict=District({
            district:req.body.district
        });

            newdistrict.save(function(err,doc){
                if(err) return res.status(400).json(err);
                res.status(201).json({
                    post : true,
                    district : doc
                });
            });
        });

        // find a district by id
        app.get('/api/finddistrict/:Id',function(req,res){
            District.findById(req.params.Id,function(err,doc){
                if(err) return res.status(400).send(err);
                if(!doc) return res.status(404).json({message : "district with given Id is not found"});
                res.status(200).json(doc);
            })
 });


   // create and save a new child
   app.post('/api/child/register',function(req,res){

       if(!req.body.name||!req.body.sex||!req.body.dob|| !req.body.fathersName||!req.body.mothersName||!req.body.state ||
       !req.body.district) {
           return res.status(400).send({
               message: "Every field is required"
           });
       }

       const newchild=Child({
           name: req.body.name,
           sex: req.body.sex,
           dob: req.body.dob,
           fathersName: req.body.fathersName,
           mothersName: req.body.mothersName,
           state: req.body.state,
           district:req.body.district
       });

           newchild.save(function(err,doc){
               if(err) return res.status(400).json(err);
               res.status(201).json({
                   post : true,
                   child : doc
               });
           });
       });

       // find a child by id
       app.get('/api/findchild/:Id',function(req,res){
           Child.findById(req.params.Id,function(err,doc){
               if(err) return res.status(400).send(err);
               if(!doc) return res.status(404).json({message : "Child with given Id is not found"});
               res.status(200).json(doc);
           })
});


// login user
app.post('/api/login', function(req,res){
    let token=req.cookies.auth;
    User.findByToken(token,(err,user)=>{
        if(err) return  res(err);
        if(user) return res.status(400).json({
            error :true,
            message:"You are already logged in"
        });

        else{
            User.findOne({'email':req.body.email},function(err,user){
                if(!user) return res.json({isAuth : false, message : ' Auth failed ,email not found'});

                user.comparepassword(req.body.password,(err,isMatch)=>{
                    if(!isMatch) return res.json({ isAuth : false,message : "password doesn't match"});

                user.generateToken((err,user)=>{
                    if(err) return res.status(400).send(err);
                    res.cookie('auth',user.token).json({
                        isAuth : true,
                        id : user._id
                        ,email : user.email
                    });
                });
            });
          });
        }
    });
});

// get logged in user
app.get('/api/profile',auth,function(req,res){
        res.json({
            isAuth: true,
            id: req.user._id,
            email: req.user.email,
            name: req.user.name

        })
})

//logout user
 app.get('/api/logout',auth,function(req,res){
        req.user.deleteToken(req.token,(err,user)=>{
            if(err) return res.status(400).send(err);
            res.sendStatus(200);
        });

    });
