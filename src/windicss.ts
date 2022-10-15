import { Config, HTMLParser, Plugin, Processor } from "./deps.ts";

export function windicss(
  options: (Config & { minify?: boolean }) | undefined
): Plugin {
  const { minify, ...windi } = options || {};
  return {
    name: "windicss",
    render(ctx) {
      const { htmlText } = ctx.render();
      // Get windi processor
      const processor = new Processor(windi);

      // Parse all classes and put into one line to simplify operations
      const htmlClasses = new HTMLParser(htmlText)
        .parseClasses()
        .map((i) => i.result)
        .join(" ");

      // Generate preflight based on the HTML we input
      const preflightSheet = processor.preflight(htmlText);

      // Process the HTML classes to an interpreted style sheet
      const interpretedSheet = processor.interpret(htmlClasses).styleSheet;

      // Build styles
      const APPEND = false;
      const cssText = interpretedSheet
        .extend(preflightSheet, APPEND)
        .build(minify);

      return {
        styles: [{ cssText }],
      };
    },
  };
}
