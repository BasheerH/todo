const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const passport = require("passport")
const LocalStrategy = require("passport-local")
const methodOverride = require("method-override")
const passportLocalMongoose = require("passport-local-mongoose")


app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"));

mongoose.connect('mongodb://localhost:27017/todo1', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.set('view engine','ejs')
app.use(require("express-session")({
    secret:"inee warda beda ",
    resave:false,
    saveUninitialized: false  
}))


var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    todos:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Todo"
    }]
})
userSchema.plugin(passportLocalMongoose)
var User = mongoose.model('User', userSchema)

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride("_method"));
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use(express.static(__dirname + '/ressources'));


var todoSchema = new mongoose.Schema({
    name: String,
    createdAt:{type: Date, default:Date.now()},
    line:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Line"
    }]
})
 var Todo = mongoose.model('Todo',todoSchema)


var lineSchema = new mongoose.Schema([{
    text: String
}])
var Line = mongoose.model('Line',lineSchema)


app.use(function (req, res,next){
    res.locals.currentUser = req.user
    next()
})



//============ROUTE===============================

app.get("/todo",isLoggedIn,(req, res)=>{
    User.findById(req.user._id).populate('todos').exec((err,user)=>{
        if (err){
            console.log(err)
        }else{
            // console.log( "user id "+req.user._id)
            res.render("index",{user: user})
        }
    })
})
app.get("/",isLoggedIn,(req, res)=>{
    res.redirect("/todo")
})
// index page
app.get("/todo/new",isLoggedIn,(req, res)=>{
    res.render("new")
})
//post todo
app.post("/todo",isLoggedIn,(req, res)=>{
    User.findById(req.user._id,(err, user)=>{
        if (err){
            console.log(err)
        }else{
            Todo.create({
                name: req.body.name
            },(err, todo)=>{
                if (err){
                    console.log(err)
                }else{
                    console.log(user.username)
                    user.todos.push(todo)
                    user.save()
                    console.log("todo push inside the user and saved")
                    res.redirect('/todo')
                }
            })
        }
    })  
})
// show page
app.get("/todo/:id",isLoggedIn,(req, res)=>{
    Todo.findById(req.params.id).populate('line').exec((err,foundTodo)=>{
        if(err){
            console.log(err)
        }else{
            res.render("show",{todo:foundTodo})
        }
    })
})
// post line in todo list
app.post("/todo/:id/line",isLoggedIn,(req, res)=>{
    Todo.findById(req.params.id, (err,todo)=>{
        if (err){
            console.log(err)
        }else{
            // console.log(typeof(req.body.line))
            var item = new Line({text:req.body.line})
            console.log(typeof(item))
            Line.create(item,(err, line)=>{
                if (err){
                    console.log(err)
                }else{
                    todo.line.push(line)
                    todo.save()
                    res.redirect('/todo/'+todo._id)
                }
            })
            console.log("added new line")
        }

    })
})
// ============auth routes
//register
app.get("/register",(req, res)=>{
    res.render('register')
})

app.post("/register",(req, res)=>{
    User.register(new User({username:req.body.username}),req.body.password,(err, user)=>{
    if (err){
        console.log(err)
        return res.render('register')
    }
    passport.authenticate("local")(req, res,function(){
        console.log('new user created')
        res.redirect("/todo")
    })

    })
})

//login
app.get("/login",(req,res)=>{
    res.render('login')
})

app.post("/login",passport.authenticate('local',{
    successRedirect:"/todo",
    failureRedirect:"/login"
}),(req, res)=>{

})

// logout
app.get("/logout",(req, res)=>{
    req.logout()
    res.redirect("/login")
})


//delete todo
app.delete('/todo/:id',isLoggedIn,(req, res)=>{
    Todo.findByIdAndRemove(req.params.id,(err,removedTodo)=>{
        if (err){
            console.log(err)
        }
        Line.deleteMany({
            _id:{$in: removedTodo.line}
        },(err)=>{
            if (err){console.log(err)}

            res.redirect("/todo")
        })
    })
})
// delete line in todo
app.delete("/todo/:id/line/:line_id",(req, res)=>{
    Line.findByIdAndRemove(req.params.line_id,(err)=>{
        if (err){
            console.log(err)
        }
        res.redirect("/todo/"+req.params.id)
    })
    // res.send("delete the line")
})

function isLoggedIn(req, res,next){
    if (req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

app.listen(3000, function (){
    console.log("server up and runing!!")
})

