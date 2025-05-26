export type AstTemplate = [strings: string[], values: AstTemplateValue[]];

export type AstTemplateValue = [name: string, methods: AstMethod[]];

export type AstMethod = [name: string, args: AstAny[]];

export type AstAny = AstArgNumber | AstArgString | AstArgTemplate;

export type AstArgNumber = [type: 2, value: number];
export type AstArgString = [type: 3, value: string];
export type AstArgTemplate = [type: 4, value: AstTemplate];

// export type AstComment = [type: 16];

type Context = [text: string, i: number, depth: number];

export function parse(
  text: string,
): AstTemplate {
  const ctx: Context = [text, 0, 0];

  const [, ast] = parseTemplate(ctx);
  if (ctx[2]) {
    throw new SyntaxError(
      "Expected closing token {/} in Formatter at position " +
        (ctx[1] + 1),
    );
  }
  if (ctx[1] !== ctx[0].length) {
    throw createSyntaxError(ctx);
  }

  return ast;
}

const enum TemplateReturn {
  RETURN,
  NEXT,
  BREAK,
}

function parseTemplate(ctx: Context): [TemplateReturn, AstTemplate] {
  const strings: string[] = [];
  const values: AstTemplateValue[] = [];

  let string = "";

  while (1) {
    if (ctx[1] >= ctx[0].length) {
      break;
    }
    if (!eat(ctx, "{")) {
      string += ctx[0][ctx[1]];
      ctx[1]++;
      continue;
    }
    white(ctx);

    if (ctx[2]) {
      // without consuming "."
      if (ctx[0][ctx[1]] === ".") {
        strings.push(string);
        return [TemplateReturn.NEXT, [strings, values]];
      }
      if (eat(ctx, "/")) {
        strings.push(string);
        return [TemplateReturn.BREAK, [strings, values]];
      }
    }

    strings.push(string);
    string = "";

    white(ctx);

    const value = parseTemplateValue(ctx);
    values.push(value);
    white(ctx);
    if (ctx[0][ctx[1]] !== "}") {
      throw createSyntaxError(ctx);
    }
    ctx[1]++;
  }

  strings.push(string);
  return [TemplateReturn.RETURN, [strings, values]];
}

function parseTemplateValue(ctx: Context): AstTemplateValue {
  const name = varname(ctx);
  const methods: AstMethod[] = [];

  white(ctx);

  while (1) {
    if (eat(ctx, ".")) {
      white(ctx);
      const [ret, method] = parseMethod(ctx);
      methods.push(method);
      white(ctx);
      if (ret === TemplateReturn.BREAK) {
        break;
      }
      continue;
    }
    break;
  }

  return [name, methods];
}

function parseMethod(
  ctx: Context,
): [TemplateReturn.NEXT | TemplateReturn.BREAK, AstMethod] {
  const methodName = varname(ctx);
  const args: AstAny[] = [];
  white(ctx);

  if (eat(ctx, ":")) {
    white(ctx);
    if (eat(ctx, "}")) {
      ctx[2]++;
      const [ret, ast] = parseTemplate(ctx);
      ctx[2]--;
      args.push([4, ast]);
      if (ret === TemplateReturn.NEXT) {
        return [ret, [methodName, args]];
      }
      if (ret === TemplateReturn.BREAK) {
        return [ret, [methodName, args]];
      }
    }
    throw createSyntaxError(ctx);
  }

  return [TemplateReturn.NEXT, [methodName, args]];
}

const RE_VARNAME =
  /^[$_\p{Lu}\p{Ll}\p{Lt}\p{Lm}\p{Lo}\p{Nl}][$_\p{Lu}\p{Ll}\p{Lt}\p{Lm}\p{Lo}\p{Nl}\u200C\u200D\p{Mn}\p{Mc}\p{Nd}\p{Pc}]*/u;

function varname(ctx: Context): string {
  const match = ctx[0].slice(ctx[1]).match(RE_VARNAME);
  if (!match) {
    throw createSyntaxError(ctx);
  }
  ctx[1] += match[0].length;
  return match[0];
}

function white(ctx: Context) {
  while (1) {
    switch (ctx[0][ctx[1]]) {
      case "\t":
      case "\v":
      case "\f":
      case " ":
      case "\u00A0":
      case "\uFEFF":
      case "\n":
      case "\r":
      case "\u2028":
      case "\u2029":
        ctx[1]++;
        break;
      default:
        return;
    }
  }
}

function eat(ctx: Context, c: string): boolean {
  if (ctx[0][ctx[1]] === c) {
    ctx[1]++;
    return true;
  }
  return false;
}

function createSyntaxError(ctx: Context): SyntaxError {
  return new SyntaxError(
    ctx[0][ctx[1]]
      ? `Unexpected token '${ctx[0][ctx[1]]}' in Formatter at position ${
        ctx[1] + 1
      }`
      : "Unexpected end of Formatter input",
  );
}
