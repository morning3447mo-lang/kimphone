
import { defaultRole, buildRolePrompt } from "./roleConfig";
import { getMemories } from "./memory";

export function buildConversationContext(
  chatId: string,
  userText: string,
  recentMessages: string[] = [],
): string {
  const memories = getMemories(chatId);

  return [
    buildRolePrompt(defaultRole),
    "",
    "用户已经明确表达的记忆：",
    memories.length
      ? memories.map((item) => `- ${item.text}`).join("\n")
      : "暂无已保存的记忆",
    "",
    "最近的对话：",
    recentMessages.slice(-10).join("\n") || "暂无历史对话",
    "",
    `用户最新消息：${userText}`,
  ].join("\n");
}


export function generateMockReply(
  text: string,
  chatId: string,
): string {
  const cleanText = text.trim();
  const memories = getMemories(chatId);

  if (!cleanText) {
    return "嗯？怎么啦，링링아？";
  }

  // 优先处理明确的记忆提问，避免被“喜欢”等词抢先匹配
  if (/记得|记住|还记得|忘了/.test(cleanText)) {
    if (memories.length > 0) {
      const latest = memories[memories.length - 1];
      return `当然记得呀！你之前跟我说过：“${latest.text}” ♡`;
    }
    return "음……我想认真记住你说的事情！你再告诉我一次好不好？";
  }

  // 难过、情绪低落
  if (/难过|伤心|委屈|崩溃|哭|心情不好/.test(cleanText)) {
    return "링링아，怎么啦？谁让你不开心了？跟我说说，我听着呢。";
  }

  // 工作疲惫
  if (/累|疲惫|加班|辛苦|烦死了|好烦/.test(cleanText)) {
    return "今天辛苦啦。先休息一会儿嘛，不要什么事情都自己扛着，好不好？";
  }

  // 早晚问候
  if (/晚安|睡觉|困了|要睡了/.test(cleanText)) {
    return "好～那就乖乖睡觉！晚安，링링아，做个好梦 ♡";
  }

  if (/早安|早上好|起床了/.test(cleanText)) {
    return "早上好呀！링링今天也要元气满满哦～";
  }

  // 询问喜欢谁：必须在一般的“喜欢”判断之前
  if (/喜欢谁|最喜欢谁|爱谁/.test(cleanText)) {
    const favorite = memories.find((item) =>
      /喜欢|最爱|爱的是/.test(item.text)
    );

    if (favorite) {
      return `你之前跟我说过：“${favorite.text}”ㅋㅋ 我有好好记着呢！`;
    }

    return "ㅋㅋㅋ 这个问题是在考我吗？给我一点提示嘛～";
  }

  // 用户表达想念
  if (/想你|想我|想念/.test(cleanText)) {
    return "ㅋㅋㅋ 真的想我啦？我也想听听你今天都做了什么～";
  }

  // 用户表达喜欢
  if (/喜欢我|爱你|喜欢你|告白/.test(cleanText)) {
    return "真的呀？ㅋㅋ 突然这样说，我都有点不好意思了。♡";
  }

  // 用户分享自己喜欢的东西
  if (/我喜欢|我最喜欢|我不喜欢|我讨厌/.test(cleanText)) {
    return "哦～原来你喜欢这个呀！我先记下来，之后还想听你多讲一点ㅋㅋ";
  }

  if (/[?？吗呢]/.test(cleanText)) {
    return "음～这个嘛ㅋㅋ 你再跟我多说一点？我想听！";
  }

  // 普通聊天：根据内容选择不同回复
  const replies = [
    "ㅋㅋㅋ 然后呢？继续跟我说嘛～",
    "我在认真听哦！还有什么想分享的？",
    "原来是这样呀 ♡ 你跟我说这些，我还挺开心的。",
    "哈哈哈，링링怎么这么可爱！",
    "嗯嗯，知道啦～然后后来怎么样了？",
    "真的？ㅋㅋㅋ 再多跟我讲一点嘛。",
  ];

  let hash = 0;
  for (let i = 0; i < cleanText.length; i++) {
    hash = (hash * 31 + cleanText.charCodeAt(i)) >>> 0;
  }

  return replies[hash % replies.length];
}

