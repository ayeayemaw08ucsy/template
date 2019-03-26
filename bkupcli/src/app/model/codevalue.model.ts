import { Code } from "./code.model";
import Common from "./common.model";

export class CodeValue {
   
      id: string | '';
      codeValue: string | '';
      shortDesc: string | '';
      longDesc: string | ''
      businessDate: string | '';
      codeValUpdateFlag: string | ''; 
      parentType: string | '';
      code: Code;
      check: boolean;

      constructor(values: Object = {}) {
        Object.assign(this, values);
      }

}


