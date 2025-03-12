import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .data_store import store

class JobClientConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
    async def connect(self):
        await self.accept()
        store.job_manager.connect_client(self)

    async def disconnect(self, close_code):
        store.job_manager.disconnect_client(self)

    async def receive(self, text_data):
        message_json = json.loads(text_data)
        
        message_type = message_json['messageType']
        message_data = message_json['data']
        
        await store.job_manager.change_job_channel(self, message_data)

        print(f"Received message: {message_type}, data: {message_data}")

        #print(f"Sending {message_json}")

        #await self.send(text_data=json.dumps({
        #    'message': message + ""
        #}))