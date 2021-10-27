export default class Page {
    meta = new PageMeta();
    contents = "";
}
export class PageMeta {
    layout = "";
    title = "";
    date = "";
}
export class PageInfo {
    path = "";
    meta = new PageMeta();
}
