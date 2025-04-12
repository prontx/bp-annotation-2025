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
            print(f"Parsed message type: {message.messageType}")
            
            print("Received:", message)
            
            if isinstance(message, LoadJobMessage):
                message: LoadJobMessage = message
                channel = await store.job_manager.change_job_channel(self, message.data.jobId)
                
                message.data.jobData = channel.job_data
                message.data.transcriptData = channel.transcript_data
                message.data.groupsData = channel.group_data
                
                # print("111 \n\n\n\n\n" + str(message.data.transcriptData) + str(channel.transcript_data))
                
                
                serialized_message = message.to_json()
                await self.send(text_data=serialized_message)
                
                # await self.send(text_data=message.to_json())
                
                client = store.job_manager.get_client(self)

                await client.channel.broadcast(serialized_message, ignore=[client])
                
            elif isinstance(message, SaveTranscriptMessage):
                message: SaveTranscriptMessage = message
                print("Handling save request")
                client = store.job_manager.get_client(self)
                if not client or not client.channel:
                    print("No client/channel found")
                    return

                try:                    
                    # Save using the updated data:
                    client.channel.save_transcript(message.data.transcriptData)
                    print("Save successful")                    
                    await self.send(text_data=message.to_json())
                    await client.channel.broadcast(message.to_json(), ignore=[client])

                except Exception as e:
                    print(f"Save failed: {str(e)}")
                    raise
                
            elif isinstance(message, DeleteSegmentMessage):
                message: DeleteSegmentMessage = message
                print("Handling segment deletion")
                client = store.job_manager.get_client(self)
                if not client or not client.channel:
                    print("No client/channel found")
                    return

                try:
                    client.channel.delete_segment(message.data.transcriptData)
                    print("Segment deletion successful")
                    await self.send(text_data=message.to_json())
                    await client.channel.broadcast(message.to_json(), ignore=[client])
                    
                except Exception as e:
                    print(f"Segment deletion failed: {str(e)}")
                    raise

                # await self.send(response.to_json())  
            
        except SpokenDataException as e:
            print("Request error:", e)
            raise 
        except Exception as e:
            print("Unable to parse message:", e)
            raise 
        

        #print(f"Sending {message_json}")

        #await self.send(text_data=json.dumps({
        #    'message': message + ""
        #}))