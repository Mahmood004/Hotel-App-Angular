import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isAuth: boolean;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {

    this.authService.userIsLoggedIn.subscribe(
      result => this.isAuth = result
    );
    this.isAuth = this.authService.isAuth();
  }

  onLogout() {
    this.authService.logout();
    this.isAuth = false;
    this.router.navigate(['/signin']);
  }

}
