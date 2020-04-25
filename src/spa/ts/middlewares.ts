import Vue from "vue";
import { NavigationGuard, RawLocation, Route } from "vue-router";
import { authService } from "./bootstrap";
export type navigationGuardNext = (to?: RawLocation | false | ((vm: Vue) => any) | void) => void;

export default {
  // Middleware for authenticated users
  auth: ((to, from, next) => {
    // Users not authenticated will be redirected to 404
    next(!authService.isAuth ? { name: "login" } : undefined);
  }) as NavigationGuard,
  errorCode: ((to, from, next) => {
    const errorCode = parseInt(to.params.code, 10);
    next(errorCode < 400 || errorCode > 499 ? { path: "/error/404" } : undefined);
  }) as NavigationGuard,
  guest: ((to, from, next) => {
    // Users authenticated will be redirected to 404
    next(authService.isAuth ? { path: "/error/404" } : undefined);
  }) as NavigationGuard,
  logout: ((to, from, next) => {
    // Logout
    authService.logout();
    // Navigate to start page
    next({ name: "login" });
  }) as NavigationGuard,
  // Redirect to 404 page if route is not defined
  invalidRoute: ((to, from, next) => {
    if (to.name) {
      next();
    } else {
      next({ path: "error/404" });
    }
  }) as NavigationGuard,
};

export const guard = (guards: NavigationGuard[]) => {
  return (from: Route, to: Route, next: navigationGuardNext) => {
    operate(guards, from, to, next, 0);
  };
};

const operate = (guards: NavigationGuard[], from: Route, to: Route, lastNext: navigationGuardNext, i: number) => {
  const guard: NavigationGuard = guards[i];
  if (guards.length === i + 1) {
    guard(from, to, lastNext);
  } else {
    guard(from, to, (nextArg) => {
      switch (typeof (nextArg)) {
        case "undefined":
          operate(guards, from, to, lastNext, i + 1);
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
