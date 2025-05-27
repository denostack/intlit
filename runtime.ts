export interface Runtime {
  execute(text: string, args: Record<string, unknown>): string;
}
