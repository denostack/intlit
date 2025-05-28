import { Interpreter } from "./interpreter.ts";
import { defaultHooks } from "./plugins/default.ts";
import type { FormatParameters, Hook, Runtime } from "./types.ts";

export interface FormatterOptions<Messages extends Record<string, string>> {
  locale?: string;
  messages?: Messages;
  hooks?: Record<string, Hook>;
}

export class Formatter<Messages extends Record<string, string>> {
  readonly runtime: Runtime;
  readonly messages: Messages;
  constructor({ messages, ...options }: FormatterOptions<Messages>) {
    this.runtime = new Interpreter(
      options.hooks ?? defaultHooks,
      options.locale,
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
