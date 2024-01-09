const { SuccessResponse } = require("../core/success.response");
const CommentService = require("../services/comment.service");

class CommentController{
  
  createComment = async ( req, res, next ) => {
    new SuccessResponse({
      message: 'Code created',
      metadata: await CommentService.createComment(req.body)
    }).send(res);
  }

  deleteComment = async ( req, res, next ) => {
    new SuccessResponse({
      message: 'Code created',
      metadata: await CommentService.deleteComment(req.body)
    }).send(res);
  }

  getCommentsByParentId = async ( req, res, next ) => {
    new SuccessResponse({
      message: 'Code created',
      metadata: await CommentService.getCommentByParentId(req.query)
    }).send(res);
  }
}

module.exports = new CommentController();