export class WorkingDay {

    next: string;
    current: string;
    previous: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
