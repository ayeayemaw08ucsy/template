export class Menu {
    
    _menuData : string;
    /**FA Module. */
    static readonly fixedAsset ='Fixed Asset';
        static readonly new = "New";
        static readonly amend = 'Amend';
        static readonly update = 'Update';
        static readonly dispose = 'Dispose';  
    
    /**BA Module.*/    
    static readonly batchProcess ='Batch Processing';
        static readonly depreciation = 'Depreciation';
        static readonly assetTrack = 'Asset Tracking';
        static readonly archive = 'Archive';
        static readonly bulkUpload = 'Bulk Upload';
    
    /**AA Module */
    static readonly applAdmin ='Application Administration';
        static readonly businessDate = 'Business Date';
        static readonly depPolicy = 'Depreciation Policy';
        static readonly codes = 'Codes';
        static readonly vendors = 'Vendors';
        static readonly branches = 'Branches';
    
    /** Rp Moudle*/
    static readonly chartRep ='Charts & Reports';
        static readonly dashboard = 'Dashboard';
        static readonly report = 'Reports';
        static readonly queries = 'Queries';
     
     /** UA Moudle*/    
    static readonly usrAdmin = 'User Administration';
        static readonly users = 'Users';
        static readonly usrLimit = 'User Limits';
        static readonly usrMatrix = 'User Matrix';

    
    /**Third Level menu */
    static readonly existing ='Existing';
    static readonly register ='Register';
    static readonly complete = 'Complete';
    static readonly Draft = "Draft";
    static readonly Approval = "Approval";
    static readonly Approve = "Approve";
       
          /**Batch Third menu */
             static readonly batchMaster ='Batch Master';
             static readonly batchHistory ='Batch History';
             static readonly assetTrackingStatus = 'Status';
             static readonly assetTrackingExecute = 'Execute';

   
  //getter setter syntax of typescript
  get menuData() : string {
    return this._menuData;
  }

  set menuData(theMenuData: string) {
    this._menuData = theMenuData;
  }           

}