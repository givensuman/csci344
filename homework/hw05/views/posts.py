import json

from flask import Response, request
from flask_restful import Resource, reqparse

from models import db
from models.post import Post
from views import get_authorized_user_ids


def get_path():
    return request.host_url + "api/posts/"


class PostListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user

    def get(self):
        """
        Gets all posts for the current user
        """
        authorized_user_ids = get_authorized_user_ids(self.current_user)
        posts = Post.query.filter(self.current_user.id.in_(authorized_user_ids))

        parser = reqparse.RequestParser()
        parser.add_argument("limit", location="args")
        args = parser.parse_args()

        limit = args.get("limit")
        if limit is not None:
            posts = posts.limit(limit)

        data = [item.to_dict() for item in posts.all()]
        return Response(
            response=json.dumps(data), mimetype="application/json", status=200
        )

    def post(self):
        """
        Creates a new post for the current user
        """
        parser = reqparse.RequestParser()
        parser.add_argument("image_url", required=True, location="json")
        parser.add_argument("caption", required=True, location="json")
        parser.add_argument("alt_text", required=True, location="json")
        args = parser.parse_args()

        image_url = args.get("image_url")
        caption = args.get("caption")
        alt_text = args.get("alt_text")

        if not all([image_url, caption, alt_text]):
            return Response(status=400)

        post = Post(
            user_id=self.current_user.id,
            image_url=image_url,
            caption=caption,
            alt_text=alt_text,
        )
        db.session.add(post)
        db.session.commit()

        return Response(
            json.dumps(post.to_dict()), mimetype="application/json", status=201
        )


class PostDetailEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user

    def patch(self, id):
        """
        Updates a post for the current user
        """
        parser = reqparse.RequestParser()
        parser.add_argument("image_url", location="json")
        parser.add_argument("caption", location="json")
        parser.add_argument("alt_text", location="json")
        args = parser.parse_args()

        authorized_user_ids = get_authorized_user_ids(self.current_user)
        post = Post.query.filter(
            self.current_user.id.in_(authorized_user_ids), Post.id == id
        )

        data = post.first()
        if data is None:
            return Response(status=400)

        image_url = args.get("image_url")
        caption = args.get("caption")
        alt_text = args.get("alt_text")

        if not all([image_url, caption, alt_text]):
            return Response(status=400)

        data.image_url = args.get("image_url")
        data.caption = args.get("caption")
        data.alt_text = args.get("alt_text")

        db.session.commit()
        data = data.to_dict()

        return Response(
            response=json.dumps(data), mimetype="application/json", status=200
        )

    def delete(self, id):
        """
        Deletes a post for the current user
        """
        post = Post.query.get(id)
        if not post or post.user_id != self.current_user.id:
            return Response(status=400)

        Post.query.filter_by(id=id).delete()
        db.session.commit()
        return Response(status=200)

    def get(self, id):
        """
        Gets a single post for the current user
        """
        post_id = id
        authorized_user_ids = get_authorized_user_ids(self.current_user)
        post = Post.query.filter(
            self.current_user.id.in_(authorized_user_ids), Post.id == post_id
        )

        data = post.first()
        if data is None:
            return Response(status=400)

        return Response(
            response=json.dumps(data), mimetype="application/json", status=200
        )


def initialize_routes(api, current_user):
    api.add_resource(
        PostListEndpoint,
        "/api/posts",
        "/api/posts/",
        resource_class_kwargs={"current_user": current_user},
    )
    api.add_resource(
        PostDetailEndpoint,
        "/api/posts/<int:id>",
        "/api/posts/<int:id>/",
        resource_class_kwargs={"current_user": current_user},
    )
