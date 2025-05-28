import { assertEquals } from "@std/assert/assert-equals";
import { Formatter } from "./formatter.ts";
import { defaultHooks } from "./plugins/default.ts";

Deno.test("formatter, plural", () => {
  const messages = {
    ko: {
      "You have {count} file{count.other:}s{/}.":
        "{count}개의 파일이 있습니다.",
    },
    ar: {
      "You have {count} file{count.other:}s{/}.":
        "{count.zero:}لا يوجد لديك ملفات.{.one:}لديك ملف واحد.{.two:}لديك ملفان.{.few:}لديك {count} ملفات قليلة.{.many:}لديك {count} ملفات كثيرة.{.other:}لديك {count} ملفات.{/}",
    },
  };

  {
    const formatter = new Formatter({
      locale: "en",
      hooks: defaultHooks,
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
      hooks: defaultHooks,
      messages: messages.ko,
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
      hooks: defaultHooks,
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
