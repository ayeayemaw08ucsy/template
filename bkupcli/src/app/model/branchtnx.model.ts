import { ApiError } from './apierror.model';

export class Branchtnx {

    branchTnxSeqId: string;
    branchCode: string;
    branchDesc: string;
    name1: string;
    name2: string;
    address: string;
    pinCode: string;
    country: string;
    region: string;
    businessDate: string;
    apiError: ApiError;
    activeStatus: string;
    tnxType: string;
    tnxSubType: string;
    tnxStatusCode: string;
    authorize: boolean;
    regionDesc:string;
    countryDesc:string;

    constructor(values: Object = {}) {
    Object.assign(this, values);
    }
}
