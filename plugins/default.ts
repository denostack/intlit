import type { Hook, PrimitiveType } from "../types.ts";
import { printArgs } from "../utils.ts";

const VALID_MALE_VALUES = new Set<PrimitiveType>([
  "male",
  "m",
  "MALE",
  "M",
  "Male",
]);
const VALID_FEMALE_VALUES = new Set<PrimitiveType>([
  "female",
  "f",
  "FEMALE",
  "F",
  "Female",
]);

function createGenderHook(gender: "male" | "female"): Hook {
  return (source, args, ctx) => {
    if (ctx.metadata.matched) {
      return ctx.out;
    }
    if (
      gender === "male" && VALID_MALE_VALUES.has(source) ||
      gender === "female" && VALID_FEMALE_VALUES.has(source)
    ) {
      ctx.metadata.matched = true;
      return printArgs(args);
    }
    return "";
  };
}

const pluralRules = new Map<string, Intl.PluralRules>();
function getPluralRules(locale: string) {
  if (!pluralRules.has(locale)) {
    pluralRules.set(locale, new Intl.PluralRules(locale));
  }
  return pluralRules.get(locale)!;
}

const symPluralRule = Symbol("pluralRule");

function createPluginHook(pluralRule: Intl.LDMLPluralRule): Hook {
  return (source, args, ctx, info) => {
    if (ctx.metadata.matched) {
      return ctx.out;
    }
    let selectedPluralRule = ctx.metadata[symPluralRule] as
      | Intl.LDMLPluralRule
      | undefined;
    if (!ctx.metadata[symPluralRule]) {
      selectedPluralRule = ctx.metadata[symPluralRule] = getPluralRules(
        info.locale ?? "en",
      ).select(Number(source ?? 0));
    }
    if (
      selectedPluralRule === pluralRule
    ) {
      ctx.metadata.matched = true;
      return printArgs(args);
    }
    return "";
  };
}

export const defaultHooks: Record<string, Hook> = {
  // gender
  male: createGenderHook("male"),
  female: createGenderHook("female"),

  // plural
  zero: createPluginHook("zero"),
  one: createPluginHook("one"),
  two: createPluginHook("two"),
  few: createPluginHook("few"),
  many: createPluginHook("many"),
  other: createPluginHook("other"),

  // else
  else: (_, args, ctx) => {
    if (ctx.metadata.matched) {
      return ctx.out;
    }
    return printArgs(args);
  },
};
