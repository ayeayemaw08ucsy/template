import { ApiError } from './apierror.model';

export class Report {

    url: string;
    reportName: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
