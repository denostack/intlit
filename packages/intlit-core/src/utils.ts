import type { HookArg } from "./types.ts";

export function printArgs(args: HookArg[]): string {
  return args.map((arg) => {
    if (typeof arg === "function") {
      return arg();
    }
    return "";
  }).join("");
}
