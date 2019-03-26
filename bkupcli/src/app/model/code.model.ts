export class Code {
    codeId: string | "";
    codeIdDesc: string  | "";
    codeValLen: number | 0;
    createdDate: string | "";
    codeValue: string | "";
    shortDesc: string | "";
    longDesc: string | "";
    id: string | "";
   

    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}