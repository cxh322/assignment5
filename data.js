/*var nodemailer = require('nodemailer');

 var transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
     user: '111@gmail.com',
     pass: 'nimasile.1'
   }
 });

module.exports.getAllPack = ()=>{
    return new Promise((resolve, reject)=>{
        if (mealPackage.length == 0){
            reject({message:"Sorry there are no packages available"});
        }
        else
            resolve(mealPackage);
    });
};


module.exports.getAllMeal = ()=>{
    return new Promise((resolve, reject)=>{
        if (meal.length == 0){
            reject({message:"Sorry there are no meals available"});
        }
        else
            resolve(meal);
    });
};

module.exports.getMealByName = (mealName)=>{
    return new Promise((resolve, reject)=>{
        var filteredMeal = meal.filter(x=>x.name == mealName);
        if (filteredMeal.length == 0){
            reject({message:"Sorry there are no meals by that name"});
        }
        else
            resolve(filteredMeal);
    });
};


module.exports.validateLogin = (data)=>{
    return new Promise((resolve,reject)=>{
        validateEmailPass(data).then(()=>{
            resolve();
        }).catch((data)=>{
            reject(data);
        });

    });
}

module.exports.validateRegister = (data)=>{
    return new Promise((resolve,reject)=>{
        validateEmailPass(data).then(()=>{
            if(data.fname && data.lname && data.fname!="" && data.lname != ""){
                if (data.password == data.password1){
                    console.log("Correct Register");

                    
                     var mailOptions = {
                         from: '123@gmail.com',
                         to: `${data.email}`,
                         subject: 'Registering with the site',
                         text: 'Thank you for registering with Happy Food!'
                      };
                      
                       transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                          console.log(error);
                         } else {
                          console.log('Email sent: ' + info.response);
                        }
                      });
                    resolve();
                }
                else{
                    data.message = "Passwords don't match";
                    data.password = null;
                    data.password1 = null;
                    reject(data);
                }
            }
            else{
                data.message = "First name and Last name cannot be empty";
                data.fname = null;
                data.lname = null;
                reject(data);
            }
        }).catch((data)=>{
            reject(data);
        });
    });
}


validateEmailPass = function(data){
    return new Promise((resolve,reject)=>{
        var flag=true;
        let emailReg = /[^@]+@[^\.]+\..+/;
        let passReg = /^[0-9a-zA-Z@#$][0-9a-zA-Z@#$][0-9a-zA-Z@#$]+$/;
        if (!data.email||data.email ==""){
            flag = false;
            data.email = null;
            data.message ="Incorrect Email";
        }
        else if (!data.password||data.password==""){
            flag = false;
            data.password = null;
            data.message ="Incorrect Password";
        }
        else if (!passReg.test(data.password)){
            flag = false;
            data.password = null;
            data.message ="Password should be alpha numeric or !@#$";
        }
        else if (!emailReg.test(data.email)){
            flag = false;
            data.email = null;
            data.message ="Incorrect email format";
        }
        if (flag){
            resolve();
        }
        else{
            reject(data);
        }
    });
}



//Current static food data
var meal = [{
    img:"/spag.jpg",
    name:"Spaghetti",
    servings:2,
    price: 10.99
},{
    img:"/hamb.jpg",
    name:"Hamburger",
    servings:1,
    price: 5.99
},{
    img:"/raman.jpg",
    name:"Raman",
    servings:2,
    price: 10.99
},{
    img:"/sandwich.jpg",
    name:"Sandwich",
    servings:3,
    price: 7.99
},{
    img:"/sushi.jpg",
    name:"Sushi",
    servings:4,
    price: 20.99
},{
    img:"/fSalad.jpg",
    name:"Fruit Salad",
    servings:3,
    price: 15.99
},{
    img:"/cSalad.jpg",
    name:"Ceaser Salad",
    servings:1,
    price: 8.99
},{
    img:"/tacos.jpg",
    name:"Tacos",
    servings:6,
    price: 20.99
},{
    img:"/fajitas.jpg",
    name:"Fajitas",
    servings:5,
    price: 7.99
}
];

var mealPackage = [{
    name:"Mexican",
    numMealsInPackage:0,
    topMeal:true,
    img:"mex.jpg",
    meals:[{name:"Tacos"}, {name:"Fajitas"}]
},{
    name:"vegetarian",
    numMealsInPackage:2,
    topMeal:true,
    img:"veg.jpg",
    meals:[{name:"Ceaser Salad"},{name:"Fruit Salad"}]
},{
    name:"Italian",
    numMealsInPackage:0,
    topMeal: true,
    img:"ital.jpg",
    meals:[{name:"Spaghetti"}, {name:"Fajitas"}]
},{
    name:"American",
    numMealsInPackage:2,
    topMeal: false,
    img:"Amer.jpg",
    meals:[{name:"Hamburger"}, {name:"Sandwich"}]
},{
    name:"Japanese",
    numMealsInPackage:2,
    topMeal: true,
    img:"Japan.jpg",
    meals:[{name:"Sushi"}, {name:"Raman"}]
}];
*/