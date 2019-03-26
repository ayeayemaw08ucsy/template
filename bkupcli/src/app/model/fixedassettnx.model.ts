import { FixedAssetAdditionalInfo } from './fixedassetadditionalinfo.model';
import { PictureAndQRInfo } from './pictureandqrinfo.model';
import { FixedAsset } from './fixedasset.model';

export class FixedAssetTnx {

    fixedAssetMstSeqId: string;
    fixedAssetTnxSeqId: string;
    entity: string;
    productCode: string;
    assetType: string;
    assetSubType: string;
    prodRefId: string;
    businessDate: Date;
    invoiceDate: Date;
    invoiceRef: string;
    invUnitPrice: any;
    invQuantity: number;
    invCurrency: string;
    invAmount: any;
    exchRate: any;
    tnxCurrency: string;
    tnxAmount: any;
    bookCurrency: string;
    bookAmt: any;
    purchaseDate: Date;
    assetDesc1: string;
    assetDesc2: string;
    assetModel: string;
    serialNo: string;
    uniqueId: string;
    assetQuantity: number;
    branchCode: string;
    deptCode: string;
    depMethod: string;
    depRate: any;
    depUsefulLife: number;
    depCollFrequency: string;
    residualCurrency: string;
    residualValue: any;
    accumDepCurrency: string;
    accumDepAmt: any;
    depSequence: number;
    netAssetCurrency: string;
    netAssetAmount: any;
    disposalDate: Date;
    disposeType: string;
    archiveFlag: string;
    vendorCode: string;
    vendorName: string;
    prodStatusCode: string;
    addlInfoTnx: FixedAssetAdditionalInfo;
    imgInfoTnx: PictureAndQRInfo;
    tnxType: any;
    tnxSubType: any;
    tnxStatusCode: any;
    assetTracking: string;
    lastCollectionDate: Date;
    periodicDepreciation: any;
    fixedAsset: FixedAsset;
    register: boolean;
    draft: boolean;

    constructor(values: Object = {}) {
    Object.assign(this, values);
    }
}
