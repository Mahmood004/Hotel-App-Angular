import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route } from "@angular/router";
import { AuthService } from "./auth.service";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthGuardService implements CanActivate, CanLoad {

    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.authService.isAuth()) {
            return true;
        } else {
            this.router.navigate(['signin']);
        }
    }

    canLoad(route: Route) {
        if (this.authService.isAuth()) {
            return true;
        } else {
            this.router.navigate(['signin']);
        }
    }

}