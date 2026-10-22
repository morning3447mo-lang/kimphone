type TranslationDirection = 'ko-zh' | 'zh-ko';

/**
 * 使用现有 /api/chat 接口进行中韩双向翻译。
 * 不修改原消息，也不直接发送消息。
 */
export async function translateText(
  text: string,
  direction: TranslationDirection
): Promise<string> {
  const input = text.trim();

  if (!input) {
    throw new Error('请先输入需要翻译的内容。');
  }

  const instruction =
    direction === 'ko-zh'
      ? `将下面的韩语翻译成自然、准确的简体中文。
保留原文的语气、语气词、昵称、网络用语和表情。
不要总结，不要解释，不要重复原文，只输出中文译文。`
      : `将下面的中文翻译成自然、地道的韩国年轻人日常聊天韩语。
使用适合 KakaoTalk 的口语表达，保留原文的语气、昵称、语气词和表情。
不要添加原文没有的意思，不要解释，只输出韩文译文。`;

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'system',
          content: instruction,
        },
        {
          role: 'user',
          content: input,
        },
      ],
    }),
  });

  const responseText = await response.text();

  let data: { reply?: string; error?: string };

  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error('翻译服务返回内容异常，请稍后重试。');
  }

  if (!response.ok) {
    throw new Error(data.error || `翻译失败（${response.status}）`);
  }

  const result = data.reply?.trim();

  if (!result) {
    throw new Error('没有获取到译文，请重试。');
  }

  return result;
}
