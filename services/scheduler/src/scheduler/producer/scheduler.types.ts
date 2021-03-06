import { JobOptions, JobStatus } from "../../app/features/scheduling/models/job.model";
import { JobType } from "../index";

export interface SchedulerJob {
  name: string;
  type: JobType;
  status: JobStatus;
  jobOptions: JobOptions;
  payload?: any;
}

export interface Scheduler {
  scheduleJob: (job: SchedulerJob) => Promise<{ id: string }>;
  cancelJob: (jobName: string) => Promise<void>;
}
