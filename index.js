import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

// Set up Express
const app = express();
const port = 3000;

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// App variables
const posts = [
  {
    id: 1,
    title: "Sample Post Title",
    content: "This is a sample content for the post. It can include any information related to the topic of the post.",
    date: "07-30-2024"
  }
];
let postIdCounter = 2; // Initialize the counter to 2 since there's already a post with id 1

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Body parser usage
app.use(bodyParser.urlencoded({ extended: true }));

// Set "public" as the static folder
app.use(express.static(path.join(__dirname, 'public')));

// Route for the home page
app.get('/', (req, res) => {
  res.render('index', { posts: posts });
});

// Route to handle form submission (adding a post)
app.post('/submit', (req, res) => {
  const { title, content } = req.body;
  
  // Get today's date
  const now = new Date();
  const formattedDate = `${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}-${now.getFullYear()}`;

  const post = {
    id: postIdCounter++, // Assign current value and then increment
    title: title,
    content: content,
    date: formattedDate
  };

  posts.push(post);
  res.redirect('/');
});

// Route to render the edit form
app.get('/edit-post/:id', (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const post = posts.find(post => post.id === postId);

  if (post) {
    res.render('edit-post', { post: post });
  } else {
    res.status(404).send('Post not found');
  }
});

// Route to handle form submission for updating a post
app.post('/edit-post/:id', (req, res) => {
  const postId = parseInt(req.params.id, 10);
  const { title, content } = req.body;

  const postIndex = posts.findIndex(post => post.id === postId);

  if (postIndex !== -1) {
    posts[postIndex].title = title;
    posts[postIndex].content = content;
    // Optionally, update the date to the current date if you want to record the edit time
    // posts[postIndex].date = new Date().toLocaleDateString('en-US');
  }

  res.redirect('/');
});

// Route to handle post deletion
app.post('/delete-post', (req, res) => {
  const postId = parseInt(req.body.postId, 10);

  if (!isNaN(postId)) {
    const postIndex = posts.findIndex(post => post.id === postId);
    if (postIndex !== -1) {
      posts.splice(postIndex, 1); // Remove the post from the array
    }
  }

  res.redirect('/');
});

app.get("/new", (req, res) => {
    res.render("new-post.ejs");
})

app.get("/archive", (req, res) => {
    res.render("archive.ejs", {
        posts: posts
    })
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
