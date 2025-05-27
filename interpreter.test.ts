import { assertEquals } from "@std/assert";
import { Interpreter } from "./interpreter.ts";
import type { FormatParameterValue } from "./types.ts";

Deno.test("interpreter, very simple text", () => {
  const runtime = new Interpreter();

  assertEquals(
    runtime.executeAst([
      ["Hello World"],
      [],
    ], {}),
    "Hello World",
  );
});

Deno.test("interpreter, basic template value", () => {
  const runtime = new Interpreter();

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
  const runtime = new Interpreter();

  const createParams = (name: FormatParameterValue) => ({
    _: name,
    이() {
      this._ += "이";
      return this;
    },
    가() {
      this._ += "가";
      return this;
    },
    toString() {
      return this._;
    },
  });

  assertEquals(
    runtime.executeAst(
      [
        ["", " 없습니다."],
        [
          ["name", [
            ["이", []],
          ]],
        ],
      ],
      { name: "파일" },
      createParams,
    ),
    "파일이 없습니다.",
  );

  assertEquals(
    runtime.executeAst(
      [
        ["", " 없습니다."],
        [
          ["name", [
            ["이", []],
            ["가", []],
          ]],
        ],
      ],
      { name: "파일" },
      createParams,
    ),
    "파일이가 없습니다.",
  );

  // undefined method
  assertEquals(
    runtime.executeAst(
      [
        ["", " 없습니다."],
        [
          ["name", [
            ["이", []],
            ["가", []],
          ]],
        ],
      ],
      { name: "파일" },
    ),
    "파일 없습니다.",
  );
});

Deno.test("interpreter, template with method that returns template", () => {
  const runtime = new Interpreter();

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
    }, (value) => {
      return {
        other(next: () => string) {
          return next();
        },
        female(next: () => string) {
          return next();
        },
        toString() {
          return `${value}`;
        },
      };
    }),
    "Alex added 8 new photos to her steam.",
  );
});
