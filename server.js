var express = require('express');
var	bodyParser = require('body-parser');
var app = express();
var port = 3000;
var MongoClient = require('mongodb').MongoClient;
var mongojs = require('mongojs');
var db;
var path = require('path');
var password = require('./password.js');

console.log(password);

// process.env.PASSWORD = password;

// console.log(process.env)

MongoClient.connect('mongodb://'+password+'@ds119688.mlab.com:19688/product-catalog', (err, database) => {
  if (err) return console.log(err)
  	// console.log(database) 
  db = database.db('product-catalog');
  myDb = db.collection('products');
  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on 3000')
  })
})


app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static('Users/kevinhuelsmann/code/products' + '/styles'))
app.use(bodyParser.json())
// app.use(express.static("scripts"));
// app.use(express.static("styles"));
// app.use(express.static(path.join(__dirname, 'styles')));
// app.use('/static', express.static(path.join('Users/kevinhuelsmann/code/products' + '/styles')))

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  // db.collection('products').find().toArray((err, result) => {
    // if (err) return console.log(err)
    // renders index.ejs
    res.render('index.ejs')
    // res.send(password);
  // })
})

app.get('/api', (req, res) => {
  myDb.find().toArray((err, doc) => {
    if (err) return console.log(err)
    // renders index.ejs
    // res.render('products.ejs', {products: result})
    res.json(doc);
  })
})

app.get('/api/products', (req, res) => {
  myDb.find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('products.ejs', {products: result})
  })
})

app.get('/api/products/:id', function(req, res){
	// res.send('list  product ' + req.params.id);
	myDb.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, result){
	// myDb.findOne({_id: mongojs.ObjectId(req.params.id)}, 
		// function(err, doc){
		// function(err, result){
		if(err){
			res.send(err);
		}
		// console.log('Products found');
		res.render('product.ejs', {product: result})
		// console.log(doc);
		// res.json(doc);
	});
});

app.post('/api/products', (req, res) => {
  myDb.save(req.body, (err, result) => {
  // myDb.insert(req.body, (err, doc) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/api/products')
    // res.json(doc);
  })
})

app.put('/api/products/:id', (req,res,next) => {
	
	myDb.findAndModify({query: {_id: mongojs.ObjectId(req.params.id)}, 
		update: {
		$set: {
			name: req.body.name,
			description: req.body.description,
			price: req.body.price,
			image: req.body.image
		}
	},
		new: true, }, 
		function (err, doc){
			if(err){
				res.send(err);
			}
			console.log('updating product');
			res.json(doc);
			// console.log('saved to database')
    		// res.redirect('/api/products')
		})
});

// app.put('/api/products/:id', (req, res) => {
//   myDb.findOneAndUpdate({query: {_id: mongojs.ObjectId(req.params.id)},
//     update: {
//     	$set: {
//       name: req.body.name,
// 			description: req.body.description,
// 			image: req.body.image
//   		}},
// 		new: true }, (err, doc) => {
// 			if(err){
// 				res.send(err);
// 			}
// 			console.log('updating product');
// 			res.json(doc);
// 		})
// });

app.delete('/api/products/:id', function(req,res,next){
	myDb.remove({_id: mongojs.ObjectId(req.params.id)}, (err, doc) => {
		if(err){
				res.send(err);
			}
			console.log('deleting product');
			res.redirect('/api/products')
		})
});



