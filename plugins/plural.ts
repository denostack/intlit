import type { Plugin, PluginHook } from "../types.ts";

function printArgs(args: (string | number | (() => string))[]) {
  return typeof args[0] === "function" ? args[0]() : args[0];
}

const pluralRules = new Map<string, Intl.PluralRules>();
function getPluralRules(locale: string) {
  if (!pluralRules.has(locale)) {
    pluralRules.set(locale, new Intl.PluralRules(locale));
  }
  return pluralRules.get(locale)!;
}

function createPluginHook(pluralRule: Intl.LDMLPluralRule): PluginHook {
  return (ctx) => {
    if (ctx.metadata.matched) {
      return ctx.current;
    }
    if (
      getPluralRules(ctx.locale).select(Number(ctx.self ?? 0)) === pluralRule
    ) {
      ctx.metadata.matched = true;
      return printArgs(ctx.args);
    }
    return "";
  };
}

export const pluralPlugin: Plugin = Object.fromEntries(
  (["one", "other", "zero", "two", "few", "many"] as Intl.LDMLPluralRule[]).map(
    (rule) => [rule, createPluginHook(rule)],
  ),
);
