export default class Page {
  meta: PageMeta = new PageMeta();
  contents: string = "";
}

export class PageMeta {
  layout: string = "";
  title: string = "";
  date: string = "";
}

export class PageInfo {
  path: string = "";
  meta: PageMeta = new PageMeta();
}
