import { renderMarkdown } from "@/lib/markdown";
import { isHtml, sanitizeHtml } from "@/lib/html";
import { cn } from "@/lib/utils";

export function Prose({ content, className }: { content: string; className?: string }) {
  const html = isHtml(content) ? sanitizeHtml(content) : renderMarkdown(content);
  return (
    <div
      className={cn(
        "prose prose-slate max-w-none prose-headings:font-display prose-headings:text-slate-900 prose-a:text-primary-700 prose-blockquote:border-accent-500 prose-blockquote:text-slate-700 prose-strong:text-slate-900 prose-img:rounded-xl",
        "prose-content",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
