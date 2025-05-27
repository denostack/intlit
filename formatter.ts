import { Interpreter } from "./interpreter.ts";
import type {
  FormatParameters,
  FormatParameterValue,
  Plugin,
  Runtime,
} from "./types.ts";

export interface FormatterOptions {
  locale?: string;
  runtime?: Runtime;
  plugin?: Plugin;
}

export class Formatter {
  readonly locale: string;
  readonly runtime: Runtime;
  readonly plugin: Plugin;

  constructor(options: FormatterOptions = {}) {
    this.locale = options.locale ?? "en";
    this.runtime = options.runtime ?? new Interpreter();
    this.plugin = options.plugin ?? {};
  }

  format(text: string, parameters: FormatParameters = {}) {
    return this.runtime.execute(
      text,
      parameters,
      createDecorator(this.locale, this.plugin),
    );
  }
}

function createDecorator(locale: string, plugin: Plugin) {
  return (self: FormatParameterValue) => {
    let current = self;
    const metadata = {} as Record<string, unknown>;
    const decorated = new Proxy({}, {
      get(_, prop) {
        if (prop === "toString") {
          return () => current?.toString();
        }
        if (prop in plugin) {
          const hook = plugin[prop as string];
          return (...args: (string | number | (() => string))[]) => {
            current = hook({
              self,
              current,
              args,
              metadata,
              locale,
            });
            return decorated;
          };
        }
        return undefined;
      },
    });
    return decorated;
  };
}
