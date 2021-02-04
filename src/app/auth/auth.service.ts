import { User } from "./user.model";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs";
import { Injectable, EventEmitter } from "@angular/core";
import { UIService } from "../shared/ui.service";

@Injectable()
export class AuthService {

    userIsLoggedIn = new EventEmitter();

    constructor(private http: Http, private uiService: UIService) {}

    signup(user: User) {
        this.uiService.loadingStateChanged.next(true);
        const body = JSON.stringify(user);
        console.log(body);
        const headers = new Headers({'content-type': 'application/json'});
        return this.http.post('http://localhost:3000/signup', body, {headers: headers})
            .map((response: Response) => {
                this.uiService.loadingStateChanged.next(false);
                return response.json();
            })
            .catch((error: Response) => {
                this.uiService.loadingStateChanged.next(false);
                this.uiService.showSnackbar(error.json().title, null, 3000);
                console.log(error.json());
                return Observable.throw(error.json());
            });
    }

    signin(user: User) {
        this.uiService.loadingStateChanged.next(true);
        const body = JSON.stringify(user);
        const headers = new Headers({'content-type': 'application/json'});
        
        return this.http.post('http://localhost:3000/signin', body, {headers: headers})
            .map((response: Response) => {
                this.uiService.loadingStateChanged.next(false);
                return response.json();
            })
            .catch((error: Response) => {
                this.uiService.loadingStateChanged.next(false);
                this.uiService.showSnackbar(error.json().title, null, 3000);
                return Observable.throw(error.json());
            });
    }

    isAuth() {
        return localStorage.getItem('token') != null;
    }

    logout() {
        localStorage.clear();
    }
}