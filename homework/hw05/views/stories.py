import json

from flask import Response
from flask_restful import Resource

from models.story import Story
from views import get_authorized_user_ids


class StoriesListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user

    def get(self):
        """
        Get all stories for the current user
        """
        authorized_user_ids = get_authorized_user_ids(self.current_user)
        stories = Story.query.filter(self.current_user.id.in_(authorized_user_ids))

        if stories is None:
            return Response(status=400)

        data = [item.to_dict() for item in stories.all()]
        return Response(
            response=json.dumps(data), mimetype="application/json", status=200
        )


def initialize_routes(api, current_user):
    api.add_resource(
        StoriesListEndpoint,
        "/api/stories",
        "/api/stories/",
        resource_class_kwargs={"current_user": current_user},
    )
