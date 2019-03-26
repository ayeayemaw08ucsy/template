import { ApiError } from './apierror.model';

export class Job {

    jobId: string;
    jobName: string;
    jobCategory: string;
    jobFreq: string;
    jobStarttime: string;
    jobRerunCode: string;
    jobDescription: string;
    jobLocation: string;
    jobUpdateDate: string;
    activeStatus: string;
    nextJobId: string;
    nextJobName: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
