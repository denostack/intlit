import { Interpreter } from "./interpreter.ts";
import { defaultHooks } from "./plugins/default.ts";
import type {
  FormatParameters,
  Hook,
  Runtime,
  TaggedTemplateHandler,
} from "./types.ts";

export interface FormatterOptions<Messages extends Record<string, string>> {
  locale?: string;
  messages?: Messages;
  hooks?: Record<string, Hook>;
  taggedTemplate?: TaggedTemplateHandler;
}

export class Formatter<Messages extends Record<string, string>> {
  readonly runtime: Runtime;
  readonly messages: Messages;
  constructor({ messages, ...options }: FormatterOptions<Messages>) {
    this.runtime = new Interpreter(
      {
        locale: options.locale,
        hooks: options.hooks ?? defaultHooks,
        taggedTemplate: options.taggedTemplate,
      },
    );
    this.messages = messages ?? {} as Messages;
  }

  format<MessageId extends keyof Messages>(
    text: MessageId,
    parameters: FormatParameters = {},
  ): string {
    return this.runtime.execute(this.messages[text] ?? text, parameters);
  }
}
