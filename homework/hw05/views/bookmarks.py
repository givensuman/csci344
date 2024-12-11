import json

from flask import Response
from flask_restful import Resource, reqparse

from models import db
from models.bookmark import Bookmark


class BookmarksListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user

    def get(self):
        """
        Retrieves all bookmarks for the current user.
        """
        bookmarks = Bookmark.query.filter_by(user_id=self.current_user.id).all()
        if bookmarks is None:
            return Response(status=400)

        data = [item.to_dict() for item in bookmarks]
        return Response(
            response=json.dumps(data),
            mimetype="application/json",
            status=200,
        )

    def post(self):
        """
        Creates a new bookmark for the current user.
        """
        parser = reqparse.RequestParser()
        parser.add_argument("post_id", required=True, location="json")
        args = parser.parse_args()

        posted_id = args.get("post_id")

        if posted_id is None:
            return Response(status=500)

        bookmark = Bookmark(user_id=self.current_user.id, post_id=posted_id)
        db.session.add(bookmark)
        db.session.commit()

        return Response(
            response=json.dumps(bookmark.to_dict()),
            mimetype="application/json",
            status=201,
        )


class BookmarkDetailEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user

    def delete(self, bookmark_id):
        """
        Deletes a bookmark for the current user.
        """
        bookmark = Bookmark.query.get(bookmark_id)

        if not bookmark or bookmark.user_id != self.current_user.id:
            return Response(status=400)

        else:
            Bookmark.query.filter_by(id=bookmark_id).delete()
            db.session.commit()
            return Response(status=200)


def initialize_routes(api, current_user):
    api.add_resource(
        BookmarksListEndpoint,
        "/api/bookmarks",
        "/api/bookmarks/",
        resource_class_kwargs={"current_user": current_user},
    )

    api.add_resource(
        BookmarkDetailEndpoint,
        "/api/bookmarks/<int:id>",
        "/api/bookmarks/<int:id>",
        resource_class_kwargs={"current_user": current_user},
    )
