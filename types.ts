export type FormatParameterValue = string | number | bigint | boolean | null;
export type FormatParameters = Record<string, FormatParameterValue>;

export interface Runtime {
  execute(
    text: string,
    parameters: FormatParameters,
    decorateValue?: (value: FormatParameterValue) => unknown,
  ): string;
}

export interface PluginContext {
  locale: string;
  self: FormatParameterValue;
  current: FormatParameterValue;
  args: (string | number | (() => string))[];
  metadata: Record<string | symbol, unknown>;
}

export type PluginHook = (ctx: PluginContext) => FormatParameterValue;

export interface Plugin {
  [name: string]: PluginHook;
}
