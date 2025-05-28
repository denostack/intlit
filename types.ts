export type PrimitiveType = string | number | boolean | null | undefined | Date;
export type FormatParameters = Record<string, PrimitiveType>;

export type HookArg = string | number | (() => string);

export interface Runtime {
  execute(
    text: string,
    parameters: FormatParameters,
  ): string;
}

export interface HookContext {
  out: string | null;
  metadata: Record<string | symbol, unknown>;
}

export interface HookInfo {
  locale: string | null;
}

export type Hook = (
  source: PrimitiveType,
  args: HookArg[],
  ctx: HookContext,
  info: HookInfo,
) => string | null;
