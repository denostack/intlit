import type { Plugin } from "./plugin.ts";
import type { Runtime } from "./runtime.ts";
import type { FormatParameters, FormatParameterValue } from "./types.ts";

export class Formatter {
  constructor(
    readonly runtime: Runtime,
    readonly plugin: Plugin = {},
  ) {
  }

  format(text: string, parameters: FormatParameters = {}) {
    return this.runtime.execute(
      text,
      parameters,
      createDecorator(this.plugin),
    );
  }
}

function createDecorator(plugin: Plugin) {
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
