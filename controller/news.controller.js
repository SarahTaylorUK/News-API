const {
  selectTopics,
  selectArticleByID,
  updateArticleByID,
  selectCommentsByID
} = require("../model/news.model");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch(next);
};

exports.getArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([selectArticleByID(article_id), selectCommentsByID(article_id)])
  .then((output) => {
    console.log(output, 'controller output')
    const article = output[0]
    article.comment_count = output[1]
    res.status(200).send({'article' : article})
  })
  .catch(next)
};
exports.patchArticleByID = (req, res, next) => {
  if (!req.body.hasOwnProperty("inc_votes")) {
    res.status(400).send({ msg: "Bad request" });
  } else {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    updateArticleByID(article_id, inc_votes)
      .then((output) => {
        ("controller then");
        res.status(200).send({ updatedArticle: output });
      })
      .catch(next);
  }
};
