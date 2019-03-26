import { HttpErrorResponse } from '@angular/common/http';

export class ApiError extends HttpErrorResponse {
   error: {
      id?: string
      links?: { about: string }
      status: string
      message: string
      code?: string
      title: string
      detail: string
      source?: {
         pointer?: string
         parameter?: string
      }
      meta?: any
      };
}
