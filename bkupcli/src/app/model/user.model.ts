export class User {

    id: number;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    entity: string;
    email: string;
    phone: string;
    mobile: string;
    gender: string;
    branchCode: string;
    deptCode: string;
    levelCode: string;
    groupCode: string;
    userRole: string;
    pwdExpiryDate: string;
    enabled: boolean;
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    credentialsNonExpired: boolean;
    codeValueList: any;
    lastLoginFail: string;
    authorities: any;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
