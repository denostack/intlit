import type { AstTemplate } from "./ast.ts";
import { parse } from "./parse.ts";
import type {
  FormatParameters,
  FormatParameterValue,
  Runtime,
} from "./types.ts";

export class Interpreter implements Runtime {
  _cache: Map<string, AstTemplate> = new Map();

  execute(
    text: string,
    parameters: FormatParameters,
    decorateValue?: (value: FormatParameterValue) => unknown,
  ): string {
    let ast = this._cache.get(text);
    if (!ast) {
      ast = parse(text);
      this._cache.set(text, ast);
    }
    return this.executeAst(ast, parameters, decorateValue);
  }

  executeAst(
    ast: AstTemplate,
    parameters: FormatParameters,
    decorateValue?: (value: FormatParameterValue) => unknown,
  ): string {
    const [strings, values] = ast;
    let result = strings[0] ?? "";
    values.forEach(([valueName, methods], valueIndex) => {
      const self = parameters[valueName];

      let value = decorateValue ? decorateValue(self) : self;
      for (const [methodName, methodArgs] of methods) {
        const method = getSafeMethod(value, methodName);
        if (method) {
          value = method(
            ...methodArgs.map((methodArg) => {
              switch (methodArg[0]) {
                case 2:
                  return methodArg[1];
                case 3:
                  return methodArg[1];
                case 4:
                  return () =>
                    this.executeAst(methodArg[1], { _: self, ...parameters });
                default:
                  throw new Error(
                    `Unknown method argument type: ${methodArg[0]}`,
                  );
              }
            }),
          );
        }
      }

      result += value && value.toString ? value.toString() : (value ?? "");
      result += strings[valueIndex + 1] ?? "";
    });
    return result;
  }
}

function getSafeMethod(
  value: unknown,
  methodName: string,
): ((...args: unknown[]) => unknown) | null {
  if (!value) {
    return null;
  }
  if (
    typeof (value as Record<string, unknown>)[methodName] === "function"
  ) {
    return ((value as Record<string, unknown>)[methodName] as (
      ...args: unknown[]
    ) => unknown).bind(value);
  }
  return null;
}
