import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");

let postToView = [];
let id = 0;

console.log(postToView);

app.get("/sign-in", (req, res) => {
  res.render("signin.ejs");
});

app.get("/", (req, res) => {
  res.render("index", { posts: postToView });
});

app.post("/post-submit", (req, res) => {
  function getFormattedDateTime() {
    const now = new Date();

    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(now.getDate()).padStart(2, "0");
    const year = now.getFullYear();

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // If hours is 0, set it to 12
    const formattedHours = String(hours).padStart(2, "0");

    return `${month}/${day}/${year} at ${formattedHours}:${minutes} ${ampm}`;
  }

  postToView.push({
    title: req.body.title,
    author: req.body.author,
    time: getFormattedDateTime(),
    post: req.body.post,
    id: id,
  });

  id++;

  res.redirect("/");
});

app.post("/edit", (req, res) => {
  let postToChange = {};

  for (let index = 0; index < postToView.length; index++) {
    if (postToView[index].id == req.body.id) {
      postToChange = postToView[index];
    }
  }

  res.render("edit.ejs", { post: postToChange });
});

app.post("/edit-submit", (req, res) => {
  function getFormattedDateTime() {
    const now = new Date();

    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(now.getDate()).padStart(2, "0");
    const year = now.getFullYear();

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // If hours is 0, set it to 12
    const formattedHours = String(hours).padStart(2, "0");

    return `${month}/${day}/${year} at ${formattedHours}:${minutes} ${ampm}`;
  }

  for (let index = 0; index < postToView.length; index++) {
    if (postToView[index].id == req.body.id) {
      postToView[index].title = req.body.title;
      postToView[index].author = req.body.author;
      postToView[index].post = req.body.post;
    }
  }

  res.redirect("/");
});

app.delete("/delete/:id", (req, res) => {
  const postId = parseInt(req.params.id);

  // Filter out the post with the matching ID
  postToView = postToView.filter((post) => post.id !== postId);

  // Redirect back to home after deletion
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server live on ${port}`);
});
