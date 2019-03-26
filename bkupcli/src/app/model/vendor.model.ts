import { ApiError } from './apierror.model';

export class Vendor {

    vendorSeqId: string;
    vendorCode: string;
    vendorDesc: string;
    name1: string;
    name2: string;
    address: string;
    pinCode: string;
    phone: string;
    email: string;
    country: string;
    countryDesc: string;
    businessDate: string;
    apiError: ApiError;
    activeStatus: string;

    constructor(values: Object = {}) {
    Object.assign(this, values);
    }
}
