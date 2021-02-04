import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { UIService } from '../../shared/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit, OnDestroy {

  isLoading = false;
  loadingSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router, private uiService: UIService) { }

  ngOnInit() {
    this.loadingSubscription = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }

  onSubmit(form: NgForm) {
    const user = {
      email: form.value.email,
      password: form.value.password
    };

    this.authService.signin(user).subscribe(
      result => {
        localStorage.setItem('token', result.token);
        localStorage.setItem('userId', result.userId);
        this.authService.userIsLoggedIn.emit(this.authService.isAuth());
        this.router.navigate(['/hotels']);
      }
    );

    form.reset();
  }

  ngOnDestroy() {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }

}
