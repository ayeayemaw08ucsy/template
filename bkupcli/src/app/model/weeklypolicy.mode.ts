export class WeeklyPolicy {

  id: string;
  monday: boolean; 
  tuesday: boolean;
  wednesday : boolean;
  thursday : boolean;
  friday : boolean;
  saturday : boolean;
  sunday : boolean
  txnStatusCode:string;
  inputUser:string;
  inputDate:string;
  businessDate:string;
  approveUser:string;
  approveDate:string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }

}