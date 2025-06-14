import { describe, expect, it } from "vitest";
import { parse } from "../src/parse";

describe("parse", () => {
  it("should handle very simple text", () => {
    expect(
      parse(
        "Hello World",
      ),
    ).toEqual([
      ["Hello World"],
      [],
    ]);
  });

  it("should handle basic template value", () => {
    for (
      const text of [
        "Hello {target}",
        "Hello { target }",
      ]
    ) {
      expect(parse(text)).toEqual([
        ["Hello ", ""],
        [
          ["target", []],
        ],
      ]);
    }

    for (
      const text of [
        "{target}",
        "{ target }",
      ]
    ) {
      expect(parse(text)).toEqual([
        ["", ""],
        [
          ["target", []],
        ],
      ]);
    }

    expect(() => {
      parse("Hello {");
    }).toThrow(SyntaxError);

    expect(() => {
      parse("Hello {}");
    }).toThrow(SyntaxError);
  });

  it("should handle template value with method", () => {
    expect(
      parse(
        "Hello {name.upper}!",
      ),
    ).toEqual([
      ["Hello ", "!"],
      [
        ["name", [
          ["upper", []],
        ]],
      ],
    ]);

    expect(
      parse(
        "Hello {name.upper.trim}!",
      ),
    ).toEqual([
      ["Hello ", "!"],
      [
        ["name", [
          ["upper", []],
          ["trim", []],
        ]],
      ],
    ]);
  });

  it("should handle template with method that returns template", () => {
    for (
      const text of [
        "{user} added {photoCount.one:}a new photo{.other:}{_} new photos{/} to {userGender.male:}his{.female:}her{.other:}their{/} steam.",
        "{ user } added { photoCount . one : }a new photo{ . other : }{ _ } new photos{ / } to { userGender . male : }his{ . female : }her{ . other : }their{ / } steam.",
      ]
    ) {
      expect(parse(text)).toEqual([
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
      ]);
    }
  });
});
