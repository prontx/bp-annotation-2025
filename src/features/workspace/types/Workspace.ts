import { APIErrorResponse } from "../../../types/APIErrorResponse";
import { GroupTag } from "../../transcript/types/Tag";
import { History } from "./History";
import { Job } from "./Job";

export interface Workspace extends Pick<Job, "title"|"duration"|"url"> {
    jobID: string,
    loadingStatus: string,
    error: APIErrorResponse|null,
    groupTags: GroupTag[],
    groupTagShortlist: GroupTag[],
    history: History,
    manualSave: boolean,
    autosaveEnabled: boolean,
    autosaveInterval: number,
}
