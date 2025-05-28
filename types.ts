export type PrimitiveType = string | number | boolean | null | undefined | Date;
export type FormatParameters = Record<string, PrimitiveType>;

export interface Runtime {
  execute(
    text: string,
    parameters: FormatParameters,
    decorateValue?: (value: PrimitiveType) => unknown,
  ): string;
}

export interface PluginContext {
  locale: string;
  self: PrimitiveType;
  current: PrimitiveType;
  args: (string | number | (() => string))[];
  metadata: Record<string | symbol, unknown>;
}

export type PluginHook = (ctx: PluginContext) => PrimitiveType;

export interface Plugin {
  [name: string]: PluginHook;
}
