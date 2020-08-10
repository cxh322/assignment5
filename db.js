/*
https://floating-hamlet-06670.herokuapp.com/ 

https://github.com/cxh322/assignment4


*/

const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

let customerSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    password: String,
    fname: String,
    lname: String
});

let mealSchema = new Schema({
    price: {
        type: Number,
        unique: true
    },
    name: String,
    img: String,
    mealDescription: String,
    topSale: Boolean
});

let customers;
let meals;

module.exports.initialize =() =>{
    return new Promise( (resolve, reject)=> {
    let db = mongoose.createConnection("mongodb+srv://WEB322:nimasile@cluster0-hd4jp.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true });
    db.on('error', (err)=>{
    reject(err);
    });

    db.once('open', ()=>{

    customers = db.model("customers", customerSchema);
    meals = db.model("meals", mealSchema);
    resolve();
    });
    });
   }; 

module.exports.registerUser = (inData)=>{
    return new Promise( (resolve, reject)=> {
        if(inData.password != inData.password1){
            console.log("Passwords do not match");
        }
        else{
            bcrypt.genSalt(10, (err, salt) =>{ 
            bcrypt.hash(inData.password, salt, (err, hash)=> { 
                if(err){
                  console.log("There was an error encrypting the password")
                }
        else {
            inData.password = hash;
            let newcustomer = new customers(inData);
            newcustomer.save(() => {
            if(err){
                console.log("err: "+err);
                reject();    
            }
        else{
            resolve(inData);
        }
    })}
})
})}     
})}
module.exports.validateUser = (data) =>{
    return new Promise( (resolve, reject)=> {
        customers.find({
            email: data.email
        }).exec()
            .then((customer) => {
                if(!data){
                    reject();
                    data.message ="Incorrect Password";
                }
                else{
                    bcrypt.compare(data.password, customer[0].password).then((res) => {
                        if(res===true){
                            customers.update(
                                { email: customer[0].email },
                                { $set: {login: true }},
                            ).exec()
                            .then((() => {
                                resolve(customer[0]);
                            })).catch((err) => {
                                console.log("Incorrect user: " + err)
                            })} 
                            else
                            console.log("Incorrect Password for user: "+data.email)
                    })}
            }).catch(() => {
                console.log("Cannot find user: "+data.email)
        })
    })
}


module.exports.addMeal = function(data){
    return new Promise((resolve, reject)=> {
        data.topSale = (data.topSale)? true: false;
        
        for (var formEntry in data){
            if(data[formEntry] == "")
            data[formEntry = null];
        }
        var newmeals = new meals(data)
        
        newmeals.save((err)=>{
            if(err){
                console.log("err: "+err);
                reject();              
            }
            else{
                console.log("Saved: "+data.name);
                resolve();    
            }
        })
    })
}

module.exports.getMeals = function(){
    return new Promise((resolve,reject)=>{
        meals.find() 
        .exec() 
        .then((returnedMeals)=>{
            resolve(returnedMeals.map(item=>item.toObject()));
        }).catch((err)=>{
                console.log("Error Retriving Meals:"+err);
                reject(err);
        });
    });
}

module.exports.getMealByPrice = function(inPrice){
    return new Promise((resolve,reject)=>{
        meals.find({price: inPrice}) 
        .exec() 
        .then((returnedMeals)=>{
            if(returnedMeals.length !=0 ) 
                resolve(returnedMeals.map(item=>item.toObject()));
            else
                reject("No Meals found");
        }).catch((err)=>{
                console.log("Error Retriving Meals:"+err);
                reject(err);
        });
    });
}

module.exports.editMeals = (editData)=>{
    return new Promise((resolve, reject)=>{
        editData.topSale = (editData.topSale)? true: false;
        
            meals.updateOne(
            {price : editData.price}, 
            {$set: {  
                name: editData.name,
                topSale: editData.topSale,
                mealDescription: editData.mealDescription
            }})
            .exec() 
            .then(()=>{
                console.log(`Meal ${editData.name} has been updated`);
                resolve();
            }).catch((err)=>{
                reject(err);
            });
        }).catch(()=>{
            reject("error");
        });
    
}


module.exports.deleteMealsByPrice = (inPrice)=>{
       
    setTimeout(function(){
        meals.deleteOne({price: inPrice})
        .exec()  
        .then(()=>{              
        }).catch(()=>{              
        });
    },2000);
}

module.exports.getSystem = ()=>{
    return new Promise((resolve,reject)=>{
        if (meals.length > 0){
            resolve(meals);
        }
        else reject();
    });
}

