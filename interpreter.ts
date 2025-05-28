import type { AstTemplate } from "./ast.ts";
import { parse } from "./parse.ts";
import type {
  FormatParameters,
  Hook,
  HookArg,
  HookContext,
  HookInfo,
  PrimitiveType,
  Runtime,
} from "./types.ts";

export class Interpreter implements Runtime {
  _cache: Map<string, AstTemplate> = new Map();
  _decorator: (source: PrimitiveType) => unknown;

  constructor(hooks: Record<string, Hook>, locale?: string | null) {
    this._decorator = createDecorator(hooks, {
      locale: locale ?? null,
    });
  }

  execute(text: string, parameters: FormatParameters): string {
    let ast = this._cache.get(text);
    if (!ast) {
      ast = parse(text);
      this._cache.set(text, ast);
    }
    return this.executeAst(ast, parameters);
  }

  executeAst(ast: AstTemplate, parameters: FormatParameters): string {
    const [strings, values] = ast;
    let result = strings[0] ?? "";
    values.forEach(([valueName, methods], valueIndex) => {
      const self = parameters[valueName];

      let value = this._decorator(self);
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

function createDecorator(hooks: Record<string, Hook>, info: HookInfo) {
  return (source: PrimitiveType) => {
    const ctx: HookContext = {
      out: null,
      metadata: {},
    };
    const decoratedSource = new Proxy({
      toString() {
        return ctx.out ?? `${source}`;
      },
    }, {
      get(target, prop) {
        if (prop in target) {
          return target[prop as keyof typeof target];
        }
        if (prop in hooks) {
          const hook = hooks[prop as string];
          return (...args: HookArg[]) => {
            const nextOut = hook(source, args, ctx, info);
            ctx.out = nextOut;
            return decoratedSource;
          };
        }
        return undefined;
      },
    });
    return decoratedSource;
  };
}
