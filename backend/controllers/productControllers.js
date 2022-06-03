const Product = require('../models/Product');

module.exports.get_products = (req,res) => {
    page = req.query.page?req.query.page:1
    Product.find().sort({quantity:-1}).limit(page*12).then(product => res.json(product));
}

module.exports.get_outOfStock_products = (req,res) => {
    Product.find({quantity : 0}).then(product => res.json(product));
}

module.exports.get_product = (req,res) => {
    page = req.query.page?req.query.page:1
    Product.find({"Product_name" : { $regex: '.' + req.params.Product_name + '.',$options : 'i' }}).limit(page*12).then(product => res.json(product));
}

module.exports.post_product = async (req,res) => {
    // console.log(req.body)
    const newProduct = new Product({
        Product_name: req.body.Product_name,
        Price: req.body.Price,
        weight: req.body.weight,
        description: req.body.description,
        quantity: req.body.quantity
    });
    try {
        const newProducts2 =  await newProduct.save()
        // console.log("hhhhh")
        // console.log(newProducts2)
    }catch(err){
        // console.log(err)
        var product = await Product.findOne({Product_name:newProduct.Product_name})
        // console.log(product)
        product.quantity+=newProduct.quantity
        await product.save()
    }
    res.status(201).json(product);
}

module.exports.update_product = async (req,res) => {
    await Product.findByIdAndUpdate({_id: req.params.id},req.body).then(function(product){
        Product.findOne({_id: req.params.id}).then(function(product){
            res.json(product);
        });
    });
}
module.exports.delete_product = async (req,res) => {
    await Product.findByIdAndDelete({_id: req.params.id}).then(function(product){
        res.json({success: true});
    });
}