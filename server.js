/*
https://floating-hamlet-06670.herokuapp.com/ 

https://github.com/cxh322/assignment4


*/
const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const app = express();
const db= require("./db.js");
const clientSessions = require("client-sessions");
const multer = require("multer");
const fs = require("fs");
const cart = require("./cart.js");



const HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
  }

const storage = multer.diskStorage({
  destination: "./public/photos",
  filename: function (req, file, cb) {
    // we write the filename as the current date down to the millisecond
    // in a large web service this would possibly cause a problem if two people
    // uploaded an image at the exact same time. A better way would be to use GUID's for filenames.
    // this is a simple example.
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    return cb(null, true);
  } else {
    return cb(new Error('Not an image! Please upload an image.', 400), false);
  }
};
// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storage, fileFilter: imageFilter });


app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", "./views");

app.set("view engine", ".hbs"); 
app.use(express.static('public'));

app.engine('.hbs', exphbs({ 
    extname: '.hbs',
    defaultLayout: "main",
    helpers: { 
        navLink: function(url, options){
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        }
    } 
}));



// default route
app.get("/",(req,res)=>{
    db.getMeals().then((meals)=>{
            res.render("home",{title: "Home", meals: meals});
        }).catch((err)=>{
        res.render("home");
    });
});


//login route
app.use(clientSessions({
    cookieName: "session", 
    secret: "assignment3", 
    duration: 2 * 60 * 1000, 
    activeDuration: 1000 * 60 
  }));
  app.use(bodyParser.urlencoded({ extended: true}));
  
  app.get("/register", (req,res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    db.registerUser(req.body).then(() => {
        res.redirect("/login");
    }).catch((message) => {
      console.log(message);
        res.render("register",{data: req.body});
    })
})

app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
 }); 
function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } 
  else {
    next();
  }
}
function ensureAdmin(req, res, next) {
  if(!req.session.user){
    res.redirect("/login");
  }
  else if (!req.session.user || req.session.data.role!="admin") {
    res.redirect("/login");
  } else {
    next();
  }
}

app.get("/login", (req,res) => {
    res.render("login");
});
app.post("/login",(req,res) => {
    
    if(req.body.email === "" || req.body.password === "") {
        return res.render("login", { errorMsg: "Missing Email Address or Password." });
      }
      else{
      db.validateUser(req.body).then((user)=>{
        req.session.user = {
          email: user.email,
          password: user.password,
          lname: user.lname,
          fname: user.fname,
          role: user.role
          }
       res.render("dashboard",{user: req.body});
      })
      .catch((err)=>{
        console.log(err);
        res.redirect("login",{user:data});
      })
    }  
})

app.get("/meals",(req,res)=>{
  if (req.query.price){
    db.getMealByPrice(req.query.price).then((meals)=>{
      req.query.meals= {
        price: meals.price,
        name: meals.name,
        img: meals.img,
        mealDescription: meals.mealDescription
        }
      res.render("meals",{meals: (data.length!=0)?data:undefined});
    }).catch((err)=>{
      res.render("meals"); 
    });
  }
  else{
  db.getMeals().then((data)=>{
    res.render("meals",{meals: (data.length!=0)?data:undefined});
  }).catch((err)=>{
    res.render("meals"); 
  });
  }
});

app.get("/meals/add", (req,res)=>{
  res.render("addmeal");
});


app.post("/meals/add", upload.single("photo"), (req, res)=>{
  req.body.img = req.file.filename;
  
  db.addMeal(req.body).then(()=>{
    res.redirect("/");
  }).catch((errorMsg)=>{
    console.log("Error adding meals: "+ errorMsg);
    res.redirect("/"); 
  }); 
});


app.get("/edit",(req,res)=>{
  if (req.query.price){ 
    db.getMealByPrice(req.query.price).then((meals)=>{
      res.render("EditMeal", {data:meals[0]}); 
    }).catch(()=>{
      console.log("couldn't find the meal");
      res.redirect("/");
    });
  }
  else
    res.redirect("/meals");
});

app.post("/meals/edit",(req,res)=>{
    db.editMeals(req.body).then(()=>{
      res.redirect("/meals");
    }).catch((err)=>{
      console.log(err);
      res.redirect("/meals");
    })
});


app.get("/delete",(req,res)=>{
  if(req.query.price){
    db.deleteMealsByPrice(req.query.price);     
    res.redirect("/meals");                   
  }
  else{
    console.log("No Query");
    res.redirect("/meals");
  }
});

app.get("/logout", (req, res) =>{
    req.session.reset();
    res.redirect("login");
})


app.get("/product", (req, res)=>{
  db.getMeals().then(meals=>{
      res.render("product", {data: meals, layout: false});
  }).catch(()=>{
      res.send("Error");
  })
});


app.post("/addProduct", (req,res)=>{
  console.log("Adding prod with name: "+req.body.name);
  db.getMeals(req.body.name)
  .then((item)=>{
      cart.addItem(item).then((numItems)=>{
          res.json({data: numItems});
      }).catch(()=>{
          res.json({message:"error adding"});
      })
  }).catch(()=>{
      res.json({message: "No Items found"})
  })
});


app.get("/cart",(req,res)=>{
  var cartData = {
      cart:[],
      total:0
  } ;
  cart.getCart().then((items)=>{
      cartData.cart = items;
      cart.checkout().then((total)=>{
          cartData.total = total;
          res.render("checkout", {data:cartData, layout:false});
      }).catch((err)=>{
          res.send("There was an error getting total: " +err);
      });
  })
  .catch((err)=>{
      res.send("There was an error: " + err );
  });
});

app.post("/removeItem", (req,res)=>{ 
  var cartData = {
      cart:[],
      total:0
  } ;
  cart.removeItem(req.body.name).then(cart.checkout)
  .then((inTotal)=>{
      cartData.total = inTotal;
      cart.getCart().then((items)=>{
         cartData.cart = items; 
         res.json({data: cartData});
      }).catch((err)=>{res.json({error:err});});
  }).catch((err)=>{
      res.json({error:err});
  })
});

app.use((req,res)=>{
    res.status(404).send("Nothing to see here, move along");
});


db.initialize().then(()=>{
    console.log("Data read successfully");
    app.listen(HTTP_PORT, onHttpStart);
})
.catch((data)=>{
    console.log(data)
})

