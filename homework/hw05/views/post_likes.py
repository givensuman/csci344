import json

from flask import Response
from flask_restful import Resource, reqparse

from models import db
from models.like_post import LikePost


class PostLikeListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user

    def post(self):
        """
        Likes a post for the current user.
        """
        parser = reqparse.RequestParser()
        parser.add_argument("post_id", required=True, location="json")
        args = parser.parse_args()

        post_id = args.get("post_id")

        if post_id is None:
            return Response(status=500)

        like = LikePost(user_id=self.current_user.id, post_id=post_id)
        db.session.add(like)
        db.session.commit()

        return Response(
            response=json.dumps(like.to_dict()),
            mimetype="application/json",
            status=201,
        )


class PostLikeDetailEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user

    def delete(self, like_id):
        """
        Deletes a like for the current user.
        """
        like = LikePost.query.get(like_id)

        if not like or like.user_id != self.current_user.id:
            return Response(status=400)

        else:
            LikePost.query.filter_by(id=like_id).delete()
            db.session.commit()
            return Response(status=200)


def initialize_routes(api, current_user):
    api.add_resource(
        PostLikeListEndpoint,
        "/api/likes",
        "/api/likes/",
        resource_class_kwargs={"current_user": current_user},
    )

    api.add_resource(
        PostLikeDetailEndpoint,
        "/api/likes/<int:like_id>",
        "/api/likes/<int:like_id>/",
        resource_class_kwargs={"current_user": current_user},
    )
