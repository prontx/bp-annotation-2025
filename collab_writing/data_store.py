from typing import List, Dict
from channels.generic.websocket import AsyncWebsocketConsumer
from uuid import uuid4, UUID

class JobClient:
    def __init__(self, consumer: AsyncWebsocketConsumer):
        self.id: UUID = uuid4()
        self.consumer: AsyncWebsocketConsumer = consumer
        self.channel: JobChannel = None

class JobChannel:
    def __init__(self, job_id):
        self.job_id: str = job_id
        self.clients: List[JobClient] = []

    async def add_client(self, client: JobClient):
        client.channel = self
        self.clients.append(client)
        print(f"New client({client.id}) added to {self.job_id}")
        
        #await client.consumer.send(f'Sending {self.job_id} data')

    async def remove_client(self, client: JobClient):
        client.channel = None
        self.clients.remove(client)  
        print(f"Client({client.id}) removed from {self.job_id}")
        
class JobManager:
    def __init__(self):
        self.channels: List[JobChannel] = []
        self.unassigned_clients: JobChannel = JobChannel('unassigned')
        self.consumer_clients: Dict[AsyncWebsocketConsumer, JobClient] = {}

    async def connect_client(self, consumer: AsyncWebsocketConsumer):
        new_client = JobClient(consumer)
        self.consumer_clients[consumer] = new_client
        await self.unassigned_clients.add_client(new_client)
        
    async def disconnect_client(self, consumer: AsyncWebsocketConsumer):
        client = self.consumer_clients[consumer]
        await client.channel.remove_client(client)
        del self.consumer_clients[consumer]
        print(f"Purged client({client.id})")
        
    async def change_job_channel(self, consumer: AsyncWebsocketConsumer, job_id: str):
        if consumer in self.consumer_clients:
            client = self.consumer_clients[consumer]
            new_channel = self._create_or_get_job_channel(job_id)

            await client.channel.remove_client(client)
            await new_channel.add_client(client)
        else:
            print(f"Consumer {consumer} not found in consumer_clients.")
        
        
        # client = self.consumer_clients[consumer]
        # new_channel = self._create_or_get_job_channel(job_id)
        
        # await client.channel.remove_client(client)
        # await new_channel.add_client(client)
        
    def _create_or_get_job_channel(self, job_id: str) -> JobChannel:
        for channel in self.channels:
            if channel.job_id == job_id:
                return channel
            
        new_channel = JobChannel(job_id)
        self.channels.append(new_channel)
        return new_channel

class DataStore:
    def __init__(self):
        self.job_manager = JobManager()
        
store = DataStore()