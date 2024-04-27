import { GroupTag } from "../../transcript/types/Tag";
import { History } from "./History";
import { Job } from "./Job";
import { SavingState } from "./SavingState";

export interface Workspace extends Pick<Job, "title"|"duration"|"url"> {
    jobID: string,
    loadingStatus: string,
    errorMessage: string,
    groupTags: GroupTag[]|null,
    groupTagShortlist: GroupTag[]|null,
    history: History,
    saving: SavingState,
}
