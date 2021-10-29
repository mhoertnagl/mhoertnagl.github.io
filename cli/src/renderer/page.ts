import { ReadTimeResults } from "reading-time";

export default class Page {
  path: string = "";
  meta: PageMeta = new PageMeta();
  contents: string = "";
  readTime: ReadTimeResults = {
    text: "",
    time: 0,
    words: 0,
    minutes: 0,
  };
}

export class PageMeta {
  layout: string = "";
  title: string = "";
  synopsis: string = "";
  date: string = "";
}
