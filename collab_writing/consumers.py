import json
from channels.generic.websocket import AsyncWebsocketConsumer

from .spokendata_api import SpokenDataException
from .data_store import store
from .messages import *

class JobClientConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
    
    async def connect(self):
        await self.accept()
        await store.job_manager.connect_client(self)

    async def disconnect(self, close_code):
        await store.job_manager.disconnect_client(self)

    async def receive(self, text_data):
        try:
            message = BaseMessage.from_json(text_data)
            
            print("Received:", message)
            
            if isinstance(message, LoadJobMessage):
                message: LoadJobMessage = message
                channel = await store.job_manager.change_job_channel(self, message.data.jobId)
                
                message.data.jobData = channel.job_data
                message.data.transcriptData = channel.transcript_data
                
                await self.send(text_data=message.to_json())
                
                client = store.job_manager.get_client(self)
                client.channel.broadcast(message, ignore=[client])
        except SpokenDataException as e:
            print("Request error:", e)
        except Exception as e:
            print("Unable to parse message:", e)
        

        #print(f"Sending {message_json}")

        #await self.send(text_data=json.dumps({
        #    'message': message + ""
        #}))