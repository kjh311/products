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

MongoClient.connect('mongodb://'+password+'@ds119688.mlab.com:19688/product-catalog', (err, database) => {
  if (err) return console.log(err)
  	// console.log(database) 
  db = database.db('product-catalog');
  db.collection('products');
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
  // })
})

app.get('/api', (req, res) => {
  db.collection('products').find().toArray((err, doc) => {
    if (err) return console.log(err)
    // renders index.ejs
    // res.render('products.ejs', {products: result})
    res.json(doc);
  })
})

app.get('/api/products', (req, res) => {
  db.collection('products').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('products.ejs', {products: result})
  })
})

app.get('/api/products/:id', function(req, res){
	// res.send('list  product ' + req.params.id);
	db.collection('products').findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, result){
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
  db.collection('products').save(req.body, (err, result) => {
  // db.collection('products').insert(req.body, (err, doc) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/api/products')
    // res.json(doc);
  })
})

app.put('/api/products/:id', (req,res) => {
	
	db.collection('products').findAndModify({query: {_id: mongojs.ObjectId(req.params.id)}, 
		update: {
		$set: {
			name: req.body.name,
			description: req.body.description,
			image: req.body.image
		}},
		new: true }, (err, doc) => {
			if(err){
				res.send(err);
			}
			console.log('updating product');
			res.json(doc);
		})
});

// app.put('/api/products/:id', (req, res) => {
//   db.collection('products').findOneAndUpdate({query: {_id: mongojs.ObjectId(req.params.id)},
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
	db.collection('products').remove({_id: mongojs.ObjectId(req.params.id)}, (err, doc) => {
		if(err){
				res.send(err);
			}
			console.log('deleting product');
			res.redirect('/api/products')
		})
});



