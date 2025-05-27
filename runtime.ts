import type { FormatParameters, FormatParameterValue } from "./types.ts";

export interface Runtime {
  execute(
    text: string,
    parameters: FormatParameters,
    decorateValue?: (value: FormatParameterValue) => unknown,
  ): string;
}
