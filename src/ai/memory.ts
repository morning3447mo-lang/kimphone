export type ChatMemory = {
  id: string;
  text: string;
  createdAt: number;
};

const MEMORY_KEY = 'virtual-phone-ai-memories-v1';

function readAll(): Record<string, ChatMemory[]> {
  try {
    const raw = localStorage.getItem(MEMORY_KEY);
    if (!raw) return {};

    const parsed: unknown = JSON.parse(raw);

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }

    return parsed as Record<string, ChatMemory[]>;
  } catch {
    return {};
  }
}

function writeAll(data: Record<string, ChatMemory[]>): void {
  try {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(data));
  } catch {
    // 即使存储失败，也不影响当前聊天
  }
}

export function getMemories(chatId: string): ChatMemory[] {
  return readAll()[chatId] ?? [];
}

export function remember(chatId: string, text: string): void {
  const cleanText = text.trim();
  if (!chatId || !cleanText) return;

  const data = readAll();
  const list = data[chatId] ?? [];

  const exists = list.some(
    (item) => item.text.toLowerCase() === cleanText.toLowerCase()
  );

  if (exists) return;

  list.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    text: cleanText,
    createdAt: Date.now(),
  });

  data[chatId] = list.slice(-100);
  writeAll(data);
}

export function forgetMemories(chatId: string): void {
  const data = readAll();
  delete data[chatId];
  writeAll(data);
}

/**
 * 只提取明确表达的记忆。
 * 当前是规则识别，不代表 AI 已经具备语义理解能力。
 */

/**
 * 提取用户明确要求记住的信息，以及明显具有长期价值的信息。
 * 这是规则识别，不是完整的语义理解。
 */
export function extractMemory(text: string): string | null {
  const cleanText = text.trim();
  if (!cleanText) return null;

  const patterns = [
    // 用户明确要求记住
    /(?:请记住|记住|你要记得|你记得)[，,：:\s]*(.{2,100})/,

    // 用户的长期喜好
    /(?:我最喜欢|我喜欢|我不喜欢|我讨厌|我更喜欢)(.{1,60})/,

    // 用户的个人信息
    /(?:我的生日是|我生日是|我的名字是|你可以叫我)(.{1,40})/,

    // 明确提及的关系与共同经历
    /(?:我们上次|我们之前|上次露营时|还记得那次)(.{2,80})/,

    // 明确表达的重要约定
    /(?:我们约好了|说好了|以后记得|下次记得)(.{2,80})/,
  ];

  for (const pattern of patterns) {
    const match = cleanText.match(pattern);

    if (match?.[0]) {
      return match[0].trim();
    }
  }

  return null;
}

/**
 * 从 AI 回复中筛选明确提到的重要共同经历。
 * 只保存命中明确关键词的内容，避免普通寒暄进入长期记忆。
 */
export function extractEventMemory(text: string): string | null {
  const cleanText = text.trim();
  if (!cleanText) return null;

  const eventPatterns = [
    /(?:上次露营|那次露营|一起露营|露营的时候).{2,100}/,
    /(?:我们约好了|说好了|答应过你|你答应过我).{2,80}/,
    /(?:生日那天|你的生日|我的生日).{2,80}/,
    /(?:你之前告诉我|你跟我说过|你以前说过).{2,80}/,
  ];

  for (const pattern of eventPatterns) {
    const match = cleanText.match(pattern);
    if (match?.[0]) return match[0].trim();
  }

  return null;
}
