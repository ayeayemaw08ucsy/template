export default interface Common {
    entity: string | '';
    tnxStatusCode : string | '';
    tnxType: TnxType;

}

export enum TnxStatusCode {
    Pending = "01" ,
    Complete = "02",
    Approved = "03"
}

export enum TnxType {
    New = 10,
    Amend = 20,
    Update = 30,
    Dispose = 40,
    Archive = 50
}

export enum TnxSubType {
    Capture = 11,
    Upload = 12,
    Increase = 21,
    Decrease = 22,
    FullTransfer = 31,
    InfoUpdate = 32,
    WriteOff = 41,
    SellOff = 42,
    Cancel = 43, 
    FixedAsset = 91,
    Depreciation = 92
}
