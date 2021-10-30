export default class Page {
    filename = "";
    dir = "";
    path = "";
    meta = new PageMeta();
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
    synopsis = "";
    date = "";
}
