import Common from "./common.model";

export class DepreciationPolicy {
  depPolicySeqId: string | '';
  assetType: string | '';
  assetSubType: string| '';
  depMethod: string | '';
  depRate: number ;
  depCollFrequency: string | '';
  depUsefulLife: number ;
  tnxStatusCode: any;
  tnxType: any;
  tnxSubType: any;
  entity: string | "";
  businessDate : string | "";
}