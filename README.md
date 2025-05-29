# Intlit <a href="https://github.com/denostack"><img src="https://raw.githubusercontent.com/denostack/images/main/logo.svg" width="160" align="right" /></a>

<p>
  <a href="https://github.com/denostack/intlit/actions"><img alt="Build" src="https://img.shields.io/github/actions/workflow/status/denostack/intlit/ci.yml?branch=main&logo=github&style=flat-square" /></a>
  <a href="https://codecov.io/gh/denostack/intlit"><img alt="Coverage" src="https://img.shields.io/codecov/c/gh/denostack/intlit?style=flat-square" /></a>
  <img alt="License" src="https://img.shields.io/npm/l/intlit.svg?style=flat-square" />
  <img alt="Language Typescript" src="https://img.shields.io/badge/language-Typescript-007acc.svg?style=flat-square" />
  <br />
  <a href="https://jsr.io/@denostack/intlit"><img alt="JSR version" src="https://jsr.io/badges/@denostack/intlit?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/intlit"><img alt="NPM Version" src="https://img.shields.io/npm/v/intlit.svg?style=flat-square&logo=npm" /></a>
  <a href="https://npmcharts.com/compare/intlit?minimal=true"><img alt="Downloads" src="https://img.shields.io/npm/dt/intlit.svg?style=flat-square" /></a>
</p>

Elevate your internationalization (i18n) workflow with Intlit:
gettext-compatible formatting, simplified plural handling, and first-class
TypeScript support.

## Features

- Simple and intuitive API
- Full TypeScript support for type safety
- Unified key for singular and plural forms (unlike gettext which often requires
  separate `msgid` and `msgid_plural`)
- Includes pluralization support (plugins can be optionally added for more
  features)
- Easy to integrate with existing projects

## Installation

```bash
npm install intlit
```

```typescript
import { Formatter } from "intlit";
```

## Usage

### Basic Usage

```typescript
const formatter = new Formatter({
  locale: "en",
});

const text = formatter.format("Hello World");

console.log(text); // Output: Hello World
```

### Handling Plurals

Intlit provides support for handling plural forms in different languages, making
it easy to create grammatically correct translations.

First, let's see how to set up `Formatter` instances for English, Korean, and
Arabic, including specific message translations for Korean and Arabic. The
pluralization capability is available by default.

```typescript
const formatter = new Formatter({
  locale: "en",
});

// With count = 1 (singular)
console.log(
  formatter.format("You have {count} file{count.other:}s{/}.", { count: 1 }),
); // Output: You have 1 file.

// With count = 2 (plural)
console.log(
  formatter.format("You have {count} file{count.other:}s{/}.", { count: 2 }),
); // Output: You have 2 files.
```

```typescript
const messages = {
  "You have {count} file{count.other:}s{/}.": "{count}개의 파일이 있습니다.",
};

const formatter = new Formatter({
  locale: "ko",
  messages,
});

// With count = 1
console.log(
  formatter.format("You have {count} file{count.other:}s{/}.", { count: 1 }),
); // Output: 1개의 파일이 있습니다.
```

```typescript
const messages = {
  "You have {count} file{count.other:}s{/}.":
    "{count.zero:}لا يوجد لديك ملفات.{.one:}لديك ملف واحد.{.two:}لديك ملفان.{.few:}لديك {_} ملفات قليلة.{.many:}لديك {_} ملفات كثيرة.{.other:}لديك {_} ملفات.{/}",
};

const formatter = new Formatter({
  locale: "ar",
  messages: messages,
});

// Arabic has multiple plural forms (zero, one, two, few, many, other). 🫢

console.log(
  formatter.format("You have {count} file{count.other:}s{/}.", { count: 0 }),
); // Output: لا يوجد لديك ملفات.

console.log(
  formatter.format("You have {count} file{count.other:}s{/}.", { count: 1 }),
); // Output: لديك ملف واحد.

console.log(
  formatter.format("You have {count} file{count.other:}s{/}.", { count: 2 }),
); // Output: لديك ملفان.

console.log(
  formatter.format("You have {count} file{count.other:}s{/}.", { count: 3 }),
); // Output: لديك 3 ملفات قليلة.

console.log(
  formatter.format("You have {count} file{count.other:}s{/}.", { count: 11 }),
); // Output: لديك 11 ملفات كثيرة.

console.log(
  formatter.format("You have {count} file{count.other:}s{/}.", { count: 100 }),
); // Output: لديك 100 ملفات.
```
