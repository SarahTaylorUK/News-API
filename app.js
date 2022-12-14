const express = require("express");
const cors = require('cors')
const app = express();
app.use(express.json());
app.use(cors())

const {
  getTopics,
  getArticleByID,
  patchArticleByID,
  getUsers,
  getArticles,
  getCommentsByArticleID,
  postCommentByArticleID,
  deleteCommentByCommentID,
  getEndpoints,
  getUsersByUsername,
  patchCommentVoteByID,
  postArticle,
  postTopic,
  deleteArticleByArticleID
} = require("./controller/news.controller");

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleByID);
app.get("/api/users", getUsers);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleID);
app.get('/api', getEndpoints)
app.get('/api/users/:username', getUsersByUsername)

app.post("/api/articles/:article_id/comments", postCommentByArticleID);
app.post('/api/articles', postArticle)
app.post('/api/topics', postTopic)

app.patch("/api/articles/:article_id", patchArticleByID);
app.patch("/api/comments/:comment_id", patchCommentVoteByID)

app.delete('/api/comments/:comment_id', deleteCommentByCommentID)
app.delete('/api/articles/:article_id', deleteArticleByArticleID)

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});
///////////////////////////////////////////////////////

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(400).send({ msg: "Bad request" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Bad request, cannot insert into table" });
  } else if (err.code === '42703') {
    res.status(400).send({msg: 'Bad request'})
  } else {
    next(err)
  }
});

app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});

module.exports = app;
