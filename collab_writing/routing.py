from django.urls import re_path
from collab_writing import consumers 

websocket_urlpatterns = [
    re_path(r'ws/testos/$', consumers.JobClientConsumer.as_asgi()),
]