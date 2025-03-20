
export enum MessageType {
    LoadJob = "LoadJob",
    SaveTranscript = "SaveTranscript",
}

export class BaseMessage {
    messageType: MessageType
    data: any

    constructor(messageType: MessageType, data: any) {
        this.messageType = messageType
        this.data = data
    }                      
    
    public static fromJson(json: string) {
        const obj = JSON.parse(json)
        return new BaseMessage(obj.messageType, obj.data)
    }

    public toJson() {
        return JSON.stringify(this)
    }

    toJSON() {
        return {
            messageType: MessageType[this.messageType],
            data: this.data
        }
    }
}

export class LoadJobMessage extends BaseMessage {
    declare data: {
        jobData: object
        jobTranscript: object
        jobGroups: object
    } | any

    constructor(job_id: string) {
        super(MessageType.LoadJob, { 
            jobId: job_id
        })
    }
}

export class SaveTranscriptMessage extends BaseMessage {
    declare data: {
        jobData: object
        jobTranscript: object
        jobGroups: object
    } | any

    // constructor(job_id: string, extraData?: object) {
    //     super(MessageType.SaveTranscript, {
    //         jobId: job_id,
    //         ...(extraData || {})
    //     });
    // }

    constructor(job_id: string, transcriptData: object, groupsData: object, jobData?: object) {
        super(MessageType.SaveTranscript, {
          jobId: job_id,
          transcriptData: transcriptData,
          groupsData: groupsData,
          jobData: jobData,
        });
      }
}
