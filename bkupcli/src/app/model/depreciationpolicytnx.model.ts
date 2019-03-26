import Common from "./common.model";
import { DepreciationPolicy } from "./depreciationpolicy.model";

export class DepreciationPolicyTnx implements Common{
  id: string | '';
  assetType: string | '';
  assetSubType: string| '';
  assetTypeCodeValueDesc: string | '';
  assetSubTypeCodeValueDesc: string | '';
  depMethod: string | '';
  depRate: string | '' ;
  depCollFrequency: string | '';
  depUsefulLife: number ;
  entity: string | "";
  inputUserId : string | "";
  inputDateTime : string | "";
  approveUserId: string | "";
  approveDateTime : string | "";
  businessDate : string | "";
  depreciation: DepreciationPolicy;
  tnxStatusCode: any;
  tnxType: any;
  tnxSubType: any;
}