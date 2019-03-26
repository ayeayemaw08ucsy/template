import { ApiError } from './apierror.model';

export class Branch {

    branchSeqId: string;
    branchCode: string;
    branchDesc: string;
    name1: string;
    name2: string;
    address: string;
    pinCode: string;
    country: string;
    region: string;
    regionDesc:string;
    countryDesc:string;
    businessDate: string;
    apiError: ApiError;
    activeStatus: string;

    constructor(values: Object = {}) {
    Object.assign(this, values);
    }
}
