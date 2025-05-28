import { assertEquals } from "@std/assert";
import { Interpreter } from "./interpreter.ts";
import { defaultHooks } from "./plugins/default.ts";

Deno.test("interpreter, very simple text", () => {
  const runtime = new Interpreter({});

  assertEquals(
    runtime.executeAst([
      ["Hello World"],
      [],
    ], {}),
    "Hello World",
  );
});

Deno.test("interpreter, basic template value", () => {
  const runtime = new Interpreter({});

  assertEquals(
    runtime.executeAst([
      ["Hello ", ""],
      [
        ["target", []],
      ],
    ], {
      target: "World!",
    }),
    "Hello World!",
  );
});

Deno.test("interpreter, template value with method", () => {
  const runtime = new Interpreter({
    upper: (source, _, ctx) => `${ctx.out ?? source}`.toUpperCase(),
    trim: (source, _, ctx) => `${ctx.out ?? source}`.trim(),
  });

  assertEquals(
    runtime.executeAst(
      [
        ["Hello ", "!"],
        [
          ["name", [
            ["upper", []],
          ]],
        ],
      ],
      { name: "Alex" },
    ),
    "Hello ALEX!",
  );

  assertEquals(
    runtime.executeAst(
      [
        ["Hello ", "!"],
        [
          ["name", [
            ["upper", []],
            ["trim", []],
          ]],
        ],
      ],
      { name: "  Alex" },
    ),
    "Hello ALEX!",
  );

  // undefined method
  assertEquals(
    runtime.executeAst(
      [
        ["Hello ", "!"],
        [
          ["name", [
            ["unknown", []],
          ]],
        ],
      ],
      { name: "Alex" },
    ),
    "Hello Alex!",
  );
});

Deno.test("interpreter, template with method that returns template", () => {
  const runtime = new Interpreter(defaultHooks);

  assertEquals(
    runtime.executeAst([
      ["", " added ", " to ", " steam."],
      [
        ["user", []],
        ["photoCount", [
          ["one", [
            [4, [["a new photo"], []]],
          ]],
          ["other", [
            [4, [["", " new photos"], [["_", []]]]],
          ]],
        ]],
        ["userGender", [
          ["male", [
            [4, [["his"], []]],
          ]],
          ["female", [
            [4, [["her"], []]],
          ]],
          ["other", [
            [4, [["their"], []]],
          ]],
        ]],
      ],
    ], {
      user: "Alex",
      photoCount: 8,
      userGender: "female",
    }),
    "Alex added 8 new photos to her steam.",
  );
});
