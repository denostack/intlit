import { Formatter, type FormatterOptions } from "./formatter.ts";
import type { FormatParameters } from "./types.ts";

export interface IntlitOptions<Messages extends Record<string, string>>
  extends FormatterOptions {
  messages?: Messages;
}

export class Intlit<Messages extends Record<string, string>> {
  readonly formatter: Formatter;
  readonly messages: Messages;
  constructor({ messages, ...options }: IntlitOptions<Messages>) {
    this.formatter = new Formatter(options);
    this.messages = messages ?? {} as Messages;
  }

  format<MessageId extends keyof Messages>(
    text: MessageId,
    parameters: FormatParameters = {},
  ): string {
    return this.formatter.format(this.messages[text] ?? text, parameters);
  }
}
