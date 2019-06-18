export const loadScript = (url: string): void => {
  const fileref = document.createElement("script");
  fileref.setAttribute("type", "text/javascript");
  fileref.setAttribute("src", url);
  document.getElementsByTagName("head")[0].appendChild(fileref);
};
