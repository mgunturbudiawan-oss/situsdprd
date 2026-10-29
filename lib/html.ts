import sanitize from "sanitize-html";

/** Konten dari editor visual disimpan sebagai HTML; konten lama berupa markdown ringan. */
export function isHtml(content: string) {
  return /^\s*<(p|h[1-6]|ul|ol|blockquote|div|table|figure|img|hr)[\s>]/i.test(content || "");
}

const ALIGN = { "text-align": [/^(left|right|center|justify)$/] };

/** Saring HTML hasil editor: hanya tag, atribut, gaya, dan sumber embed yang diizinkan. */
export function sanitizeHtml(html: string) {
  return sanitize(html, {
    allowedTags: [
      "p", "br", "h2", "h3", "h4", "strong", "b", "em", "i", "u", "s", "mark", "sub", "sup", "a", "ul", "ol", "li",
      "blockquote", "hr", "img", "table", "thead", "tbody", "tr", "th", "td", "colgroup", "col", "div", "iframe", "span",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      th: ["colspan", "rowspan", "colwidth"],
      td: ["colspan", "rowspan", "colwidth"],
      div: ["data-youtube-video"],
      iframe: ["src", "width", "height", "allowfullscreen", "frameborder", "allow"],
      "*": ["style"],
    },
    allowedStyles: { p: ALIGN, h2: ALIGN, h3: ALIGN, h4: ALIGN, td: ALIGN, th: ALIGN },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["http", "https"] },
    allowedIframeHostnames: ["www.youtube.com", "www.youtube-nocookie.com", "youtube.com"],
    transformTags: {
      a: (tagName, attribs) => {
        const external = /^https?:\/\//i.test(attribs.href || "");
        return { tagName, attribs: external ? { ...attribs, target: "_blank", rel: "noopener noreferrer" } : attribs };
      },
    },
  });
}

export function stripTags(content: string) {
  return (content || "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}
