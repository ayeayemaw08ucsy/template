import {Injectable} from "@angular/core";
import * as SockJS from 'sockjs-client';
import { environment } from "../../../environments/environment";

declare var require: any
var Stomp = require("stompjs/lib/stomp.js").Stomp

const BASE_URL = environment.baseUrl;

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {
    accessToken: string;

    constructor() { }

    connect() {
        this.accessToken = JSON.parse(window.sessionStorage.getItem('token')).access_token;
        let socket = new SockJS(BASE_URL + `/socket?access_token=${this.accessToken}`);

        let stompClient = Stomp.over(socket);
        return stompClient;
    }
}
