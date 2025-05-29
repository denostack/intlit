import { assertEquals } from "@std/assert/assert-equals";
import { text } from "@kokr/text";
import { Formatter } from "./formatter.ts";

Deno.test("formatter, plural", () => {
  const messages = {
    ko: {
      "You have {count} file{count.other:}s{/}.":
        "{count}개의 파일이 있습니다.",
    },
    ar: {
      "You have {count} file{count.other:}s{/}.":
        "{count.zero:}لا يوجد لديك ملفات.{.one:}لديك ملف واحد.{.two:}لديك ملفان.{.few:}لديك {_} ملفات قليلة.{.many:}لديك {_} ملفات كثيرة.{.other:}لديك {_} ملفات.{/}",
    },
  };

  {
    const formatter = new Formatter({
      locale: "en",
    });

    assertEquals(
      formatter.format("You have {count} file{count.other:}s{/}.", {
        count: 1,
      }),
      "You have 1 file.",
    );
    assertEquals(
      formatter.format("You have {count} file{count.other:}s{/}.", {
        count: 2,
      }),
      "You have 2 files.",
    );
  }

  {
    const formatter = new Formatter({
      locale: "ko",
      messages: messages.ko,
      taggedTemplate: text,
    });

    assertEquals(
      formatter.format("You have {count} file{count.other:}s{/}.", {
        count: 1,
      }),
      "1개의 파일이 있습니다.",
    );
  }
  {
    const formatter = new Formatter({
      locale: "ar",
      messages: messages.ar,
    });

    assertEquals(
      formatter.format("You have {count} file{count.other:}s{/}.", {
        count: 0,
      }),
      "لا يوجد لديك ملفات.",
    );
    assertEquals(
      formatter.format("You have {count} file{count.other:}s{/}.", {
        count: 1,
      }),
      "لديك ملف واحد.",
    );
    assertEquals(
      formatter.format("You have {count} file{count.other:}s{/}.", {
        count: 2,
      }),
      "لديك ملفان.",
    );
    assertEquals(
      formatter.format("You have {count} file{count.other:}s{/}.", {
        count: 3,
      }),
      "لديك 3 ملفات قليلة.",
    );
    assertEquals(
      formatter.format("You have {count} file{count.other:}s{/}.", {
        count: 11,
      }),
      "لديك 11 ملفات كثيرة.",
    );
    assertEquals(
      formatter.format("You have {count} file{count.other:}s{/}.", {
        count: 100,
      }),
      "لديك 100 ملفات.",
    );
  }
});
