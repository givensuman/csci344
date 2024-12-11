import json

from flask import Response
from flask_restful import Resource, reqparse

from models import db
from models.comment import Comment


class CommentListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user

    def post(self):
        """
        Creates a new comment for the current user.
        """
        parser = reqparse.RequestParser()
        parser.add_argument("post_id", required=True, location="json")
        parser.add_argument("text", required=True, location="json")
        args = parser.parse_args()

        post_id = args.get("post_id")
        comment_text = args.get("text")
        if not all([post_id, comment_text]):
            return Response(status=500)

        comment = Comment(
            user_id=self.current_user.id, post_id=post_id, text=comment_text
        )
        db.session.add(comment)
        db.session.commit()

        return Response(
            response=json.dumps(comment.to_dict()),
            mimetype="application/json",
            status=201,
        )


class CommentDetailEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user

    def delete(self, comment_id):
        """
        Deletes a comment for the current user.
        """
        comment = Comment.query.get(comment_id)

        if not comment or comment.user_id != self.current_user.id:
            return Response(status=400)

        else:
            Comment.query.filter_by(id=comment_id).delete()
            db.session.commit()
            return Response(status=200)


def initialize_routes(api, current_user):
    api.add_resource(
        CommentListEndpoint,
        "/api/comments",
        "/api/comments/",
        resource_class_kwargs={"current_user": current_user},
    )

    api.add_resource(
        CommentDetailEndpoint,
        "/api/comments/<int:comment_id>",
        "/api/comments/<int:comment_id>/",
        resource_class_kwargs={"current_user": current_user},
    )
