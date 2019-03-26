export class Vendortnx {

    vendorTnxSeqId: string;
    vendorCode: string;
    vendorDesc: string;
    name1: string;
    name2: string;
    address: string;
    pinCode: string;
    phone: string;
    email: string;
    country: string;
    counrtyDesc:string;
    businessDate: string;
    activeStatus: string;
    tnxType: string;
    tnxSubType: string;
    tnxStatusCode: string;
    authorize: boolean;

    constructor(values: Object = {}) {
    Object.assign(this, values);
    }
}
