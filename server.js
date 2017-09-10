var express = require('express');
var app = express();

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/quoting_dojo');
var QuoteSchema = new mongoose.Schema({
    author: {type: String, required: true, minlength: 2, maxlength: 256},
    text: {type: String, required: true, minlength: 2, maxlength: 256}
}, {timestamps: true});
mongoose.model('Quote', QuoteSchema);
var Quote = mongoose.model('Quote');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

var path = require('path');
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('index', {prefill: {author: '', text: ''}});
});

app.get('/quotes', function(req, res) {
    Quote.find({}).sort('-createdAt').exec(function(err, quotes){
        res.render('users', {quotes: quotes});
    });
});

app.post('/quotes', function(req, res) {
    console.log("POST DATA", req.body);
    var quote = new Quote({author: req.body.author, text: req.body.text});
    quote.save(function(err) {
        if (err) {
            res.render('index', {errors: quote.errors, prefill: {author: req.body.author, text: req.body.text}});
        } else {
            res.redirect('/quotes');
        }
    });
});

app.listen(8000, function() {
    console.log("listening on port 8000");
});