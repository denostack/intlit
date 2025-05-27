import type { FormatParameterValue } from "./types.ts";

export interface PluginContext {
  self: FormatParameterValue;
  current: FormatParameterValue;
  args: (string | number | (() => string))[];
  metadata: Record<string, unknown>;
}

export interface Plugin {
  [name: string]: (ctx: PluginContext) => FormatParameterValue;
}
