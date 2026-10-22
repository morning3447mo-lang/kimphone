// treasureChatData.js
/**
 * 角色：金道荣 (DOYOUNG) 主动发起消息，成员回复
 * 抽取规则参考注释，方便你前端写随机逻辑
 * doyoung：金道荣发送的韩文消息
 * member：对方成员回复的韩文消息
 */
export const treasureChatData = {
  hyunsuk: [
    // 轻松脑洞 50%
    {
      doyoung: '형 또 새로운 아이디어 생각했어? 들려줘 ㅋㅋㅋ',
      member: '응! 이번 곡 후크 부분 바꿔보고 싶은데 같이 들어줄래?',
    },
    {
      doyoung: '작업 너무 오래 하지 마, 배고프지 않아? 같이 밥 먹으러 가자',
      member: '아직 좀 더 해야 해 ㅠㅠ 힘들다 도영아',
    },
    // 走心安慰 50%
    {
      doyoung:
        '형 너무 자신을 몰아붙이지 마. 잘하고 있으니까 괜찮아. 많이 웃었으면 좋겠어.',
      member: '도영아 고마워… 네 말 들으니까 조금 마음이 놓여.',
    },
  ],

  jihoon: [
    // 拌嘴搭档
    {
      doyoung: '지훈아, 내 생각대로 해보는 거 어때? 한번만 테스트해보자 ㅋㅋ',
      member: '또 이상한 짓 하려고? 연습 망치면 안 돼 진짜로',
    },
    {
      doyoung: '그래 알았어. 그럼 내가 보조 맞춰줄게. 내일 연습 시간 정했어?',
      member: '아홉 시까지 스튜디오 집합. 늦지 마라.',
    },
    // 走心认可
    {
      doyoung: '오늘 정말 수고했어. 형이 있어서 나도 든든해.',
      member: '너도 많이 힘들었지. 적당히 쉬어가면서 해.',
    },
  ],

  yoshi: [
    {
      doyoung: '요시야 오늘 기분 어때? 좋은 노래 들은 거 있으면 공유해줘 🤍',
      member: '응, 방금 노래 하나 들었어. 링크 보낼게.',
    },
    {
      doyoung:
        '방송 때 못 나온 거 알고 있어, 내가 사진 들고 대신 인사했어 ㅎㅎ',
      member: '고마워 도영아, 신경 써줘서.',
    },
    {
      doyoung: '무리하지 마. 힘들면 그냥 쉬어도 돼.',
      member: '알겠어. 도영도 너무 무리하지 마.',
    },
  ],

  junkyu: [
    {
      doyoung: '준규야 게임 한 판 할래? 지금 시간 돼? ㅋㅋㅋ',
      member: '좋아! 빨리 접속해 기다릴게😆',
    },
    {
      doyoung: '오늘 식당 맛있었어, 다음에 또 같이 가자',
      member: '그래! 거기 메뉴 또 먹고 싶어',
    },
  ],

  jaehyuk: [
    {
      doyoung: '재혁아 오늘 무대 스타일 진짜 잘 어울려',
      member: '도영이 말 들으니까 기분 좋아! 너도 오늘 진짜 멋있었어.',
    },
    {
      doyoung: '요즘 연습하면서 스트레스 받아?',
      member: '괜찮아, 그래도 네가 같이 힘내줘서 괜찮아.',
    },
    {
      doyoung: '자꾸 자신 없어 하지 마. 너의 장점은 정말 빛나.',
      member: '도영아 고마워, 네가 늘 나를 긍정적으로 봐줘.',
    },
  ],

  asahi: [
    {
      doyoung: '아사히야 새로 쓴 곡 있어? 한번 들어보고 싶어',
      member: '작은 부분만 만들었어. 오디오 보낼게.',
    },
    {
      doyoung: '그림 그리는 거야? 잘 그렸다. 분위기 좋아.',
      member: '응, 조금 더 그리고 나중에 얘기하자.',
    },
  ],

  haruto: [
    {
      doyoung: '하루토야 이거 봐! 신기하지? ㅋㅋㅋ',
      member: '와 진짜요? 신기해😯',
    },
    {
      doyoung: '요즘 뭐 재미있는 거 보고 있어? 애니메이션?',
      member: '네, 재밌는 애니 보고 있어요. 나중에 추천해드릴게요.',
    },
    {
      doyoung: '하루토야 연습 힘들면 언제든 말해. 같이 연습하자.',
      member: '알겠어요. 도영 오빠는 힘들어도 티 안 내서 대단하다고 생각해요.',
    },
  ],

  jeongwoo: [
    {
      doyoung: '정우야 오늘 고음 부분 괜찮았어? 어려운 부분 있었어?',
      member: '네, 한 구간이 아직 불안해요. 더 연습해야 해요.',
    },
    {
      doyoung: '무리해서 목 상하지 마. 쉬면서 연습해.',
      member: '네, 오빠도 너무 늦게까지 연습하지 마세요.',
    },
  ],

  junghwan: [
    // 捉弄互怼 70%优先抽
    {
      doyoung: '정환아~ 이거 봐봐 ㅋㅋㅋ 너 좋아할 거야',
      member: '오빠 또 뭐야! 그만 장난쳐 진짜 ㅋㅋㅋ',
    },
    {
      doyoung: '왜 화내? 재미있잖아~',
      member: '진짜 짜증 나… 오빠는 매번 나만 놀려',
    },
    {
      doyoung: '그만 화내, 나만 너를 이렇게 챙겨주잖아?',
      member: '말도 안 돼… 알았어 알았어',
    },
    // 走心关心 30%
    {
      doyoung: '요즘 일정 너무 많잖아. 몸 아프면 꼭 말해. 내가 챙겨줄게.',
      member: '…알았어. 고마워 오빠.',
    },
    {
      doyoung: '오늘 많이 힘들었지. 밥 잘 챙겨 먹고 일찍 자.',
      member: '응, 오빠도 쉬어.',
    },
  ],
};

// 📞 通话接通开场白（拿起电话，第一句）
export const openLines = {
  hyunsuk: '형, 전화 받았어?',
  jihoon: '지훈아 통화 돼?',
  yoshi: '요시야 잘 지냈어?',
  junkyu: '준규야 뭐 해?',
  jaehyuk: '재혁아 잠깐 통화 가능해?',
  asahi: '아사히야 지금 괜찮아?',
  haruto: '하루토야 안녕!',
  jeongwoo: '정우야 잠시 얘기할까?',
  junghwan: '정환아~ 전화 받아라 ㅋㅋ',
};

// 📴 挂断收尾台词（挂电话前最后一句）
export const endLines = {
  hyunsuk: '그럼 나중에 또 얘기해, 힘내 형',
  jihoon: '알았어, 오늘도 수고했어',
  yoshi: '잘 쉬어, 나중에 연락해 🤍',
  junkyu: '게임 또 같이 하자! 안녕~',
  jaehyuk: '항상 응원할게, 잘 쉬어',
  asahi: '작업 잘해, 나중에 곡 들려줘',
  haruto: '재밌는 거 보면 또 알려줘',
  jeongwoo: '목 조심하고 연습해, 안녕',
  junghwan: '장난 그만할게… 잘 쉬어 ㅎㅎ',
};

/**
 * 工具函数：随机抽取一组对话
 * @param {string} memberId 成员key: hyunsuk / junghwan ...
 * @returns {Object} {doyoung, member}
 */
export function getRandomChat(memberId) {
  const list = treasureChatData[memberId];
  if (!list || list.length === 0) return null;
  const randomIdx = Math.floor(Math.random() * list.length);
  return list[randomIdx];
}
