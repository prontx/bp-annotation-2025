from dataclasses import dataclass, fields
from dataclasses_json import dataclass_json, DataClassJsonMixin
from typing import Any, Dict, Optional
import json
import enum

class MessageType(enum.Enum):
    LoadJob = "LoadJob"
    SaveTranscript = "SaveTranscript"
    DeleteSegment = "DeleteSegment"
    SaveGroups = "SaveGroups"

@dataclass
class BaseMessage(DataClassJsonMixin):
    messageType: MessageType
    data: dict = None
    
    @classmethod
    def from_json(cls, json_str: str, **kwargs) -> 'BaseMessage':
        data = json.loads(json_str)
        return cls.from_dict(data, **kwargs)


    @classmethod
    def from_dict(cls, data: Dict[str, Any], **kwargs) -> 'BaseMessage':
        message_type = data.get("messageType")

        message_classes = {
            MessageType.LoadJob: LoadJobMessage,
            MessageType.SaveTranscript: SaveTranscriptMessage,
            MessageType.DeleteSegment: DeleteSegmentMessage,
            MessageType.SaveGroups: SaveGroupsMessage
        }
        
        try:
            message_type = MessageType[message_type]
            message_class = message_classes[message_type]
        except:
            message_class = BaseMessage


        if message_class == LoadJobMessage:
            data["data"] = LoadJobMessageData.from_dict(data["data"])
            
        if message_class == SaveTranscriptMessage:
            data["data"] = SaveTranscriptMessageData.from_dict(data["data"])    
            
        if message_class == DeleteSegmentMessage:
            data["data"] = DeleteSegmentMessageData.from_dict(data["data"])   
        
        if message_class == SaveGroupsMessage:
            data["data"] = SaveGroupsMessageData.from_dict(data["data"])   

        return message_class(**data)
    
    def to_json(self):
        return self.json()
    
@dataclass_json
@dataclass
class LoadJobMessageData:
    jobId: str = None
    jobData: Optional[dict] = None
    transcriptData: Optional[dict] = None
    groupsData: Optional[dict] = None
    
@dataclass_json
@dataclass
class LoadJobMessage(BaseMessage):
    messageType: MessageType = MessageType.LoadJob
    data: LoadJobMessageData = None
    
@dataclass_json
@dataclass
class SaveTranscriptMessageData:
    jobId: str = None
    jobData: Optional[dict] = None
    transcriptData: Optional[dict] = None
    groupsData: Optional[dict] = None

@dataclass_json
@dataclass
class SaveTranscriptMessage(BaseMessage):
    messageType: MessageType = MessageType.SaveTranscript
    data: SaveTranscriptMessageData = None
    
@dataclass_json
@dataclass
class DeleteSegmentMessageData:
    jobId: str = None
    jobData: Optional[dict] = None
    transcriptData: Optional[dict] = None
    groupsData: Optional[dict] = None

@dataclass_json
@dataclass
class DeleteSegmentMessage(BaseMessage):
    messageType: MessageType = MessageType.DeleteSegment
    data: DeleteSegmentMessageData = None
    
@dataclass_json
@dataclass
class SaveGroupsMessageData:
    jobId: str = None
    jobData: Optional[dict] = None
    transcriptData: Optional[dict] = None
    groupsData: Optional[dict] = None

@dataclass_json
@dataclass
class SaveGroupsMessage(BaseMessage):
    messageType: MessageType = MessageType.SaveGroups
    data: SaveGroupsMessageData = None

