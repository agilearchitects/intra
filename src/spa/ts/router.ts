import VueRouter, { Route } from "vue-router";

import { wikiToRouting, wiki, IWikiRouting } from "./utils/wiki";

import { default as middlewares, guard } from "./middlewares";

// Components
import ErrorComponent from "./components/error.component";
import LoginComponent from "./components/login.component";
import PageComponent from "./components/page.component";
import StartComponent from "./components/start.component";
import TextComponent from "./components/text.component";
import WikiComponent from "./components/wiki.component";

const prefixWith = (path: string, routes: Route[]): Route[] =>
  routes.map((route: Route) => { route.path = `${path}/${route.path}`; return route; });
console.log(wikiToRouting(wiki, "wiki"))
const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/", component: PageComponent, children: [
        { path: "start", name: "start", component: StartComponent },
        {
          path: "wiki", name: "wiki", component: WikiComponent, children: wikiToRouting(wiki, "wiki").map((wiki: IWikiRouting) => ({
            ...wiki,
            component: TextComponent,
            props: { name: wiki.name }
          }))
        },
        { path: "/logout", name: "logout", beforeEnter: guard([middlewares.logout]) },
      ],
      beforeEnter: guard([middlewares.auth])
    },
    { path: "/login", name: "login", component: LoginComponent, beforeEnter: guard([middlewares.guest]) },
    { path: "/error/:code", name: "error", component: ErrorComponent, beforeEnter: guard([middlewares.errorCode]) },
    { path: "*", beforeEnter: guard([middlewares.invalidRoute]) },
  ],
});

export default router;
