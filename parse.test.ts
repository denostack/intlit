import { assertEquals, assertThrows } from "@std/assert";
import { parse } from "./parse.ts";

Deno.test("parse, very simple text", () => {
  assertEquals(
    parse(
      "Hello World",
    ),
    [
      ["Hello World"],
      [],
    ],
  );
});

Deno.test("parse, basic template value", () => {
  for (
    const text of [
      "Hello {target}",
      "Hello { target }",
    ]
  ) {
    assertEquals(
      parse(text),
      [
        ["Hello ", ""],
        [
          ["target", []],
        ],
      ],
    );
  }

  for (
    const text of [
      "{target}",
      "{ target }",
    ]
  ) {
    assertEquals(
      parse(text),
      [
        ["", ""],
        [
          ["target", []],
        ],
      ],
    );
  }

  assertThrows(
    () => {
      parse("Hello {");
    },
    SyntaxError,
    "Unexpected end of Formatter input",
  );
  assertThrows(
    () => {
      parse("Hello {}");
    },
    SyntaxError,
    "Unexpected token '}' in Formatter at position 8",
  );
});

Deno.test("parse, template value with method", () => {
  assertEquals(
    parse(
      "Hello {name.upper}!",
    ),
    [
      ["Hello ", "!"],
      [
        ["name", [
          ["upper", []],
        ]],
      ],
    ],
  );
  assertEquals(
    parse(
      "Hello {name.upper.trim}!",
    ),
    [
      ["Hello ", "!"],
      [
        ["name", [
          ["upper", []],
          ["trim", []],
        ]],
      ],
    ],
  );
});

Deno.test("parse, template with method that returns template", () => {
  for (
    const text of [
      "{user} added {photoCount.one:}a new photo{.other:}{_} new photos{/} to {userGender.male:}his{.female:}her{.other:}their{/} steam.",
      "{ user } added { photoCount . one : }a new photo{ . other : }{ _ } new photos{ / } to { userGender . male : }his{ . female : }her{ . other : }their{ / } steam.",
    ]
  ) {
    assertEquals(
      parse(text),
      [
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
      ],
    );
  }
});
