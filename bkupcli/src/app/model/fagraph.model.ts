import { ApiError } from './apierror.model';

export class FaGraph {

    data: any;
    labels: any;
    constructor(values: Object = {}) {
    Object.assign(this, values);
    }
}
