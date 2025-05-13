import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from './auth.service';
import { delay, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlreadyLoggedInGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return of(true).pipe(
      delay(500), // Wait until onAuthStateChanged is done in AuthService
      map(() => {
        const isLoggedIn = this.authService.user != null;

        console.log("isLoggedIn:", isLoggedIn);

        if (isLoggedIn) {
          this.router.navigate(['']);
          return false;
        }

        return true;
      }));
  }
}