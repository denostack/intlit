import { assertEquals } from "@std/assert/assert-equals";
import { Intlit } from "./intlit.ts";
import { pluralPlugin } from "./plugins/plural.ts";

Deno.test("intlit, plural", () => {
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
    const intlit = new Intlit({
      locale: "en",
      plugin: pluralPlugin,
    });

    assertEquals(
      intlit.format("You have {count} file{count.other:}s{/}.", { count: 1 }),
      "You have 1 file.",
    );
    assertEquals(
      intlit.format("You have {count} file{count.other:}s{/}.", { count: 2 }),
      "You have 2 files.",
    );
  }

  {
    const intlit = new Intlit({
      locale: "ko",
      plugin: pluralPlugin,
      messages: messages.ko,
    });

    assertEquals(
      intlit.format("You have {count} file{count.other:}s{/}.", { count: 1 }),
      "1개의 파일이 있습니다.",
    );
  }
  {
    const intlit = new Intlit({
      locale: "ar",
      plugin: pluralPlugin,
      messages: messages.ar,
    });

    assertEquals(
      intlit.format("You have {count} file{count.other:}s{/}.", { count: 0 }),
      "لا يوجد لديك ملفات.",
    );
    assertEquals(
      intlit.format("You have {count} file{count.other:}s{/}.", { count: 1 }),
      "لديك ملف واحد.",
    );
    assertEquals(
      intlit.format("You have {count} file{count.other:}s{/}.", { count: 2 }),
      "لديك ملفان.",
    );
    assertEquals(
      intlit.format("You have {count} file{count.other:}s{/}.", { count: 3 }),
      "لديك 3 ملفات قليلة.",
    );
    assertEquals(
      intlit.format("You have {count} file{count.other:}s{/}.", { count: 11 }),
      "لديك 11 ملفات كثيرة.",
    );
    assertEquals(
      intlit.format("You have {count} file{count.other:}s{/}.", { count: 100 }),
      "لديك 100 ملفات.",
    );
  }
});
