// Libs
import VueRouter, { NavigationGuardNext, Route } from "vue-router";

// Components
import CreateProjectComponent from "./components/create-project.component.vue";
import CrmComponent from "./components/crm.component.vue";
import CVComponent from "./components/cv.component.vue";
import EditProjectComponent from "./components/edit-project.component.vue";
import ErrorComponent from "./components/error.component.vue";
import LoginComponent from "./components/login.component.vue";
import PasswordResetComponent from "./components/password-reset.component.vue";
import ProjectComponent from "./components/project.component.vue";
import ResetPasswordComponent from "./components/reset-password.component.vue";
import StartComponent from "./components/start.component.vue";
import TextComponent from "./components/text.component.vue";
import TimeReportComponent from "./components/time-report.component.vue";
import TimeResultMonthComponent from "./components/time-result-month.component.vue";
import TimeResultWeekComponent from "./components/time-result-week.component.vue";
import TimeResultComponent from "./components/time-result.component.vue";
import TimeComponent from "./components/time.component.vue";
import WikiComponent from "./components/wiki.component.vue";

// Bootstrap
import { CreateElement } from "vue";
import { bootstrap } from "./bootstrap";

export const router = new VueRouter({
  mode: "history",
  routes: [
    { path: "/start", name: "start", component: StartComponent },
    {
      path: "/wiki", name: "wiki", component: WikiComponent,
      children: [
        {
          path: "agile_architects", name: "wiki.agile_architects",
          component: WikiComponent,
          children: [
            {
              path: "mentality",
              name: "wiki.agile_architects.mentality",
              component: TextComponent,
              props: { name: "wiki.agile_architects.mentality" }
            },
            {
              path: "communication",
              name: "wiki.agile_architects.communication",
              component: TextComponent,
              props: { name: "wiki.agile_architects.communication" }
            },
            {
              path: "transparency",
              name: "wiki.agile_architects.transparency",
              component: TextComponent,
              props: { name: "wiki.agile_architects.transparency" }
            }
          ]
        },
        {
          path: "board", name: "wiki.board",
          component: WikiComponent,
          children: [
            {
              path: "members",
              name: "wiki.board.members",
              component: TextComponent,
              props: { name: "wiki.board.members" }
            },
            {
              path: "aoa",
              name: "wiki.board.aoa",
              component: TextComponent,
              props: { name: "wiki.board.aoa" }
            },
          ]
        },
        {
          path: "agile_architects", name: "wiki.accounting",
          component: WikiComponent,
          children: [
            {
              path: "bokio",
              name: "wiki.accounting.bokio",
              component: TextComponent,
              props: { name: "wiki.accounting.bokio" }
            },
            {
              path: "expenses",
              name: "wiki.accounting.expenses",
              component: TextComponent,
              props: { name: "wiki.accounting.expenses" }
            },
            {
              path: "purchase",
              name: "wiki.accounting.purchase",
              component: TextComponent,
              props: { name: "wiki.accounting.purchase" }
            }
          ]
        },
        {
          path: "channels", name: "wiki.channels",
          component: WikiComponent,
          children: [
            {
              path: "email",
              name: "wiki.channels.email",
              component: TextComponent,
              props: { name: "wiki.channels.email" }
            },
            {
              path: "chat",
              name: "wiki.channels.chat",
              component: TextComponent,
              props: { name: "wiki.channels.chat" }
            },
            {
              path: "files",
              name: "wiki.channels.files",
              component: TextComponent,
              props: { name: "wiki.channels.files" }
            }
          ]
        },
        {
          path: "channels", name: "wiki.staff",
          component: WikiComponent,
          children: [
            {
              path: "onboarding",
              name: "wiki.staff.onboarding",
              component: TextComponent,
              props: { name: "wiki.staff.onboarding" }
            },
            {
              path: "offboarding",
              name: "wiki.staff.offboarding",
              component: TextComponent,
              props: { name: "wiki.staff.offboarding" }
            },
          ]
        },
        {
          path: "development", name: "wiki.development",
          component: WikiComponent,
          children: [
            {
              path: "git",
              name: "wiki.development.git",
              component: TextComponent,
              props: { name: "wiki.development.git" }
            },
            {
              path: "devops",
              name: "wiki.development.devops",
              component: TextComponent,
              props: { name: "wiki.development.devops" }
            },
            {
              path: "scrum",
              name: "wiki.development.scrum",
              component: TextComponent,
              props: { name: "wiki.development.scrum" }
            },
            {
              path: "documentation",
              name: "wiki.development.documentation",
              component: TextComponent,
              props: { name: "wiki.development.documentation" }
            },
          ]
        },
      ]
    },
    {
      path: "/time", name: "time", component: TimeComponent, children: [
        { path: "report", name: "time.report", component: TimeReportComponent },
        {
          path: "result", name: "time.result", component: TimeResultComponent, children: [
            { path: "week", name: "time.result.week", component: TimeResultWeekComponent },
            { path: "month", name: "time.result.month", component: TimeResultMonthComponent },
          ],
        },
        { path: "project", name: "time.project", component: ProjectComponent },
        { path: "project/create", name: "time.project.create", component: CreateProjectComponent },
        { path: "project/:id/edit", name: "time.project.edit", component: EditProjectComponent },
      ],
      beforeEnter: (to: Route, from: Route, next: NavigationGuardNext) => {
        if (to.name === "time") {
          next({ name: "time.report" });
        } else {
          next();
        }
      }
    },
    { path: "/crm", name: "crm", component: CrmComponent },
    { path: "/cv", name: "cv", component: CVComponent },
    { path: "/login", name: "auth.login", component: LoginComponent, beforeEnter: bootstrap.middleware.guard([bootstrap.middleware.guest]) },
    { path: "/logout", name: "auth.logout", beforeEnter: bootstrap.middleware.guard([bootstrap.middleware.logout]) },
    { path: "/password-reset", name: "auth.password_reset", component: PasswordResetComponent, beforeEnter: bootstrap.middleware.guard([bootstrap.middleware.guest]) },
    { path: "/reset-password", name: "auth.reset_password", component: ResetPasswordComponent, beforeEnter: bootstrap.middleware.guard([bootstrap.middleware.guest]) },
    { path: "/error/:code", name: "error", component: ErrorComponent, beforeEnter: bootstrap.middleware.guard([bootstrap.middleware.errorCode]) },
    { path: "*", beforeEnter: bootstrap.middleware.guard([bootstrap.middleware.invalidRoute]) },
  ]
});