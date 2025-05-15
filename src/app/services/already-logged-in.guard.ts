import { delay, map, Observable, of, take } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AlreadyLoggedInGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return of(true).pipe(
      delay(500),
      map(() => {
        const authenticated = this.authService.user != null;

        console.log("User is authenticated:", authenticated);

        if (authenticated) {
          this.router.navigate(['']);
          return false;
        }

        return true;
      })
    );
  }
}