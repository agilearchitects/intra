import { i18n } from "../ts/locale";

export interface IWiki { name: string; children?: IWiki[]; }
export interface IWikiRoute { route: { name: string }; title: string; children?: IWikiRoute[]; }
export interface IWikiRouting { path: string; name: string; children?: IWikiRouting[]; }
export const wiki: IWiki[] = [
  {
    name: "agile_architects",
    children: [
      { name: "mentality" },
      { name: "communication" },
      { name: "transparency" },
    ],
  },
  {
    name: "board",
    children: [
      { name: "members" },
      { name: "aoa" },
    ],
  },
  {
    name: "accounting",
    children: [
      { name: "bokio" },
      { name: "expenses" },
      { name: "purchase" },
    ],
  },
  {
    name: "channels",
    children: [
      { name: "email" },
      { name: "chat" },
      { name: "files" },
    ],
  },
  {
    name: "staff",
    children: [
      { name: "onboarding" },
      { name: "offboarding" },
    ],
  },
  {
    name: "development",
    children: [
      { name: "git" },
      { name: "devops" },
      { name: "scrum" },
      { name: "documentation" },
    ],
  },
];

export const wikiToRoute = (wiki: IWiki[], parentName: string = ""): IWikiRoute[] => {
  return wiki.map((wiki: IWiki) => {
    const fullName = `${parentName !== "" ? `${parentName}.` : ""}${wiki.name}`;
    return {
      route: { name: fullName },
      title: i18n.t(`${fullName}${wiki.children !== undefined ? `.${wiki.name}` : ""}`).toString(),
      ...(wiki.children !== undefined ? { children: wikiToRoute(wiki.children, fullName) } : undefined),
    };
  });
};

export const wikiToRouting = (wiki: IWiki[], parentName: string = ""): IWikiRouting[] => {
  return wiki.map((wiki: IWiki) => {
    const fullName = `${parentName !== "" ? `${parentName}.` : ""}${wiki.name}`;
    return {
      path: `/${fullName.replace(/\./g, "/")}`,
      name: fullName,
      ...(wiki.children !== undefined ? { children: wikiToRouting(wiki.children, fullName) } : undefined),
    };
  });
};
