import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";

//be able to get the directory path
import path from "path";
import { fileURLToPath } from "url";

//Set up Express
const app = express();
const port = 3000;

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//app variables
const posts = [  {
    id: 1,
    title: "Sample Post",
    content: "This is a sample post content to test the display functionality.",
    time: "12:34"
  }
];
let number = 0;

//set ejs as the render engine
app.set('view engine', 'ejs');

//body parser usage
app.use(bodyParser.urlencoded({ extended: true }));

//set "public" as the static folder
app.use(express.static(__dirname + '/public'));

// Route for the home page
app.get('/', (req, res) => {
    res.render('index', { 
        posts: posts 
    });
  });
  

app.get('/new', (req, res) => {
    res.render('new-post.ejs');
})

app.get('/archive', (req, res) => {
    res.render('archive.ejs');
})

app.post('/submit', (req, res) => {
    //get the time of day
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    
    // Extract data from the request body, create a new object with it, and send that object to the array
    const { title, content } = req.body;
    const post = {
        id: number,
        title: title,
        content: content,
        time: formattedTime
    };

    posts.push(post);
    number++;

    //re-render the home page with posts
    res.render ('index.ejs', {
        posts: posts
    });
})


// Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});