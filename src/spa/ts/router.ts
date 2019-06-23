import VueRouter, { Route, RouteConfig } from "vue-router";

import { wikiToRouting, wiki, IWikiRouting } from "./utils/wiki";

import { default as middlewares, guard } from "./middlewares";

// Components
import ErrorComponent from "./components/error.component";
import LoginComponent from "./components/login.component";
import PageComponent from "./components/page.component";
import StartComponent from "./components/start.component";
import TextComponent from "./components/text.component";
import WikiComponent from "./components/wiki.component";
import TimeReportComponent from "./components/time-report.component";
import TimeResultComponent from "./components/time-result.component";

const prefixWith = (path: string, routes: RouteConfig[]): RouteConfig[] =>
  routes.map((route: Route) => { route.path = `${path}/${route.path}`; return route; });

const wikiRoutingToTextComponentRouting = (wiki: IWikiRouting[]): RouteConfig[] => {
  return wiki.map((wiki: IWikiRouting) => ({
    path: wiki.path,
    name: wiki.name,
    ...(wiki.children !== undefined ? {
      component: WikiComponent,
      children: wikiRoutingToTextComponentRouting(wiki.children),
    } : {
        component: TextComponent,
        props: { name: wiki.name },
      })
  }))
}

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/", component: PageComponent, children: [
        { path: "start", name: "start", component: StartComponent },
        {
          path: "wiki", name: "wiki", component: WikiComponent, children: wikiRoutingToTextComponentRouting(wikiToRouting(wiki, "wiki"))
        },
        {
          path: "time", name: "time", component: { render(c) { return c('router-view') } }, children: [
            { path: "report", name: "time.report", component: TimeReportComponent },
            { path: "result", name: "time.result", component: TimeResultComponent },
          ]
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
