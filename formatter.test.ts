import { assertEquals } from "@std/assert";
import { Formatter } from "./formatter.ts";
import { Interpreter } from "./interpreter.ts";

Deno.test("formatter, very simple text", () => {
  const formatter = new Formatter(new Interpreter());

  assertEquals(
    formatter.format("Hello World"),
    "Hello World",
  );
});

Deno.test("formatter, basic template value", () => {
  const formatter = new Formatter(new Interpreter());

  assertEquals(
    formatter.format("Hello {target}", {
      target: "World!",
    }),
    "Hello World!",
  );
});

Deno.test("formatter, template value with method", () => {
  const formatter = new Formatter(new Interpreter(), {
    이({ current: self }) {
      if (self === "사과") {
        return "사과가";
      }
      return `${self}이`;
    },
  });

  assertEquals(
    formatter.format("{name.이} 없습니다.", {
      name: "파일",
    }),
    "파일이 없습니다.",
  );
  assertEquals(
    formatter.format("{name.이} 없습니다.", {
      name: "사과",
    }),
    "사과가 없습니다.",
  );
});

Deno.test("formatter, template with method that returns template", () => {
  const formatter = new Formatter(new Interpreter(), {
    one({ self, args, metadata }) {
      if (self == 1) {
        metadata.matched = true;
        return typeof args[0] === "function" ? args[0]() : args[0];
      }
      return "";
    },
    other({ current, args, metadata }) {
      if (!metadata.matched) {
        return typeof args[0] === "function" ? args[0]() : args[0];
      }
      return current;
    },
    male({ self, args, metadata }) {
      if (self === "male") {
        metadata.matched = true;
        return typeof args[0] === "function" ? args[0]() : args[0];
      }
      return "";
    },
    female({ self, args, metadata }) {
      if (self === "female") {
        metadata.matched = true;
        return typeof args[0] === "function" ? args[0]() : args[0];
      }
      return "";
    },
  });

  assertEquals(
    formatter.format(
      "{user} added {photoCount.one:}a new photo{.other:}{_} new photos{/} to {userGender.male:}his{.female:}her{.other:}their{/} steam.",
      {
        user: "Alex",
        photoCount: 3,
        userGender: "female",
      },
    ),
    "Alex added 3 new photos to her steam.",
  );

  assertEquals(
    formatter.format(
      "{user} added {photoCount.one:}a new photo{.other:}{_} new photos{/} to {userGender.male:}his{.female:}her{.other:}their{/} steam.",
      {
        user: "Alex",
        photoCount: 1,
        userGender: "unknown",
      },
    ),
    "Alex added a new photo to their steam.",
  );
});
