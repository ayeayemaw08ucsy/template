import { ApiError } from './apierror.model';

export class JobHistory {

    jobId: string;
    jobName: string;
    jobCategory: string;
    startDttm: string;
    endDttm: string;
    jobStatus: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
