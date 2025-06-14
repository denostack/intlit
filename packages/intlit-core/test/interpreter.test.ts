import { describe, expect, it } from "vitest";
import { Interpreter } from "../src/interpreter";
import { defaultHooks } from "../src/plugins/default";

describe("interpreter", () => {
  it("should handle very simple text", () => {
    const runtime = new Interpreter({});

    expect(
      runtime.executeAst([
        ["Hello World"],
        [],
      ], {}),
    ).toBe("Hello World");
  });

  it("should handle basic template value", () => {
    const runtime = new Interpreter({});

    expect(
      runtime.executeAst([
        ["Hello ", ""],
        [
          ["target", []],
        ],
      ], {
        target: "World!",
      }),
    ).toBe("Hello World!");
  });

  it("should handle template value with method", () => {
    const runtime = new Interpreter({
      hooks: {
        upper: (source, _, ctx) => `${ctx.out ?? source}`.toUpperCase(),
        trim: (source, _, ctx) => `${ctx.out ?? source}`.trim(),
      },
    });

    expect(
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
    ).toBe("Hello ALEX!");

    expect(
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
    ).toBe("Hello ALEX!");

    // undefined method
    expect(
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
    ).toBe("Hello Alex!");
  });

  it("should handle template with method that returns template", () => {
    const runtime = new Interpreter({ hooks: defaultHooks });

    expect(
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
    ).toBe("Alex added 8 new photos to her steam.");
  });
});
