from typing import List, Dict
from threading import Lock
from channels.generic.websocket import AsyncWebsocketConsumer
from uuid import uuid4, UUID
from .spokendata_api import SpokenDataAPI
from dotenv import load_dotenv
import os

load_dotenv()

class JobClient:
    def __init__(self, consumer: AsyncWebsocketConsumer):
        self.id: UUID = uuid4()
        self.consumer: AsyncWebsocketConsumer = consumer
        self.channel: JobChannel = None

class JobChannel:
    def __init__(self, job_id: str, load_data: bool = True):
        self.job_id: str = job_id
        self.clients: List[JobClient] = []
        self.job_data = None
        self.transcript_data = None
        self.group_data = None
        
        if load_data:
            self.load_job()
        
    def load_job(self):
        api = SpokenDataAPI(api_key=os.getenv('SPOKENDATA_API_KEY'))
        
        self.job_data = api.get_job(self.job_id)
        self.transcript_data = api.get_transcript(self.job_id)
        self.group_data = api.get_groups(self.job_id)
        print("211" + str(self.transcript_data))

    async def add_client(self, client: JobClient):
        client.channel = self
        self.clients.append(client)
        print(f"New client({client.id}) added to {self.job_id}")
        print(f"Total clients: {len(self.clients)}")
        #await client.consumer.send(f'Sending {self.job_id} data')

    async def remove_client(self, client: JobClient):
        client.channel = None
        self.clients.remove(client)  
        print(f"Client({client.id}) removed from {self.job_id}")
        
    async def broadcast(self, message, ignore: List[JobClient] = []):
        for client in self.clients:
            if client in ignore:
                continue
            
            await client.consumer.send(message)
    
    #async ??        
    def save_transcript(self):
        api = SpokenDataAPI(api_key=os.getenv('SPOKENDATA_API_KEY'))
        response = api.put_transcript(
            job_id=self.job_id,
            transcript_data={
                'speaker_tags': self.transcript_data.get('speaker_tags', []),
                'segments': self.transcript_data.get('segments', []),
                'groups': self.group_data or []
            }
        )
            
        self.transcript_data = api.get_transcript(self.job_id)
        self.group_data = api.get_groups(self.job_id)
        print("Data refreshed after save")
        print("212" + str(self.transcript_data))

        # print("Data refreshed after save" + str(self.transcript_data))
        # print("lorem ipsum" + str(response) + str(api.get_transcript(job_id=self.job_id)))
        
class JobManager:
    def __init__(self):
        self.mutex = Lock()
        self.channels: List[JobChannel] = []
        self.unassigned_clients: JobChannel = JobChannel('unassigned', load_data=False)
        self.consumer_clients: Dict[AsyncWebsocketConsumer, JobClient] = {}

    async def connect_client(self, consumer: AsyncWebsocketConsumer):
        new_client = JobClient(consumer)
        self.consumer_clients[consumer] = new_client
        await self.unassigned_clients.add_client(new_client)
        
    async def disconnect_client(self, consumer: AsyncWebsocketConsumer):
        client = self.consumer_clients[consumer]
        await client.channel.remove_client(client)
        del self.consumer_clients[consumer]
        print(f"Disconnected client({client.id})")
        
    async def change_job_channel(self, consumer: AsyncWebsocketConsumer, job_id: str) -> JobChannel | None:
        if consumer in self.consumer_clients:
            client = self.consumer_clients[consumer]
            new_channel = self._create_or_get_job_channel(job_id)

            await client.channel.remove_client(client)
            await new_channel.add_client(client)
            
            return new_channel
        else:
            print(f"Consumer {consumer} not found in consumer_clients.")
            return None
        # if (self.consumer_clients[consumer]):
        #     client = self.consumer_clients[consumer]
        #     new_channel = self._create_or_get_job_channel(job_id)

        #     await client.channel.remove_client(client)
        #     await new_channel.add_client(client)
        
    def _create_or_get_job_channel(self, job_id: str) -> JobChannel:
        for channel in self.channels:
            if channel.job_id == job_id:
                return channel
            
        new_channel = JobChannel(job_id)
        self.channels.append(new_channel)
        return new_channel
    
    def get_client(self, consumer: AsyncWebsocketConsumer) -> JobClient:
        return self.consumer_clients.get(consumer)

class DataStore:
    def __init__(self):
        self.job_manager = JobManager()
        
store = DataStore()