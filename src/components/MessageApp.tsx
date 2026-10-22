import { useState, useEffect, useRef } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import {
  extractMemory,
  extractEventMemory,
  remember,
  getMemories,
} from '../ai/memory';
import { openLines, endLines } from '../ai/treasureChatData';
import {
  campChatBasePrompt,
  campMemberSystemPrompt,
} from '../ai/treasureCampPreChat.ts';
import treasureMemberList from '../ai/treasureMemberList';
import { translateText } from '../ai/translator';
type Message = {
  id: number;
  text: string;
  fromMe: boolean;
  time: string;
  senderId?: string;
  senderName?: string;
  date?: string;
};

type Chat = {
  id: string;
  name: string;
  avatar: string;
  preview: string;
  time: string;
  messages: Message[];
  isGroup?: boolean;
  unread?: number;
};

type Member = {
  id: string;
  name: string;
  avatar: string;
  koreanName: string;
  style: string;
};

const STORAGE_KEY = 'my-virtual-phone-chats-v4';
const TRANSLATION_SETTING_KEY = 'my-virtual-phone-translation-enabled';
const GROUP_ID = 'treasure-group';

const members: Member[] = [
  {
    id: 'hyunsuk',
    name: '崔玹硕',
    koreanName: '현석',
    avatar: '🦔',
    style: '有创意，聊音乐时认真，也会轻松开玩笑。',
  },
  {
    id: 'jihoon',
    name: '志焄',
    koreanName: '지훈',
    avatar: '🐶',
    style: '直接、反应快，擅长推进话题和自然吐槽。',
  },
  {
    id: 'yoshi',
    name: 'YOSHI',
    koreanName: '요시',
    avatar: '🐯',
    style: '温和细腻，有自己的想法，可以聊音乐和生活。',
  },
  {
    id: 'junkyu',
    name: '金俊奎',
    koreanName: '준규',
    avatar: '🐨',
    style: '幽默随性，有时认真，有时突然接梗。',
  },
  {
    id: 'jaehyuk',
    name: '尹材赫',
    koreanName: '재혁',
    avatar: '🦁',
    style: '亲切自然，善于接话和表达关心。',
  },
  {
    id: 'asahi',
    name: 'ASAHI',
    koreanName: '아사히',
    avatar: '🤖',
    style: '表达简洁，有独特幽默感和自己的节奏。',
  },
  {
    id: 'haruto',
    name: 'HARUTO',
    koreanName: '하루토',
    avatar: '🦋',
    style: '直接自然，熟悉时会吐槽和开玩笑。',
  },
  {
    id: 'jeongwoo',
    name: '朴正禹',
    koreanName: '정우',
    avatar: '🐺',
    style: '活跃，擅长接梗，也有平静认真的时候。',
  },
  {
    id: 'junghwan',
    name: '苏庭焕',
    koreanName: '정환',
    avatar: '🐮',
    style: '有自己的想法，熟悉时会拌嘴，也会认真回应。',
  },
];

const memberMap = new Map(members.map((member) => [member.id, member]));

const basePrompt = `
你正在参与一个虚构的 TREASURE 同人手机社交模拟。
用户扮演金道荣（DOYOUNG），你只扮演当前指定的其他成员。
不要声称自己是真人本人，不要编造真实的私人事件或未公开行程。

${campChatBasePrompt}

请像真实即时聊天一样简短、自然、有上下文，通常回复一两句。
中文输入时以中文为主；韩语输入时优先用自然韩语。
不要每次都反问、说想念或机械使用爱心。
`;

function getMemberPersona(memberId: string): string {
  const persona = treasureMemberList.find((item) => item.id === memberId);

  if (!persona) {
    return '';
  }

  return `
【成员身份】
${persona.nameCn}（${persona.nameKr}）
昵称：${persona.nickname}
生日：${persona.birthday}
定位：${persona.position}

【性格与聊天语气】
${persona.chatTone}

【与道荣的关系】
${persona.withDoyoung}

【个人特点】
${persona.tmiList.map((item) => `- ${item}`).join('\n')}

【露营回忆】
${persona.campEasterEgg}

【练习生时期回忆】
${persona.traineeEasterEgg}

【回归话题规则】
${persona.comebackTalkRule}

【剧情事件参考】
${persona.mcEndingLine}

以上内容是角色设定和剧情素材。请根据当前对话自然使用，不要每次全部复述，也不要把背景资料直接当作用户刚刚说过的话。
`;
}

function getTime() {
  return new Date().toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function getDate() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0'
  )}-${String(date.getDate()).padStart(2, '0')}`;
}

function getMember(id: string) {
  return memberMap.get(id);
}

function makeSeedMessage(
  id: number,
  text: string,
  fromMe: boolean,
  senderId: string,
  senderName: string
): Message {
  return {
    id,
    text,
    fromMe,
    senderId,
    senderName,
    time: getTime(),
    date: getDate(),
  };
}

function createInitialChats(): Chat[] {
  const groupSeed: [string, string][] = [
    ['hyunsuk', '이번 컴백 준비하면서 다들 제일 기대되는 거 뭐야?'],
    ['jihoon', '일단 다들 잠은 좀 자면서 하자 ㅋㅋㅋ'],
    ['junkyu', '지훈이 형이 그런 말 하니까 더 웃긴데 ㅋㅋ'],
    ['doyoung', 'ㅋㅋㅋㅋ 근데 이번에 녹음할 때 다들 분위기 좋지 않았어?'],
    ['jaehyuk', '맞아 나 녹음 끝나고도 계속 생각났어 ㅎㅎ'],
    ['asahi', '나는 작업실에서 듣던 부분이 계속 생각나'],
    ['haruto', '아사히 형 또 혼자 다른 세계에 있네 ㅋㅋ'],
    ['yoshi', '그래도 이번 분위기 되게 좋았던 것 같아'],
    ['junghwan', '형들 근데 오늘 연습 끝나고 뭐 먹어요?'],
    ['doyoung', '결국 밥 얘기로 끝나는 거야? ㅋㅋㅋㅋ'],
    ['jihoon', '중요하지. 컴백 준비도 밥심이야'],
    ['junkyu', '그럼 도영이가 메뉴 정해줘 🍚'],
  ];

  const groupMessages = groupSeed.map(([senderId, text], index) => {
    const member = getMember(senderId);
    const fromMe = senderId === 'doyoung';
    return makeSeedMessage(
      1000 + index,
      text,
      fromMe,
      senderId,
      fromMe ? 'DOYOUNG' : member?.name ?? senderId
    );
  });

  const groupChat: Chat = {
    id: GROUP_ID,
    name: 'TREASURE 💎',
    avatar: '💎',
    preview: '준규: 그럼 도영이가 메뉴 정해줘 🍚',
    time: getTime(),
    messages: groupMessages,
    isGroup: true,
  };

  const privateSeeds: Record<string, [string, string][]> = {
    hyunsuk: [
      ['member', '도영아 오늘 연습할 때 그 부분 기억나? ㅋㅋ'],
      ['doyoung', '기억나지 형 ㅋㅋ 집에 와서도 생각났어'],
      ['member', '이번엔 디테일 조금만 더 맞추면 진짜 좋을 것 같아'],
      ['doyoung', '내일 같이 한 번 더 맞춰보자!'],
    ],
    jihoon: [
      ['member', '도영아 내일 몇 시쯤 연습실 올 거야?'],
      ['doyoung', '나 평소처럼 갈 것 같은데 왜?'],
      ['member', '먼저 맞춰볼 부분이 있어서. 늦지만 마 ㅋㅋ'],
      ['doyoung', 'ㅋㅋㅋㅋ 형이 더 일찍 와 있어야 돼'],
    ],
    yoshi: [
      ['member', '도영아 요즘 자주 듣는 노래 있어?'],
      ['doyoung', '요즘은 작업 끝나고 조용한 노래 듣는 게 좋더라'],
      ['member', '오 나도. 밤에 들으면 더 좋은 것 같아'],
      ['doyoung', '맞아 그래서 집에 가는 길에 계속 듣게 돼'],
    ],
    junkyu: [
      ['member', '도영아 나 오늘 웃긴 거 봤어 ㅋㅋㅋㅋ'],
      ['doyoung', '뭔데 ㅋㅋㅋㅋ 벌써 웃긴데'],
      ['member', '말로 설명하면 안 웃길 것 같아서 다음에 보여줄게'],
      ['doyoung', '아니 그럼 왜 말했어 ㅋㅋㅋㅋ'],
    ],
    jaehyuk: [
      ['member', '도영아 오늘 고생했어!!'],
      ['doyoung', '재혁이도 고생했어 ㅎㅎ'],
      ['member', '연습 끝나고 나니까 뭔가 뿌듯하더라'],
      ['doyoung', '나도. 조금씩 맞아가는 느낌이야'],
    ],
    asahi: [
      ['member', '도영아 이거 들어봐'],
      ['doyoung', '오 뭐야? 직접 만든 거야?'],
      ['member', '응 그냥 생각나서 조금 해봤어'],
      ['doyoung', '좋은데? 나중에 더 들려줘'],
    ],
    haruto: [
      ['member', '도영이 형 오늘 왜 이렇게 조용했어요 ㅋㅋ'],
      ['doyoung', '내가? 너가 말을 안 걸었잖아 ㅋㅋ'],
      ['member', '아니 형도 먼저 걸 수 있잖아요'],
      ['doyoung', '알겠어 다음엔 내가 먼저 걸게 ㅋㅋㅋ'],
    ],
    jeongwoo: [
      ['member', '도영이 형 오늘 그거 봤어요? ㅋㅋㅋㅋ'],
      ['doyoung', '뭘 봤는데 이렇게 신났어 ㅋㅋ'],
      ['member', '아 지금 말하면 재미없는데!'],
      ['doyoung', '아 진짜 궁금하게 하네 ㅋㅋㅋ'],
    ],
    junghwan: [
      ['member', '도영이 형 오늘 연습 끝나고 바로 갔어요?'],
      ['doyoung', '응 ㅋㅋ 왜, 할 말 있었어?'],
      ['member', '아니 그냥 물어본 건데요 ㅎㅎ'],
      ['doyoung', '뭔가 숨기는 것 같은데? ㅋㅋ'],
    ],
  };

  const privateChats: Chat[] = members.map((member, index) => {
    const seed = privateSeeds[member.id] ?? [
      ['member', '도영아 지금 뭐 해? ㅎㅎ'],
      ['doyoung', '나 잠깐 쉬고 있어. 너는?'],
      ['member', '나도 잠깐 쉬는 중이야 ㅋㅋ'],
    ];

    const messages = seed.map(([from, text], messageIndex) => {
      const fromMe = from === 'doyoung';
      return makeSeedMessage(
        2000 + index * 10 + messageIndex,
        text,
        fromMe,
        fromMe ? 'doyoung' : member.id,
        fromMe ? 'DOYOUNG' : member.name
      );
    });

    const last = messages[messages.length - 1];
    return {
      id: member.id,
      name: member.name,
      avatar: member.avatar,
      preview: last?.text ?? '',
      time: last?.time ?? getTime(),
      messages,
    };
  });

  return [groupChat, ...privateChats];
}

function loadInitialChats(): Chat[] {
  const defaults = createInitialChats();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;

    const saved: unknown = JSON.parse(raw);
    if (!Array.isArray(saved)) return defaults;

    return defaults.map((initial) => {
      const previous = saved.find(
        (item: unknown) =>
          typeof item === 'object' &&
          item !== null &&
          'id' in item &&
          item.id === initial.id
      ) as Chat | undefined;

      if (
        previous &&
        Array.isArray(previous.messages) &&
        typeof previous.name === 'string'
      ) {
        return {
          ...initial,
          ...previous,
          messages: previous.messages.filter(
            (message) =>
              message &&
              typeof message.text === 'string' &&
              typeof message.fromMe === 'boolean'
          ),
        };
      }
      return initial;
    });
  } catch {
    return defaults;
  }
}

function getSavedMemoryContext(chatId: string) {
  try {
    const memories = getMemories(chatId);
    if (!Array.isArray(memories)) return '';
    return memories
      .map((item) =>
        typeof item === 'string'
          ? item
          : String(
              (item as { text?: string; content?: string }).text ??
                (item as { content?: string }).content ??
                ''
            )
      )
      .filter(Boolean)
      .join('\n');
  } catch {
    return '';
  }
}

const buttonBase: CSSProperties = {
  border: 0,
  background: 'transparent',
  color: '#191919',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

function getSenderKey(message: Message) {
  if (message.fromMe) return 'doyoung';
  return message.senderId || message.senderName || 'other';
}

export default function MessageApp({ onBack }: { onBack?: () => void }) {
  const [chats, setChats] = useState<Chat[]>(loadInitialChats);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [search, setSearch] = useState('');
  const [sending, setSending] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [callElapsed, setCallElapsed] = useState(0);
  const [callStatus, setCallStatus] = useState<'calling' | 'connected'>(
    'calling'
  );
  const [callOpening, setCallOpening] = useState('');
  const [callEnding, setCallEnding] = useState('');
  const [activeTab, setActiveTab] = useState<
    'friends' | 'chats' | 'discover' | 'open' | 'shopping' | 'more'
  >('chats');
  const [showMoreTools, setShowMoreTools] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [translationEnabled, setTranslationEnabled] = useState(() => {
    try {
      return localStorage.getItem(TRANSLATION_SETTING_KEY) !== 'false';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(TRANSLATION_SETTING_KEY, String(translationEnabled));
    } catch {
      // 本地存储不可用时，不影响聊天功能
    }
  }, [translationEnabled]);
  const [showNewChat, setShowNewChat] = useState(false);
  const [chatSearchOpen, setChatSearchOpen] = useState(false);
  const [chatSearch, setChatSearch] = useState('');
  const [notice, setNotice] = useState('');
  const [statusText, setStatusText] = useState('TREASURE와 함께하는 하루 💎');
  // 收到的消息翻译
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [translatingId, setTranslatingId] = useState<string | null>(null);

  // 中文转韩文
  const [draftTranslation, setDraftTranslation] = useState('');
  const [translatingDraft, setTranslatingDraft] = useState(false);
  const [translationError, setTranslationError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const callTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
    } catch {
      // 本地存储不可用时不影响页面显示
    }
  }, [chats]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [activeChatId, chats, sending]);

  useEffect(() => {
    if (!callActive || callStatus !== 'connected') return;
    const timer = window.setInterval(
      () => setCallElapsed((value) => value + 1),
      1000
    );
    return () => window.clearInterval(timer);
  }, [callActive, callStatus]);

  useEffect(() => {
    return () => {
      if (callTimeoutRef.current !== null)
        window.clearTimeout(callTimeoutRef.current);
    };
  }, []);

  const activeChat = chats.find((chat) => chat.id === activeChatId);
  const activeMember =
    activeChat && !activeChat.isGroup ? getMember(activeChat.id) : undefined;
  // 将收到的消息翻译成中文，不覆盖原文
  async function translateReceivedMessage(message: Message) {
    const chatId = activeChatId;
    if (!chatId || message.fromMe) return;

    const key = `${chatId}:${message.id}`;

    if (translations[key]) {
      setTranslations((current) => {
        const next = { ...current };
        delete next[key];
        return next;
      });
      return;
    }

    setTranslatingId(key);
    setTranslationError('');

    try {
      const result = await translateText(message.text, 'ko-zh');
      setTranslations((current) => ({ ...current, [key]: result }));
    } catch (error) {
      setTranslationError(
        error instanceof Error ? error.message : '翻译失败，请重试。'
      );
    } finally {
      setTranslatingId(null);
    }
  }

  // 将输入框中的中文翻译成韩文
  async function translateDraftToKorean() {
    if (!draft.trim() || translatingDraft || sending) return;

    setTranslatingDraft(true);
    setTranslationError('');
    setDraftTranslation('');

    try {
      const result = await translateText(draft, 'zh-ko');
      setDraftTranslation(result);
    } catch (error) {
      setTranslationError(
        error instanceof Error ? error.message : '翻译失败，请重试。'
      );
    } finally {
      setTranslatingDraft(false);
    }
  }
  async function sendMessage(textOverride?: string) {
    const text = (textOverride ?? draft).trim();
    const chatId = activeChatId;
    if (!text || !chatId || sending) return;

    const chat = chats.find((item) => item.id === chatId);
    if (!chat) return;

    const time = getTime();
    const userMessage: Message = {
      id: Date.now(),
      text,
      fromMe: true,
      time,
      date: getDate(),
      senderId: 'doyoung',
      senderName: 'DOYOUNG',
    };

    if (textOverride === undefined) {
      setDraft('');
    } else {
      setDraftTranslation('');
      setDraft('');
    }

    setSending(true);

    setChats((current) =>
      current.map((item) =>
        item.id === chatId
          ? {
              ...item,
              preview: text,
              time,
              messages: [...item.messages, userMessage],
            }
          : item
      )
    );

    try {
      const memoryText = extractMemory(text);
      if (memoryText) remember(chatId, memoryText);
      const memoryContext = getSavedMemoryContext(chatId);

      const recentHistory = chat.messages.slice(-18).map((message) => ({
        role: message.fromMe ? 'user' : 'assistant',
        content: chat.isGroup
          ? `${message.senderName ?? message.senderId ?? '成员'}：${
              message.text
            }`
          : message.text,
      }));

      let rolePrompt: string;

      if (chat.isGroup) {
        const groupPersonas = members
          .filter((member) => member.id !== 'doyoung')
          .map((member) => {
            return `【成员 ID：${member.id}】
${getMemberPersona(member.id)}`;
          })
          .join('\n\n');

        rolePrompt = `${basePrompt}

【当前聊天的已保存记忆】
${
  memoryContext ||
  '暂无已保存的特别记忆。请依据当前聊天历史自然回应，不要凭空编造过去发生的事。'
}

【当前场景：TREASURE 群聊】

用户扮演金道荣（DOYOUNG）。你负责生成其他成员在群聊中发送的消息。

【全体成员的专属人设】
${groupPersonas}

【群聊互动规则】
- 严格遵守每位成员各自的人设、聊天语气、与道荣的关系和年龄称呼。
- 让成员根据自己的性格自然接话，不要九个人轮流发言。
- 通常生成 1 条消息，有时 2 条，少数时候 3 条。
- 多人接话时，第二位成员要自然回应上一条消息，而不是重复回答用户。
- 每条消息必须来自不同成员。
- 不要替道荣发言。
- 不要声称知道其他私聊中的内容。
- 可以自然提起露营和练习生时期的共同回忆，但不要每次都提。
- 回归话题必须遵守对应成员的保密规则，不得自行编造或透露歌曲、歌词、编舞等细节。
- 只有当前对话提供了相关信息时，才可以回应对应剧情事件。
- mcEndingLine 是剧情素材，不是每次都要照抄的固定台词。

【输出格式】
只输出合法 JSON，不要使用 Markdown 代码块：
{
  "messages": [
    {
      "memberId": "成员ID",
      "text": "消息正文"
    }
  ]
}

可用成员 ID：
${members
  .filter((member) => member.id !== 'doyoung')
  .map((member) => member.id)
  .join(', ')}

messages 通常包含 1 条消息，有时 2 条，最多 3 条。
memberId 必须来自上面的可用成员 ID。
text 只写实际聊天内容，不添加成员名字前缀。
不要输出 JSON 以外的内容。`;
      } else {
        const member = activeMember ?? members[0];

        rolePrompt = `${basePrompt}

        【当前聊天的已保存记忆】
        ${
          memoryContext ||
          '暂无已保存的特别记忆。请依据当前聊天历史自然回应，不要凭空编造过去发生的事。'
        }
        
        【当前私聊对象】
        ${getMemberPersona(member.id)}

你只扮演当前私聊对象，角色 ID 为 ${member.id}。
用户扮演金道荣（DOYOUNG）。

【私聊规则】
- 以当前成员的专属人设为准，不要混入其他成员的性格。
- 根据最近聊天历史自然接话，不要无故重启话题。
- 结合与道荣的关系，表现自然熟悉的相处方式。
- 可以偶尔使用个人特点或共同回忆，但不要机械复述设定。
- 回归话题遵守当前成员的保密规则。
- 通常回复一两句，简短、口语化、有生活感。
- 中文输入以中文为主；韩语输入优先使用自然韩语。
- 不要替用户发言，不要声称知道其他聊天窗口的内容。`;
      }

      const history = [
        { role: 'system', content: rolePrompt },
        ...(memoryContext
          ? [
              {
                role: 'system',
                content: `已保存的聊天记忆，仅在相关时自然使用：\n${memoryContext}`,
              },
            ]
          : []),
        ...recentHistory,
        { role: 'user', content: text },
      ];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      const responseText = await response.text();
      let data: { reply?: string; error?: string } = {};

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error('AI 接口暂时没有返回有效数据。');
      }

      if (!response.ok)
        throw new Error(data.error || `请求失败 (${response.status})`);

      const rawReply = typeof data.reply === 'string' ? data.reply.trim() : '';

      if (!rawReply) {
        throw new Error('AI 返回了空消息，请稍后再试。');
      }

      type ParsedReply = {
        senderId: string;
        text: string;
      };

      const senderAliases: Record<string, string> = {
        hyunsuk: 'hyunsuk',
        현석: 'hyunsuk',
        최현석: 'hyunsuk',
        崔玹硕: 'hyunsuk',
        ㅊㅎㅅ: 'hyunsuk',

        jihoon: 'jihoon',
        지훈: 'jihoon',
        박지훈: 'jihoon',
        朴志焄: 'jihoon',
        ㅂㅈㅎ: 'jihoon',

        yoshi: 'yoshi',
        요시: 'yoshi',
        YOSHI: 'yoshi',
        ㅇㅅ: 'yoshi',

        junkyu: 'junkyu',
        준규: 'junkyu',
        김준규: 'junkyu',
        金俊奎: 'junkyu',
        ㄱㅈㄱ: 'junkyu',

        jaehyuk: 'jaehyuk',
        재혁: 'jaehyuk',
        윤재혁: 'jaehyuk',
        尹材赫: 'jaehyuk',
        ㅇㅈㅎ: 'jaehyuk',

        asahi: 'asahi',
        아사히: 'asahi',
        ASAHI: 'asahi',
        阿萨希: 'asahi',
        ㅇㅅㅎ: 'asahi',

        haruto: 'haruto',
        하루토: 'haruto',
        HARUTO: 'haruto',
        渡边温斗: 'haruto',
        ㅎㄹㅌ: 'haruto',

        jeongwoo: 'jeongwoo',
        정우: 'jeongwoo',
        박정우: 'jeongwoo',
        朴炡禹: 'jeongwoo',
        ㅂㅈㅇ: 'jeongwoo',

        junghwan: 'junghwan',
        정환: 'junghwan',
        소정환: 'junghwan',
        苏庭焕: 'junghwan',
        ㅅㅈㅎ: 'junghwan',
      };

      const cleanText = (value: string) =>
        value
          .trim()
          .replace(
            /^(?:崔玹硕哥?|崔玹硕|최현석|현석|朴志焄|박지훈|지훈|YOSHI|ヨシ|요시|金俊奎|김준규|준규|尹材赫|윤재혁|재혁|ASAHI|阿萨希|아사히|金道荣|DOYOUNG|도영|渡边温斗|HARUTO|하루토|朴炡禹|朴正宇|박정우|정우|苏庭焕|소정환|정환)\s*[:：]\s*/i,
            ''
          )
          .trim();

      const parseLegacyGroupReply = (value: string): ParsedReply[] => {
        const match = value.match(
          /^\s*([^|｜:：\n]{1,30})\s*[|｜:：]\s*([\s\S]+)$/
        );

        if (match) {
          const id = senderAliases[match[1].trim().toLowerCase()];
          const text = cleanText(match[2]);
          if (id && text) return [{ senderId: id, text }];
        }

        const text = cleanText(value);
        const lastMessage = chat.messages[chat.messages.length - 1];
        const candidates = members.filter(
          (member) => member.id !== lastMessage?.senderId
        );
        const pool = candidates.length ? candidates : members;
        const fallbackId = pool[Math.floor(Math.random() * pool.length)]?.id;

        return text && fallbackId ? [{ senderId: fallbackId, text }] : [];
      };

      let parsedReplies: ParsedReply[] = [];

      if (chat.isGroup) {
        // 优先解析新格式 JSON；兼容旧格式单条文本
        try {
          const jsonStart = rawReply.indexOf('{');
          const jsonEnd = rawReply.lastIndexOf('}');
          if (jsonStart !== -1 && jsonEnd > jsonStart) {
            const parsed = JSON.parse(
              rawReply.slice(jsonStart, jsonEnd + 1)
            ) as {
              messages?: Array<{
                memberId?: string;
                text?: string;
              }>;
            };

            if (Array.isArray(parsed.messages)) {
              parsedReplies = parsed.messages
                .map((message) => {
                  const rawId = (message.memberId ?? '').trim();
                  const senderId = members.some((member) => member.id === rawId)
                    ? rawId
                    : senderAliases[rawId.toLowerCase()];
                  const text = cleanText(message.text ?? '');

                  return senderId && text ? { senderId, text } : null;
                })
                .filter((message): message is ParsedReply => message !== null)
                .filter(
                  (message, index, list) =>
                    list.findIndex(
                      (item) => item.senderId === message.senderId
                    ) === index
                )
                .slice(0, 3);
            }
          }
        } catch {
          // JSON 解析失败时，尝试兼容旧格式
        }

        if (!parsedReplies.length) {
          parsedReplies = parseLegacyGroupReply(rawReply);
        }

        if (!parsedReplies.length) {
          throw new Error('群聊回复内容为空，请重试。');
        }
      } else {
        parsedReplies = [
          {
            senderId: chat.id,
            text: cleanText(rawReply),
          },
        ].filter((message) => message.text);
      }

      if (!parsedReplies.length) {
        throw new Error('AI 返回的消息内容为空，请稍后再试。');
      }

      const replyTime = getTime();
      const replyDate = getDate();
      const baseId = Date.now();

      const aiMessages: Message[] = parsedReplies.map((parsed, index) => {
        const replyMember = getMember(parsed.senderId);
        const replyName = chat.isGroup
          ? replyMember?.name ?? 'TREASURE 成员'
          : activeMember?.name ?? chat.name;

        return {
          id: baseId + index + 1,
          text: parsed.text,
          fromMe: false,
          time: replyTime,
          date: replyDate,
          senderId: parsed.senderId,
          senderName: replyName,
        };
      });

      const lastReply = aiMessages[aiMessages.length - 1];
      const preview = chat.isGroup
        ? aiMessages
            .map(
              (message) =>
                `${message.senderName}：${
                  !message.fromMe
                    ? translations[`${activeChat.id}:${message.id}`] ??
                      message.text
                    : message.text
                }`
            )
            .join(' ')
        : lastReply.text;

      setChats((current) =>
        current.map((item) =>
          item.id === chatId
            ? {
                ...item,
                preview,
                time: replyTime,
                messages: [...item.messages, ...aiMessages],
              }
            : item
        )
      );
    } finally {
      setSending(false);
    }
  }

  function startCall() {
    if (!activeChat || activeChat.isGroup) return;

    const memberId = activeChat.id as keyof typeof openLines;
    setCallOpening(openLines[memberId] ?? '도영아, 전화했어?');
    setCallEnding(endLines[memberId] ?? '그럼 나중에 또 얘기하자!');
    setCallElapsed(0);
    setCallStatus('calling');
    setCallActive(true);

    if (callTimeoutRef.current !== null)
      window.clearTimeout(callTimeoutRef.current);
    callTimeoutRef.current = window.setTimeout(
      () => setCallStatus('connected'),
      1200
    );
  }

  function hangUp() {
    if (callTimeoutRef.current !== null) {
      window.clearTimeout(callTimeoutRef.current);
      callTimeoutRef.current = null;
    }

    setCallActive(false);
    if (!activeChat) return;

    const time = getTime();
    const duration = `${Math.floor(callElapsed / 60)}分${callElapsed % 60}秒`;
    const callMessage: Message = {
      id: Date.now(),
      text: `📞 通话结束 · ${duration}\n${callEnding}`,
      fromMe: false,
      time,
      date: getDate(),
      senderId: activeChat.id,
      senderName: activeChat.name,
    };

    setChats((current) =>
      current.map((item) =>
        item.id === activeChat.id
          ? {
              ...item,
              preview: `📞 通话结束 · ${duration}`,
              time,
              messages: [...item.messages, callMessage],
            }
          : item
      )
    );
  }

  const pageStyle: CSSProperties = {
    height: '100%',
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    background: '#f7f7f7',
    color: '#191919',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", sans-serif',
    overflow: 'hidden',
  };

  const headerStyle: CSSProperties = {
    background: '#fee500',
    padding: '13px 17px 15px',
    flexShrink: 0,
  };

  const iconButton: CSSProperties = {
    ...buttonBase,
    width: 36,
    height: 36,
    borderRadius: 12,
    fontSize: 21,
  };

  if (callActive && activeChat && !activeChat.isGroup) {
    const mm = String(Math.floor(callElapsed / 60)).padStart(2, '0');
    const ss = String(callElapsed % 60).padStart(2, '0');

    return (
      <div
        style={{
          ...pageStyle,
          background: 'linear-gradient(160deg,#283b58,#101722)',
          color: '#fff',
        }}
      >
        <div style={{ padding: '18px 16px' }}>
          <button
            onClick={hangUp}
            style={{ ...buttonBase, color: '#fff', fontSize: 24 }}
          >
            ‹
          </button>
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
          }}
        >
          <div
            style={{
              width: 118,
              height: 118,
              borderRadius: 38,
              background: 'rgba(255,255,255,.12)',
              display: 'grid',
              placeItems: 'center',
              fontSize: 58,
            }}
          >
            {activeChat.avatar}
          </div>
          <div style={{ fontSize: 24, fontWeight: 750 }}>{activeChat.name}</div>
          <div style={{ color: '#c8d1df', fontSize: 14 }}>
            {callStatus === 'calling' ? '연결 중…' : `${mm}:${ss}`}
          </div>
          {callStatus === 'connected' && (
            <div
              style={{
                marginTop: 8,
                padding: '12px 18px',
                borderRadius: 16,
                background: 'rgba(255,255,255,.12)',
                maxWidth: '80%',
                textAlign: 'center',
                lineHeight: 1.6,
              }}
            >
              {callOpening}
            </div>
          )}
        </div>
        <div
          style={{
            padding: '25px 28px 42px',
            display: 'flex',
            justifyContent: 'center',
            gap: 36,
          }}
        >
          <button
            onClick={() => setCallStatus('connected')}
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              border: 0,
              background: '#35c96f',
              color: '#fff',
              fontSize: 25,
            }}
          >
            🎙
          </button>
          <button
            onClick={hangUp}
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              border: 0,
              background: '#f04444',
              color: '#fff',
              fontSize: 25,
            }}
          >
            📞
          </button>
        </div>
      </div>
    );
  }

  if (activeChat) {
    const messages = activeChat.messages;

    return (
      <div style={pageStyle}>
        <header
          style={{
            background: '#fee500',
            padding: '13px 17px 12px',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => {
                setActiveChatId(null);
                setActiveTab('chats');
                setChatSearchOpen(false);
                setChatSearch('');
              }}
              aria-label="返回聊天列表"
              style={iconButton}
            >
              ‹
            </button>
            <div style={{ flex: 1, minWidth: 0, textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 750 }}>
                {activeChat.name}
              </div>
              <div style={{ fontSize: 10, marginTop: 3, opacity: 0.65 }}>
                {activeChat.isGroup
                  ? '10명 · TREASURE'
                  : `${activeChat.avatar} TREASURE`}
              </div>
            </div>
            {!activeChat.isGroup ? (
              <button
                onClick={startCall}
                aria-label="拨打电话"
                style={iconButton}
              >
                ⌕
              </button>
            ) : (
              <button aria-label="群聊信息" style={iconButton}>
                ☰
              </button>
            )}
          </div>
        </header>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            padding: '9px 12px',
            background: '#fff',
            borderBottom: '1px solid #eee',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 11, color: '#777' }}>🔍 搜索聊天</span>
          <span style={{ fontSize: 11, color: '#777' }}>☰ 聊天设置</span>
        </div>

        {chatSearchOpen && (
          <div
            style={{
              padding: '8px 12px',
              background: '#fff',
              borderBottom: '1px solid #eee',
            }}
          >
            <input
              value={chatSearch}
              onChange={(e) => setChatSearch(e.target.value)}
              placeholder="搜索本聊天记录..."
              style={{
                width: '100%',
                boxSizing: 'border-box',
                border: '1px solid #eee',
                borderRadius: 10,
                padding: '9px 12px',
                outline: 'none',
              }}
            />
          </div>
        )}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            padding: '12px 12px 18px',
            background: '#b2c5d5',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              margin: '3px 0 20px',
            }}
          >
            <span
              style={{
                borderRadius: 12,
                padding: '5px 10px',
                background: 'rgba(65,83,98,.3)',
                color: '#fff',
                fontSize: 10,
              }}
            >
              {activeChat.isGroup
                ? 'TREASURE · COMEBACK PREPARATION 💎'
                : '오늘도 우리 좋은 하루 ♡'}
            </span>
          </div>

          {messages
            .filter(
              (message) =>
                !chatSearch.trim() ||
                message.text.toLowerCase().includes(chatSearch.toLowerCase())
            )
            .map((message, index, visibleMessages) => {
              const previous = visibleMessages[index - 1];
              const next = visibleMessages[index + 1];
              const sender = message.senderId
                ? getMember(message.senderId)
                : undefined;
              const displayName = message.fromMe
                ? 'DOYOUNG'
                : message.senderName ?? sender?.name ?? activeChat.name;

              const showDate =
                !previous ||
                (message.date &&
                  previous.date &&
                  message.date !== previous.date);

              const sameAsPrevious =
                !!previous &&
                getSenderKey(previous) === getSenderKey(message) &&
                (previous.date ?? '') === (message.date ?? '');

              const sameAsNext =
                !!next &&
                getSenderKey(next) === getSenderKey(message) &&
                (next.date ?? '') === (message.date ?? '');

              const showSender = !message.fromMe && !sameAsPrevious;
              const showTime = !sameAsNext;

              return (
                <div key={`${activeChat.id}-${message.id}-${index}`}>
                  {showDate && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        margin: '14px 0 18px',
                      }}
                    >
                      <span
                        style={{
                          padding: '5px 10px',
                          borderRadius: 12,
                          background: 'rgba(69,86,101,.32)',
                          color: '#fff',
                          fontSize: 10,
                        }}
                      >
                        {message.date ?? getDate()}
                      </span>
                    </div>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: message.fromMe
                        ? 'flex-end'
                        : 'flex-start',
                      marginTop: sameAsPrevious ? 2 : 9,
                      marginBottom: sameAsNext ? 0 : 7,
                    }}
                  >
                    {!message.fromMe && (
                      <div style={{ width: 32, flexShrink: 0, marginRight: 7 }}>
                        {showSender && (
                          <div
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 10,
                              background: '#fff',
                              display: 'grid',
                              placeItems: 'center',
                              fontSize: 18,
                              overflow: 'hidden',
                            }}
                          >
                            {activeChat.isGroup
                              ? sender?.avatar ?? '💎'
                              : activeChat.avatar}
                          </div>
                        )}
                      </div>
                    )}

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: message.fromMe ? 'flex-end' : 'flex-start',
                        minWidth: 0,
                        maxWidth: 'calc(100% - 39px)',
                      }}
                    >
                      {showSender && activeChat.isGroup && (
                        <div
                          style={{
                            fontSize: 11,
                            color: '#40515f',
                            margin: '0 0 4px 2px',
                            fontWeight: 550,
                          }}
                        >
                          {displayName}
                        </div>
                      )}

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'flex-end',
                          gap: 4,
                        }}
                      >
                        {message.fromMe && showTime && (
                          <span
                            style={{
                              fontSize: 9,
                              lineHeight: 1.2,
                              color: '#526574',
                              whiteSpace: 'nowrap',
                              paddingBottom: 2,
                            }}
                          >
                            {message.time}
                          </span>
                        )}

                        <div
                          style={{
                            maxWidth: 'min(68vw, 280px)',
                            width: 'fit-content',
                            padding: '7px 10px',
                            borderRadius: message.fromMe
                              ? sameAsPrevious
                                ? sameAsNext
                                  ? '4px 4px 4px 12px'
                                  : '4px 4px 4px 12px'
                                : sameAsNext
                                ? '12px 4px 4px 12px'
                                : '12px 4px 12px 12px'
                              : sameAsPrevious
                              ? sameAsNext
                                ? '4px 4px 12px 4px'
                                : '4px 4px 12px 12px'
                              : sameAsNext
                              ? '4px 12px 12px 4px'
                              : '4px 12px 12px 12px',
                            background: message.fromMe ? '#fee500' : '#fff',
                            color: '#222',
                            fontSize: 13,
                            fontWeight: 400,
                            textAlign: 'left',
                            lineHeight: 1.42,
                            overflowWrap: 'anywhere',
                            whiteSpace: 'pre-wrap',
                            boxShadow: '0 1px 0 rgba(0,0,0,.025)',
                          }}
                        >
                          {!message.fromMe && translationEnabled
                            ? translations[`${activeChat.id}:${message.id}`] ??
                              message.text
                            : message.text}
                        </div>

                        {!message.fromMe && translationEnabled && (
                          <>
                            {showTime && (
                              <span
                                style={{
                                  fontSize: 9,
                                  lineHeight: 1.2,
                                  color: '#526574',
                                  whiteSpace: 'nowrap',
                                  paddingBottom: 2,
                                }}
                              >
                                {message.time}
                              </span>
                            )}

                            <button
                              type="button"
                              title={
                                translations[`${activeChat.id}:${message.id}`]
                                  ? '显示韩文原文'
                                  : '翻译成中文'
                              }
                              aria-label={
                                translations[`${activeChat.id}:${message.id}`]
                                  ? '显示韩文原文'
                                  : '翻译成中文'
                              }
                              onClick={() =>
                                void translateReceivedMessage(message)
                              }
                              disabled={
                                translatingId ===
                                `${activeChat.id}:${message.id}`
                              }
                              style={{
                                ...buttonBase,
                                width: 20,
                                height: 18,
                                minWidth: 20,
                                borderRadius: 6,
                                background: 'rgba(255,255,255,.55)',
                                color: '#526574',
                                fontSize: 10,
                                padding: 0,
                                marginBottom: 1,
                                opacity:
                                  translatingId ===
                                  `${activeChat.id}:${message.id}`
                                    ? 0.6
                                    : 1,
                              }}
                            >
                              {translatingId ===
                              `${activeChat.id}:${message.id}`
                                ? '…'
                                : translations[`${activeChat.id}:${message.id}`]
                                ? '韩'
                                : '译'}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

          {sending && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 7,
                margin: '8px 0',
                color: '#536574',
                fontSize: 11,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 10,
                  background: '#fff',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 17,
                }}
              >
                {activeChat.avatar}
              </div>
              <span
                style={{
                  background: '#fff',
                  padding: '8px 11px',
                  borderRadius: '4px 12px 12px 12px',
                }}
              >
                입력 중…
              </span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {showMoreTools && (
          <div
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              padding: '10px 12px',
              background: '#fff',
              borderTop: '1px solid #eee',
            }}
          >
            {[
              [
                '🖼️',
                '发送照片',
                () => {
                  setNotice(
                    '照片功能已打开：可以先通过下方表情/文字继续聊天。'
                  );
                  setShowMoreTools(false);
                },
              ],
              [
                '🔍',
                '搜索记录',
                () => {
                  setChatSearchOpen(true);
                  setShowMoreTools(false);
                },
              ],
              [
                '📞',
                '语音通话',
                () => {
                  if (!activeChat?.isGroup) startCall();
                  else setNotice('群聊暂不支持通话模拟。');
                  setShowMoreTools(false);
                },
              ],
              [
                '⚙️',
                '聊天设置',
                () => {
                  setShowSettings(true);
                  setShowMoreTools(false);
                },
              ],
            ].map(([icon, label, action]) => (
              <button
                key={String(label)}
                type="button"
                onClick={action as () => void}
                style={{
                  ...buttonBase,
                  flexDirection: 'column',
                  gap: 5,
                  width: 68,
                  padding: 8,
                  fontSize: 11,
                }}
              >
                <span style={{ fontSize: 22 }}>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        )}
        {showEmojiPicker && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              padding: 10,
              background: '#fff',
              borderTop: '1px solid #eee',
            }}
          >
            {'😀 😭 😂 🥹 ❤️ 💛 💎 🫶🏻 ㅋㅋㅋ ㅎㅎㅎ 🐰'
              .split(' ')
              .map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    setDraft((value) => value + emoji);
                    setShowEmojiPicker(false);
                  }}
                  style={{ ...buttonBase, fontSize: 22, padding: 4 }}
                >
                  {emoji}
                </button>
              ))}
          </div>
        )}

        {translationError && (
          <div
            style={{
              padding: '6px 12px',
              background: '#fff4f2',
              color: '#c3483b',
              fontSize: 11,
            }}
          >
            {translationError}
            <button
              type="button"
              onClick={() => setTranslationError('')}
              style={{ ...buttonBase, marginLeft: 8, color: '#c3483b' }}
            >
              ×
            </button>
          </div>
        )}

        {draftTranslation && (
          <div
            style={{
              padding: '7px 10px',
              background: '#fffdf2',
              borderTop: '1px solid #f0e7bd',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span
                style={{
                  flex: 1,
                  fontSize: 10,
                  color: '#8c7b37',
                }}
              >
                韩文预览 · 可编辑
              </span>
              <button
                type="button"
                onClick={() => setDraftTranslation('')}
                style={{
                  ...buttonBase,
                  fontSize: 11,
                  color: '#888',
                  padding: 4,
                }}
              >
                取消
              </button>
              <button
                type="button"
                disabled={!draftTranslation.trim() || sending}
                onClick={() => void sendMessage(draftTranslation)}
                style={{
                  ...buttonBase,
                  borderRadius: 8,
                  padding: '5px 9px',
                  background: '#fee500',
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                发送韩文 ↑
              </button>
            </div>

            <textarea
              value={draftTranslation}
              onChange={(event) => setDraftTranslation(event.target.value)}
              rows={2}
              style={{
                display: 'block',
                width: '100%',
                boxSizing: 'border-box',
                marginTop: 5,
                padding: '5px 7px',
                border: '1px solid #eee5c5',
                borderRadius: 8,
                resize: 'vertical',
                outline: 'none',
                fontSize: 12,
                lineHeight: 1.5,
                background: '#fff',
              }}
            />
          </div>
        )}

        <form
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            void sendMessage();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '9px 10px',
            background: '#fff',
            borderTop: '1px solid #e9e9e9',
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            aria-label="更多功能"
            onClick={() => {
              setShowMoreTools((v) => !v);
              setShowEmojiPicker(false);
            }}
            style={{
              ...buttonBase,
              width: 32,
              height: 38,
              color: '#777',
              fontSize: 24,
            }}
          >
            ＋
          </button>

          <button
            type="button"
            title="中文翻译成韩文"
            aria-label="中文翻译成韩文"
            disabled={!draft.trim() || translatingDraft || sending}
            onClick={() => void translateDraftToKorean()}
            style={{
              ...buttonBase,
              width: 30,
              height: 34,
              flexShrink: 0,
              borderRadius: 9,
              background: draft.trim() ? '#fff3a8' : '#f3f3f3',
              color: '#526574',
              fontSize: 12,
              fontWeight: 700,
              opacity: translatingDraft || sending ? 0.55 : 1,
            }}
          >
            {translatingDraft ? '…' : '译'}
          </button>

          <input
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              setDraftTranslation('');
              setTranslationError('');
            }}
            placeholder={activeChat.isGroup ? '群聊消息...' : '메시지 보내기'}
            aria-label="输入消息"
            style={{
              flex: 1,
              minWidth: 0,
              border: '1px solid #e7e7e7',
              borderRadius: 22,
              padding: '10px 14px',
              background: '#fafafa',
              outline: 'none',
              fontSize: 13,
            }}
          />
          <button
            type="button"
            aria-label="表情"
            onClick={() => {
              setShowEmojiPicker((v) => !v);
              setShowMoreTools(false);
            }}
            style={{
              ...buttonBase,
              width: 30,
              height: 38,
              color: '#777',
              fontSize: 21,
            }}
          >
            ☺
          </button>
          <button
            type="submit"
            disabled={!draft.trim() || sending}
            aria-label="发送消息"
            style={{
              border: 0,
              borderRadius: 12,
              width: 38,
              height: 38,
              flexShrink: 0,
              background: draft.trim() && !sending ? '#fee500' : '#ededed',
              color: '#222',
              fontSize: 21,
              cursor: 'pointer',
            }}
          >
            ↑
          </button>
        </form>
      </div>
    );
  }

  const filteredChats = chats
    .filter((chat) =>
      `${chat.name} ${chat.preview}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (a.id === GROUP_ID) return -1;
      if (b.id === GROUP_ID) return 1;
      return 0;
    });

  return (
    <div style={pageStyle}>
      <header style={headerStyle}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <button
            onClick={() => onBack?.()}
            aria-label="返回手机桌面"
            style={iconButton}
          >
            ‹
          </button>
          <h1
            style={{
              margin: 0,
              fontSize: 25,
              fontWeight: 850,
              letterSpacing: '-.7px',
            }}
          >
            채팅
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <button
              aria-label="新建聊天"
              onClick={() => setShowNewChat(true)}
              style={iconButton}
            >
              ＋
            </button>
            <button
              aria-label="设置"
              onClick={() => setShowSettings(true)}
              style={iconButton}
            >
              ⚙
            </button>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 12,
            padding: '0 11px',
            height: 38,
            borderRadius: 11,
            background: 'rgba(255,255,255,.68)',
          }}
        >
          <span style={{ fontSize: 16, color: '#666' }}>⌕</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="이름 또는 채팅방 검색"
            aria-label="搜索聊天"
            style={{
              width: '100%',
              border: 0,
              background: 'transparent',
              outline: 'none',
              fontSize: 12,
              color: '#333',
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ ...buttonBase, fontSize: 15, color: '#777' }}
            >
              ×
            </button>
          )}
        </div>
      </header>

      {activeTab === 'friends' ? (
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            background: '#fff',
            paddingBottom: 8,
          }}
        >
          <div
            style={{ padding: '16px 17px 10px', fontWeight: 750, fontSize: 13 }}
          >
            TREASURE 친구
          </div>
          {members.map((member) => (
            <button
              key={member.id}
              onClick={() => {
                setActiveChatId(member.id);
                setActiveTab('chats');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                padding: '12px 16px',
                border: 0,
                borderBottom: '1px solid #f5f5f5',
                background: '#fff',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  background: '#f5f1e8',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 27,
                }}
              >
                {member.avatar}
              </span>
              <span style={{ flex: 1 }}>
                <strong style={{ display: 'block', fontSize: 14 }}>
                  {member.name}
                </strong>
                <small style={{ color: '#999' }}>
                  {member.koreanName} · TREASURE
                </small>
              </span>
              <span style={{ color: '#bbb' }}>›</span>
            </button>
          ))}
          <button
            onClick={() => {
              setActiveChatId(GROUP_ID);
              setActiveTab('chats');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              width: '100%',
              padding: '12px 16px',
              border: 0,
              background: '#fff',
              textAlign: 'left',
            }}
          >
            <span
              style={{
                width: 48,
                height: 48,
                borderRadius: 16,
                background: '#e6effb',
                display: 'grid',
                placeItems: 'center',
                fontSize: 27,
              }}
            >
              💎
            </span>
            <strong>TREASURE 群聊</strong>
          </button>
        </div>
      ) : activeTab === 'discover' ? (
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            background: '#f7f7f7',
            padding: 16,
          }}
        >
          <h2 style={{ margin: '4px 0 14px', fontSize: 20 }}>发现</h2>
          <div
            style={{
              padding: 16,
              borderRadius: 18,
              background: '#fff',
              marginBottom: 12,
            }}
          >
            <div style={{ fontSize: 11, color: '#999' }}>
              TREASURE MOMENT · TODAY
            </div>
            <h3 style={{ margin: '8px 0' }}>오늘의 트레저 💎</h3>
            <p style={{ fontSize: 13, lineHeight: 1.6 }}>
              연습 끝! 오늘도 고생했어 트메들아 ㅎㅎ
            </p>
            <div
              style={{ display: 'flex', gap: 12, color: '#777', fontSize: 12 }}
            >
              <button
                onClick={() => setNotice('已点赞这条动态 💛')}
                style={buttonBase}
              >
                ♡ 喜欢
              </button>
              <button
                onClick={() =>
                  setNotice('评论功能：可以在聊天中继续讨论这条动态。')
                }
                style={buttonBase}
              >
                评论
              </button>
            </div>
          </div>
          <div
            style={{
              padding: 16,
              borderRadius: 18,
              background: '#fff',
              marginBottom: 12,
            }}
          >
            <strong>今日话题</strong>
            <p style={{ fontSize: 13 }}>
              如果可以和 TREASURE 一起度过一天，你最想做什么？
            </p>
            <button
              onClick={() => {
                setActiveChatId(GROUP_ID);
                setActiveTab('chats');
              }}
              style={{
                ...buttonBase,
                background: '#fee500',
                borderRadius: 10,
                padding: '9px 12px',
              }}
            >
              去群聊讨论
            </button>
          </div>
          <div style={{ padding: 16, borderRadius: 18, background: '#fff' }}>
            <strong>成员日常</strong>
            <p style={{ fontSize: 13, color: '#777' }}>
              这里是虚构的粉丝模拟动态，不代表真实成员的实际发言。
            </p>
            {members.slice(0, 4).map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setActiveChatId(m.id);
                  setActiveTab('chats');
                }}
                style={{
                  ...buttonBase,
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'flex-start',
                  gap: 10,
                  padding: '10px 0',
                }}
              >
                <span>{m.avatar}</span>
                <span>{m.name}　发起聊天 ›</span>
              </button>
            ))}
          </div>
        </div>
      ) : activeTab === 'open' ? (
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            background: '#fff',
            padding: 16,
          }}
        >
          <h2 style={{ fontSize: 20 }}>开放聊天</h2>
          <div
            style={{
              padding: 16,
              borderRadius: 16,
              background: '#fff8c9',
              marginBottom: 12,
            }}
          >
            <strong>💎 TREASURE TALK</strong>
            <p style={{ fontSize: 13 }}>和成员一起聊回归、音乐与日常。</p>
            <button
              onClick={() => {
                setActiveChatId(GROUP_ID);
                setActiveTab('chats');
              }}
              style={{
                ...buttonBase,
                background: '#fee500',
                borderRadius: 10,
                padding: '9px 12px',
              }}
            >
              进入群聊
            </button>
          </div>
          <p style={{ color: '#999', fontSize: 12 }}>
            开放聊天为本地模拟空间，不会公开发布到互联网。
          </p>
        </div>
      ) : activeTab === 'shopping' ? (
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            background: '#fff',
            padding: 18,
          }}
        >
          <h2 style={{ fontSize: 20 }}>购物</h2>
          <div style={{ borderRadius: 18, padding: 18, background: '#fff8d8' }}>
            <div style={{ fontSize: 32 }}>🛍️</div>
            <strong>TREASURE 收藏清单</strong>
            <p style={{ fontSize: 13, lineHeight: 1.6 }}>
              把想收藏的专辑、周边和演唱会物品记在这里。此页面为本地展示，不涉及真实购买。
            </p>
            <button
              onClick={() =>
                setNotice('收藏清单已准备好，后续可以扩展为可保存的本地清单。')
              }
              style={{
                ...buttonBase,
                background: '#fee500',
                borderRadius: 10,
                padding: '9px 12px',
              }}
            >
              查看收藏清单
            </button>
          </div>
        </div>
      ) : activeTab === 'more' ? (
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            background: '#fff',
            padding: 16,
          }}
        >
          <h2 style={{ fontSize: 20 }}>更多</h2>
          {[
            ['👤', '我的资料'],
            ['🔔', '通知设置'],
            ['💬', '聊天设置'],
            ['🧹', '清理本地聊天'],
            ['ℹ️', '关于 KKT'],
          ].map(([icon, label]) => (
            <button
              key={label}
              onClick={() =>
                label === '清理本地聊天'
                  ? setNotice('为了避免误删聊天记录，请在聊天设置中单独处理。')
                  : setShowSettings(true)
              }
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                width: '100%',
                padding: '15px 4px',
                border: 0,
                borderBottom: '1px solid #f1f1f1',
                background: '#fff',
                textAlign: 'left',
              }}
            >
              <span>{icon}</span>
              <span style={{ flex: 1, fontSize: 14 }}>{label}</span>
              <span style={{ color: '#bbb' }}>›</span>
            </button>
          ))}
        </div>
      ) : (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '13px 17px 10px',
              background: '#fff',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 12, color: '#333', fontWeight: 700 }}>
              모든 채팅
            </span>
            <span style={{ fontSize: 10, color: '#999' }}>
              채팅 {filteredChats.length}
            </span>
          </div>

          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              background: '#fff',
            }}
          >
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  gap: 12,
                  border: 0,
                  borderBottom: '1px solid #f5f5f5',
                  background: '#fff',
                  padding: '12px 15px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: '#191919',
                }}
              >
                <span
                  style={{
                    position: 'relative',
                    width: 51,
                    height: 51,
                    flexShrink: 0,
                    borderRadius: chat.isGroup ? 17 : 18,
                    background: chat.isGroup ? '#e6effb' : '#f4f1ec',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.025)',
                  }}
                >
                  {chat.avatar}
                  {chat.isGroup && (
                    <span
                      style={{
                        position: 'absolute',
                        right: -3,
                        bottom: -3,
                        width: 17,
                        height: 17,
                        borderRadius: 7,
                        display: 'grid',
                        placeItems: 'center',
                        background: '#fee500',
                        border: '2px solid white',
                        fontSize: 9,
                      }}
                    >
                      💎
                    </span>
                  )}
                </span>

                <span
                  style={{
                    flex: 1,
                    minWidth: 0,
                    alignSelf: 'stretch',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <span
                    style={{ display: 'flex', alignItems: 'center', gap: 5 }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 750,
                        letterSpacing: '-.2px',
                      }}
                    >
                      {chat.name}
                    </span>
                    {chat.isGroup && (
                      <span style={{ fontSize: 10, color: '#aaa' }}>10</span>
                    )}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      color: '#888',
                      fontSize: 12,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {chat.preview}
                  </span>
                </span>

                <span
                  style={{
                    alignSelf: 'stretch',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    gap: 7,
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: 10, color: '#b0b0b0' }}>
                    {chat.time}
                  </span>
                  {(chat.unread ?? 0) > 0 && (
                    <span
                      style={{
                        minWidth: 17,
                        height: 17,
                        padding: '0 4px',
                        borderRadius: 9,
                        background: '#f45b55',
                        color: '#fff',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 9,
                      }}
                    >
                      {chat.unread}
                    </span>
                  )}
                </span>
              </button>
            ))}

            {filteredChats.length === 0 && (
              <div
                style={{
                  padding: 32,
                  textAlign: 'center',
                  color: '#999',
                  fontSize: 12,
                }}
              >
                검색结果 없음
                <br />
                <span style={{ display: 'block', marginTop: 5, fontSize: 11 }}>
                  친구 이름이나 채팅방을 확인해 주세요.
                </span>
              </div>
            )}
          </div>
        </>
      )}

      <nav
        style={{
          height: 58,
          flexShrink: 0,
          background: '#fff',
          borderTop: '1px solid #eee',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingBottom: 2,
        }}
      >
        {[
          { icon: '♙', label: '친구', tab: 'friends' as const },
          { icon: '●', label: '채팅', tab: 'chats' as const },
          { icon: '◉', label: '发现', tab: 'discover' as const },
          { icon: '▣', label: '购物', tab: 'shopping' as const },
          { icon: '⋯', label: '更多', tab: 'more' as const },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => {
              setActiveTab(item.tab);
              setSearch('');
              setNotice('');
            }}
            style={{
              ...buttonBase,
              flex: 1,
              height: '100%',
              flexDirection: 'column',
              gap: 4,
              color: activeTab === item.tab ? '#191919' : '#999',
              fontSize: 10,
              fontWeight: activeTab === item.tab ? 750 : 450,
            }}
          >
            <span style={{ fontSize: 21, lineHeight: 1 }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      {notice && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 20,
            background: 'rgba(0,0,0,.25)',
            display: 'grid',
            placeItems: 'center',
            padding: 24,
          }}
          onClick={() => setNotice('')}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 300,
              background: '#fff',
              borderRadius: 18,
              padding: 20,
              boxShadow: '0 12px 40px rgba(0,0,0,.16)',
            }}
          >
            <div style={{ fontWeight: 750, marginBottom: 10 }}>KKT</div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: '#555' }}>
              {notice}
            </div>
            <button
              onClick={() => setNotice('')}
              style={{
                ...buttonBase,
                marginTop: 18,
                background: '#fee500',
                borderRadius: 10,
                padding: '9px 16px',
                width: '100%',
              }}
            >
              知道了
            </button>
          </div>
        </div>
      )}
      {(showSettings || showNewChat) && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 21,
            background: 'rgba(0,0,0,.3)',
            display: 'grid',
            placeItems: 'center',
            padding: 20,
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 340,
              maxHeight: '82%',
              overflowY: 'auto',
              background: '#fff',
              borderRadius: 20,
              padding: 18,
              boxShadow: '0 12px 40px rgba(0,0,0,.18)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 14,
              }}
            >
              <strong>{showNewChat ? '新建聊天' : 'KKT 设置'}</strong>
              <button
                onClick={() => {
                  setShowSettings(false);
                  setShowNewChat(false);
                }}
                style={{ ...buttonBase, fontSize: 22 }}
              >
                ×
              </button>
            </div>
            {showNewChat ? (
              members.map((member) => (
                <button
                  key={member.id}
                  onClick={() => {
                    setActiveChatId(member.id);
                    setActiveTab('chats');
                    setShowNewChat(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    border: 0,
                    borderBottom: '1px solid #f2f2f2',
                    background: '#fff',
                    padding: '11px 0',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: 24 }}>{member.avatar}</span>
                  <span>
                    {member.name}
                    <small
                      style={{ display: 'block', color: '#999', marginTop: 3 }}
                    >
                      {member.koreanName}
                    </small>
                  </span>
                </button>
              ))
            ) : (
              <>
                <div
                  style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}
                >
                  <strong style={{ fontSize: 13 }}>聊天显示</strong>
                  <p style={{ fontSize: 12, color: '#777' }}>
                    聊天记录保存在当前浏览器本地。
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                      padding: '12px 0',
                      borderTop: '1px solid #f3f3f3',
                      borderBottom: '1px solid #f3f3f3',
                      marginBottom: 10,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>
                        消息翻译按钮
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: '#999',
                          marginTop: 4,
                          lineHeight: 1.5,
                        }}
                      >
                        在收到的韩文消息旁显示「译」
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={translationEnabled}
                      aria-label="消息翻译按钮"
                      onClick={() => setTranslationEnabled((value) => !value)}
                      style={{
                        width: 46,
                        height: 27,
                        flexShrink: 0,
                        border: 0,
                        borderRadius: 20,
                        padding: 3,
                        background: translationEnabled ? '#34c759' : '#d1d1d6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: translationEnabled
                          ? 'flex-end'
                          : 'flex-start',
                        cursor: 'pointer',
                        transition: 'background .18s ease',
                      }}
                    >
                      <span
                        style={{
                          width: 21,
                          height: 21,
                          borderRadius: '50%',
                          background: '#fff',
                          boxShadow: '0 1px 3px rgba(0,0,0,.18)',
                        }}
                      />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setShowSettings(false);
                      setNotice(
                        '当前聊天历史保存在本地浏览器中。清理浏览器数据可能会删除这些记录。'
                      );
                    }}
                    style={{
                      ...buttonBase,
                      background: '#f6f6f6',
                      borderRadius: 9,
                      padding: '9px 12px',
                    }}
                  >
                    查看存储说明
                  </button>
                </div>
                <div style={{ padding: '12px 0' }}>
                  <strong style={{ fontSize: 13 }}>个人状态</strong>
                  <input
                    value={statusText}
                    onChange={(e) => setStatusText(e.target.value)}
                    maxLength={40}
                    style={{
                      boxSizing: 'border-box',
                      width: '100%',
                      marginTop: 8,
                      border: '1px solid #eee',
                      borderRadius: 10,
                      padding: 10,
                    }}
                  />
                  <small style={{ color: '#999' }}>
                    状态只在本地模拟界面展示。
                  </small>
                </div>
                <button
                  onClick={() => {
                    setShowSettings(false);
                    setNotice('设置已保存在当前界面状态中。');
                  }}
                  style={{
                    ...buttonBase,
                    width: '100%',
                    background: '#fee500',
                    borderRadius: 11,
                    padding: 11,
                    fontWeight: 700,
                  }}
                >
                  完成
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
