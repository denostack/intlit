export type AstTemplate = [strings: string[], values: AstTemplateValue[]];

export type AstTemplateValue = [name: string, methods: AstMethod[]];

export type AstMethod = [name: string, args: AstArg[]];

export type AstArg = AstArgNumber | AstArgString | AstArgTemplate;

export type AstArgNumber = [type: 2, value: number];
export type AstArgString = [type: 3, value: string];
export type AstArgTemplate = [type: 4, value: AstTemplate];

// export type AstComment = [type: 16];
