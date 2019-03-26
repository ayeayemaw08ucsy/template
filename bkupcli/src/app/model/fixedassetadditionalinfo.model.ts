export class FixedAssetAdditionalInfo {

    fixedAssetAddlMstSeqId: string;
    entity: string | '';
    productCode: string | '';
    prodRefId: string;
    businessDate: Date;
    note1: string | '';
    note2: string | '';
    note3: string | '';
    note4: string | '';
    insVendorCode: string | '';
    insuranceName: string | '';
    insuranceCode: string | '';
    insuranceLocation: string | '';
    insuranceType: string | '';
    insuranceFrom: Date;
    insuranceTo: Date;
    warrantyCode: string | '';
    warrantyName: string | '';
    warrantyLocation: string | '';
    warrantyType: string | '';
    warrantyFrom: Date;
    warrantyTo: Date;
    supportCode: string | '';
    supportName: string | '';
    supportLocation: string | '';
    supportType: string | '';
    supportFrom: Date;
    supportTo: Date;
    taxCode: string | '';
    taxType: string | '';
    taxName: string | '';
    taxRate: any;
    taxCurrency: string | '';
    taxAmount: any;
    financeCode: string | '';
    financeName: string | '';
    financeType: string | '';
    financeCurrency: string | '';
    financeAmt: string | '';
    rate: any;
    financeFrom: Date;
    financeTo: Date;
    fixedAssetAddlTnxSeqId: string;
    fixedAssetAdditionalInfo: any;

    constructor(values: Object = {}) {
    Object.assign(this, values);
    }

}
