import { linesOf, paragraphsOf } from "@/lib/text";

export function Paragraphs({ text }: { text: string }) {
  const blocks = paragraphsOf(text);
  return (
    <div className="space-y-4">
      {blocks.map((block) => {
        if (block.startsWith("## ")) {
          return (
            <h2 key={block} className="pt-4 font-display text-3xl text-forest">
              {block.slice(3)}
            </h2>
          );
        }
        if (block.startsWith("### ")) {
          return (
            <h3 key={block} className="pt-2 font-display text-2xl text-forest">
              {block.slice(4)}
            </h3>
          );
        }
        const lines = block.split("\n");
        if (lines.every((line) => line.startsWith("- "))) {
          return (
            <ul key={block} className="space-y-2">
              {lines.map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 bg-gold" />
                  <span>{line.slice(2)}</span>
                </li>
              ))}
            </ul>
          );
        }
        return <p key={block}>{block}</p>;
      })}
    </div>
  );
}

export function BulletList({ text }: { text: string }) {
  return (
    <ul className="space-y-3">
      {linesOf(text).map((line) => (
        <li key={line} className="flex gap-3">
          <span className="mt-3 h-1.5 w-1.5 shrink-0 bg-gold" />
          <span>{line}</span>
        </li>
      ))}
    </ul>
  );
}
