import Vue from "vue";
import { NavigationGuard, NavigationGuardNext, RawLocation, Route } from "vue-router";
import { AuthService } from "./services/auth.service";

export class Middlewares {
  public constructor(
    private readonly authService: AuthService,
  ) { }

  // Middleware for authenticated users
  public auth: NavigationGuard = (to, from, next) => {
    // Users not authenticated will be redirected to login page
    next(!this.authService.isAuth ? { name: "login" } : undefined);
  };

  // Middleware for admin users
  public admin: NavigationGuard = ((to: Route, from: Route, next: NavigationGuardNext) => {
    // Users not authenticated will be redirected to login
    next(!this.authService.isAdmin ? { name: "login" } : undefined);
  });

  public errorCode: NavigationGuard = ((to: Route, from: Route, next: NavigationGuardNext) => {
    const errorCode = parseInt(to.params.code, 10);
    next(errorCode < 400 || errorCode > 499 ? { path: "/error/404" } : undefined);
  });

  // Pages only available for guests (like login page)
  public guest: NavigationGuard = ((to: Route, from: Route, next: NavigationGuardNext) => {
    // Users authenticated will be redirected to 404
    next(this.authService.isAuth ? { path: "/error/404" } : undefined);
  });

  // Logout guard. Will logout and then send to login page
  public logout: NavigationGuard = ((to: Route, from: Route, next: NavigationGuardNext) => {
    // Logout
    this.authService.logout();
    // Navigate to start page
    next({ name: "auth.login" });
  });

  // Redirect to 404 page if route is not defined
  public invalidRoute: NavigationGuard = ((to: Route, from: Route, next: NavigationGuardNext) => {
    if (to.name) {
      next();
    } else {
      next({ path: "error/404" });
    }
  });

  public guard = (guards: NavigationGuard[]) => {
    return (from: Route, to: Route, next: NavigationGuardNext) => {
      this.operate(guards, from, to, next, 0);
    };
  };

  private operate = (guards: NavigationGuard[], from: Route, to: Route, lastNext: NavigationGuardNext, i: number) => {
    const guard: NavigationGuard = guards[i];
    if (guards.length === i + 1) {
      guard(from, to, lastNext);
    } else {
      guard(from, to, (nextArg) => {
        switch (typeof (nextArg)) {
          case "undefined":
            this.operate(guards, from, to, lastNext, i + 1);
            break;
          case "object":
            lastNext(nextArg);
            break;
          case "boolean":
            lastNext(nextArg);
            break;
          case "string":
            lastNext(nextArg);
            break;
        }
      });
    }
  };
}