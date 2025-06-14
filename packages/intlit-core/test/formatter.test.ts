import { describe, expect, it } from "vitest";
import { text } from "@kokr/text";
import { Formatter } from "../src/formatter";
import { defaultHooks } from "../src/plugins/default";

describe("formatter", () => {
  it("should handle plural forms", () => {
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
        hooks: defaultHooks,
      });

      expect(
        formatter.format(
          "{count, plural, one {# item} other {# items}}",
          { count: 1 },
        ),
      ).toBe("1 item");

      expect(
        formatter.format(
          "{count, plural, one {# item} other {# items}}",
          { count: 2 },
        ),
      ).toBe("2 items");
    }

    {
      const formatter = new Formatter({
        locale: "ko",
        messages: messages.ko,
        taggedTemplate: text,
        hooks: defaultHooks,
      });

      expect(
        formatter.format(
          "{count, plural, one {# 개} other {# 개}}",
          { count: 1 },
        ),
      ).toBe("1 개");
    }

    {
      const formatter = new Formatter({
        locale: "ar",
        messages: messages.ar,
        hooks: defaultHooks,
      });

      expect(
        formatter.format(
          "{count, plural, zero {لا شيء} one {# عنصر} few {# عناصر} many {# عنصر} other {# عنصر}}",
          { count: 0 },
        ),
      ).toBe("لا شيء");

      expect(
        formatter.format(
          "{count, plural, zero {لا شيء} one {# عنصر} few {# عناصر} many {# عنصر} other {# عنصر}}",
          { count: 1 },
        ),
      ).toBe("1 عنصر");

      expect(
        formatter.format(
          "{count, plural, zero {لا شيء} one {# عنصر} few {# عناصر} many {# عنصر} other {# عنصر}}",
          { count: 2 },
        ),
      ).toBe("2 عناصر");

      expect(
        formatter.format(
          "{count, plural, zero {لا شيء} one {# عنصر} few {# عناصر} many {# عنصر} other {# عنصر}}",
          { count: 3 },
        ),
      ).toBe("3 عناصر");

      expect(
        formatter.format(
          "{count, plural, zero {لا شيء} one {# عنصر} few {# عناصر} many {# عنصر} other {# عنصر}}",
          { count: 4 },
        ),
      ).toBe("4 عنصر");

      expect(
        formatter.format(
          "{count, plural, zero {لا شيء} one {# عنصر} few {# عناصر} many {# عنصر} other {# عنصر}}",
          { count: 5 },
        ),
      ).toBe("5 عنصر");
    }
  });
});
