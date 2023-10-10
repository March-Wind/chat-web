declare global {
  // 全局变量
  let example1: string;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.jpeg' {
  const value: string;
  export = value;
}

declare module '*.jpg' {
  const value: string;
  export = value;
}

declare module '*.png' {
  const value: string;
  export = value;
}

declare module '*.svg' {
  const value: string;
  export = value;
}

declare module '*.gif' {
  const value: string;
  export = value;
}

declare module '*.ico' {
  const value: string;
  export = value;
}

declare module '*.webp' {
  const value: string;
  export = value;
}

declare module '*.jp2' {
  const value: string;
  export = value;
}

// export { };
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  id: string;
}

interface Prompt {
  id: string;
  avatar: string;
  name: string;
  modelConfig: {
    temperature: number; // 0-2
  };
  context?: Message[];
}
interface Topic {
  createTime: number;
  lastUpdateTime: number;
  messages: Message[];
  title?: string | undefined;
  id: string;
  prePrompt?: Prompt;
  messagesCount: number;
}
