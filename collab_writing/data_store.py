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
    # def save_transcript(self, updated_data: dict):
    #     api = SpokenDataAPI(api_key=os.getenv('SPOKENDATA_API_KEY'))
    #     print("777 TRANSSCRIPT BEFORE:" + str(self.transcript_data))
    #     print("778 " + str(updated_data))
        
        
    #     processed_segment = updated_data.copy()
    #     if isinstance(processed_segment.get('words'), str):
    #         processed_segment['words'] = [
    #             {'label': word, 'start': None, 'end': None, 'confidence': None, 'text_tags': []}
    #             for word in processed_segment['words'].split()
    #         ]
        
    #     response = api.put_transcript(
    #         job_id=self.job_id,
    #         transcript_data={
    #             'speaker_tags': self.transcript_data.get('speaker_tags', []),
    #             # 'segments': self.transcript_data.get('segments', []),
    #             'segments': [processed_segment],
    #             # 'segments': updated_data,
    #             'groups': self.group_data
    #         }
    #     )
        
    #     print("779 PUT RESPONSE: " + str(response))
    #     updated_transscript = api.get_transcript(self.job_id)
    #     print(f"TRANSSCRIPT AFTER: {updated_transscript}")
    #     self.transcript_data = updated_transscript
    #     self.group_data = api.get_groups(self.job_id)
    #     # print("TRANSSCRIPT AFTER: " + str(self.transcript_data))
        
        
    # def save_transcript(self, updated_data: dict):
    #     api = SpokenDataAPI(api_key=os.getenv('SPOKENDATA_API_KEY'))
        
    #     # Process the updated segment
    #     updated_segment = updated_data.copy()
    #     if isinstance(updated_segment.get('words'), str):
    #         updated_segment['words'] = [
    #             {'label': word, 'start': None, 'end': None, 'confidence': None, 'text_tags': []}
    #             for word in updated_segment['words'].split()
    #         ]
        
    #     # Merge with existing transcript structure
    #     new_transcript = self.transcript_data.copy()
    #     # print("new_transcript before appending " + str(new_transcript))
    #     # new_transcript['segments'].append(updated_segment)
    #     # print("new_transcript after appending " + str(new_transcript))
        
    #     print(f"Transcript before insertion: {new_transcript['segments']} \n\n\n The thing we want to insert {updated_segment}")
        
    #     new_transcript['segments'].append(updated_segment)  # Array of segments
    #     new_transcript['groups'] = self.group_data
        
    #     print(f"Transcript after insertion: {new_transcript['segments']}")
        
    #     response = api.put_transcript(
    #         job_id=self.job_id,
    #         transcript_data=new_transcript  # Send merged structure
    #     )
        
    #     # Updating local state after PUT
    #     self.transcript_data = api.get_transcript(self.job_id)
    #     self.group_data = api.get_groups(self.job_id)
        
    #     # self.transcript_data = new_transcript['segments']
    #     # self.group_data = new_transcript['groups']
        
    #     print(f"992 {self.transcript_data}")
    
    
    def save_transcript(self, updated_data: dict):
        api = SpokenDataAPI(api_key=os.getenv('SPOKENDATA_API_KEY'))

        # Process the updated segment
        updated_segment = updated_data.copy()
        if isinstance(updated_segment.get('words'), str):
            updated_segment['words'] = [
                {'label': word, 'start': None, 'end': None, 'confidence': None, 'text_tags': []}
                for word in updated_segment['words'].split()
            ]

        # Create working copy
        new_transcript = self.transcript_data.copy()
        existing_segments = new_transcript.get('segments', [])

        # Match parameters
        match_tolerance = 0.1  # 100ms tolerance for time comparisons
        updated_start = updated_segment.get('start')
        updated_end = updated_segment.get('end')
        updated_speaker = updated_segment.get('speaker', '')
        
        print("\n MATCHING PARAMETERS:")
        print(f"Looking for: start={updated_start}±{match_tolerance}, "
              f"end={updated_end}±{match_tolerance}, speaker='{updated_speaker}'")
        print("Existing segments:")
        for i, seg in enumerate(existing_segments):
            print(f"{i}: start={seg.get('start')} end={seg.get('end')} "
                  f"speaker='{seg.get('speaker')}' words={seg.get('words')}")

        # Find existing segment using time boundaries + speaker
        found_index = -1
        for i, seg in enumerate(existing_segments):
            time_match = (
                abs(seg.get('start', 0) - updated_start) < match_tolerance and
                abs(seg.get('end', 0) - updated_end) < match_tolerance
            )
            speaker_match = seg.get('speaker', '') == updated_speaker

            if time_match and speaker_match:
                found_index = i
                break
            
        # Update logic
        if found_index != -1:
            print(f" Replacing segment at index {found_index}")
            existing_segments[found_index] = updated_segment
        else:
            print(" Appending new segment")
            existing_segments.append(updated_segment)

        # Finalize and save
        new_transcript['segments'] = existing_segments
        new_transcript['groups'] = self.group_data
    
        response = api.put_transcript(
            job_id=self.job_id,
            transcript_data=new_transcript
        )

        # Update local state
        self.transcript_data = api.get_transcript(self.job_id)
        self.group_data = api.get_groups(self.job_id)


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