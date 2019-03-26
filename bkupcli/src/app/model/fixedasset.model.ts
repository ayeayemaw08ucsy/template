import { FixedAssetAdditionalInfo } from './fixedassetadditionalinfo.model';
import { PictureAndQRInfo } from './pictureandqrinfo.model';
import Common from './common.model';

export class FixedAsset implements Common {

    fixedAssetMstSeqId: string | '';
    fixedAssetTnxSeqId: string | '';
    entity: string | '';
    productCode: string | '';
    assetType: string | '';
    assetSubType: string | '';
    prodRefId: string | '';
    businessDate: Date;
    invoiceDate: Date;
    invoiceRef: string | '';
    invUnitPrice: any;
    invQuantity: number | 0;
    invCurrency: string | '';
    invAmount: any;
    exchRate: any;
    tnxCurrency: string | '';
    tnxAmount: any;
    bookCurrency: string | '';
    bookAmt: any;
    purchaseDate: Date;
    assetDesc1: string | '';
    assetDesc2: string | '';
    assetModel: string | '';
    serialNo: string | '';
    uniqueId: string | '';
    assetQuantity: number | 0;
    branchCode: string | '';
    deptCode: string |'';
    depMethod: string | '';
    depRate: any;
    usefulLife: number | 0;
    depCollFreq: string | '';
    residualCurrency: string | '';
    depUsefulLife: number;
    depCollFrequency: string;
    residualValue: any;
    accumDepCurrency: string | '';
    accumDepAmt: any;
    depSequence: number | 0;
    netAssetCurrency: string | '';
    netAssetAmount: any;
    disposalDate: Date;
    disposeType: string | '';
    archiveFlag: string | '';
    vendorCode: string | '';
    vendorName: string | '';
    prodStatusCode: string | '';
    addlInfo: FixedAssetAdditionalInfo;
    addlInfoTnx: FixedAssetAdditionalInfo;
    imgInfo: PictureAndQRInfo;
    imgInfoTnx: PictureAndQRInfo;
    tnxType: any;
    tnxSubType: any;
    tnxStatusCode: any;
    assetTracking: string;
    lastCollectionDate: Date;
    periodicDepreciationAmt: any;
    periodicDepreciationCurrency: string;
    inputUser: string | '';
    periodicDepreciation: any;
    fixedAsset: any;
    taskName: string | '';
    register: boolean;
    draft: boolean;
    amend: boolean;
    amendApprove: boolean;
    authorize: boolean;

    constructor(values: Object = {}) {
    Object.assign(this, values);
    }
}
