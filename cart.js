var userCart = [];

module.exports.addItem = (item)=>{
    console.log("Adding cart" + item.name);
    return new Promise((resolve,reject)=>{
        userCart.push(item);
        resolve(userCart.length);
    });
}

module.exports.removeItem = (item)=>{
    return new Promise((resolve,reject)=>{
        for(var i = 0; i< userCart.length; i++){
            if(userCart[i].name == item){
                userCart.splice(i,1);
                i = userCart.length;
            }
        }
        resolve();
    });
}

module.exports.getCart = ()=>{
    return new Promise((resolve, reject)=>{
            resolve(userCart);
    });
}

module.exports.checkout = ()=>{
    return new Promise((resolve, reject)=>{
        var price=0;
        if(userCart){
            userCart.forEach(x => {
                price += x.price;
            });
        }
        resolve(price);
    });
}