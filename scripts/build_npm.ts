import { build, emptyDir } from "@deno/dnt";
import { bgGreen } from "@std/fmt/colors";

const denoInfo = JSON.parse(
  Deno.readTextFileSync(new URL("../deno.json", import.meta.url)),
);
const version = denoInfo.version;

console.log(bgGreen(`version: ${version}`));

await emptyDir("./.npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./.npm",
  shims: {
    deno: false,
  },
  test: false,
  compilerOptions: {
    lib: ["ES2021", "DOM"],
  },
  package: {
    name: "intlit",
    version,
    description: "A comprehensive Intl formatter.",
    keywords: [
      "intl",
      "formatter",
      "i18n",
      "gettext",
    ],
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/denostack/intlit.git",
    },
    bugs: {
      url: "https://github.com/denostack/intlit/issues",
    },
  },
});

// post build steps
Deno.copyFileSync("README.md", ".npm/README.md");
