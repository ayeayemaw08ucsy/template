import { CodesetupService } from "src/app/service/codesetup/codesetup.service";
import { AbstractControl } from "@angular/forms";
import { catchError, map, tap } from 'rxjs/operators';

export class ValidateDuplicateCodeValue {
    static createDuplicateValidator(service : CodesetupService) {
        return (control: AbstractControl)  => {
        
            return service.checkDuplicateCodeValueSecond(control.value).pipe(map((res) =>{
                console.log('Asyn Validator' , res);
               return res ? null: { duplicate: true};
            }));
        }
    }
}