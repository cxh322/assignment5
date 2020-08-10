var Cart = [];

module.exports.addItem = (item)=>{
    console.log("Adding cart" + item.name);
    return new Promise((resolve,reject)=>{
        Cart.push(item);
        resolve(Cart.length);
    });
}

module.exports.removeItem = (item)=>{
    return new Promise((resolve,reject)=>{
        for(var i = 0; i< Cart.length; i++){
            if(Cart[i].name == item){
                Cart.splice(i,1);
                i = Cart.length;
            }
        }
        resolve();
    });
}

module.exports.getCart = ()=>{
    return new Promise((resolve, reject)=>{
            resolve(Cart);
    });
}

module.exports.checkout = ()=>{
    return new Promise((resolve, reject)=>{
        var price=0;
        if(Cart){
            Cart.forEach(x => {
                price += x.price;
            });
        }
        resolve(price);
    });
}