var expressSanitizer = require("express-sanitizer"),
bodyParser     = require("body-parser"),
methodOverride = require("method-override"),
mongoose       = require("mongoose"),
express        = require("express"),
app            = express();

var port = process.env.PORT || 6401;
app.listen(port, function() {
    console.log("App is running on port " + port);
});

//https://secure-woodland-34728.herokuapp.com/
//APP CONFIG
mongoose.connect('mongodb+srv://jeff:blogapppass@blog-fwl4z.mongodb.net/test?retryWrites=true&w=majority', 
	{useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true});
	

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());



//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

app.get("/", function(req, res){
	res.redirect("/blogs");
});
//index route
app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log("ERROR")
		} else {
			res.render("index", {blogs: blogs})
		}
	});
});

app.get("/blogs/new", function(req, res){
	res.render("new");
})

app.post("/blogs", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		} else {
			res.redirect("/blogs")
		}
	});
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("show", {blog: foundBlog});
		}
	});
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs")
		} else {
			res.render("edit", {blog: foundBlog})
		}
	});
});

//UPDATE ROUTE	
app.put("/blogs/:id", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);	
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs")
		} else {
			res.redirect("/blogs")
		}
	});
});




