export default class Page {
    path = "";
    meta = new PageMeta();
    synopsis = "";
    contents = "";
    readTime = {
        text: "",
        time: 0,
        words: 0,
        minutes: 0,
    };
}
export class PageMeta {
    layout = "";
    title = "";
    date = "";
}
