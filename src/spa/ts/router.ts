import VueRouter, { Route } from "vue-router";

import { default as middlewares, guard } from "./middlewares";


// Components
import ErrorComponent from "./components/error.component";
import LoginComponent from "./components/login.component";
import StartComponent from "./components/start.component";

const prefixWith = (path: string, routes: Route[]): Route[] =>
  routes.map((route: Route) => { route.path = `${path}/${route.path}`; return route; });

const router = new VueRouter({
  mode: "history",
  routes: [
    { path: "/start", name: "start", component: StartComponent },
    { path: "/error/:code", name: "error", component: ErrorComponent, beforeEnter: guard([middlewares.errorCode]) },
    { path: "/login", name: "login", component: LoginComponent, beforeEnter: guard([middlewares.guest]) },
    { path: "/logout", name: "logout", beforeEnter: guard([middlewares.auth, middlewares.logout]) },
    { path: "*", beforeEnter: guard([middlewares.invalidRoute]) },
  ],
});

export default router;
