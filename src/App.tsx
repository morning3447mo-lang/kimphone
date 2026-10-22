import { useEffect, useState, type ReactNode } from 'react';
import './App.css';
import MessageApp from './components/MessageApp';
import PhotoApp from './components/PhotoApp';
import PhoneApp from './components/PhoneApp';

type AppInfo = { name: string; icon: string; color: string };

const apps: AppInfo[] = [
  { name: 'KKT', icon: 'kkt', color: '#FEE500' },
  { name: 'Instagram', icon: 'instagram', color: '#E1306C' },
  { name: 'YouTube', icon: 'youtube', color: '#FF0033' },
  { name: '相册', icon: 'photos', color: '#fff' },
  { name: '音乐', icon: 'music', color: '#F04470' },
  { name: '日历', icon: 'calendar', color: '#fff' },
  { name: '备忘录', icon: 'notes', color: '#FFF8D9' },
  { name: '浏览器', icon: 'browser', color: '#1688F8' },
  { name: '设置', icon: 'settings', color: '#A8ADB6' },
  { name: '电话', icon: 'phone', color: '#28C840' },
];

const INSTAGRAM_URL = 'https://www.instagram.com/yg_treasure_official/';
const YOUTUBE_URL = 'https://www.youtube.com/@TREASURE';

const plainButton: React.CSSProperties = {
  border: 0,
  background: 'transparent',
  color: '#1688F8',
  cursor: 'pointer',
  fontSize: 14,
};

const primaryButton: React.CSSProperties = {
  border: 0,
  borderRadius: 10,
  padding: '10px 14px',
  background: '#1688F8',
  color: '#fff',
  cursor: 'pointer',
};

const page: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 0,
  overflow: 'hidden',
  background: '#f5f5f8',
  color: '#222',
  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
};

const content: React.CSSProperties = {
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  padding: 15,
};

const card: React.CSSProperties = {
  background: '#fff',
  borderRadius: 16,
  padding: 15,
  marginBottom: 12,
};

const field: React.CSSProperties = {
  boxSizing: 'border-box',
  width: '100%',
  padding: 12,
  border: '1px solid #e5e5ea',
  borderRadius: 11,
  fontSize: 14,
  outline: 'none',
};

function Icon({ type }: { type: string }) {
  const base: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'grid',
    placeItems: 'center',
    borderRadius: 'inherit',
    overflow: 'hidden',
  };

  const svgStyle: React.CSSProperties = {
    width: '76%',
    height: '76%',
    display: 'block',
  };

  if (type === 'kkt') {
    return (
      <span style={{ ...base, background: '#FEE500' }}>
        <svg viewBox="0 0 100 100" width="78%" height="78%">
          <path
            d="M14 23 Q14 14 24 14 H76 Q86 14 86 24 V59 Q86 69 76 69 H49 L31 84 V69 H24 Q14 69 14 59 Z"
            fill="#3A3020"
          />
          <text
            x="50"
            y="48"
            textAnchor="middle"
            fontSize="20"
            fontWeight="900"
            fill="#FEE500"
            fontFamily="Arial, sans-serif"
          >
            TALK
          </text>
        </svg>
      </span>
    );
  }

  if (type === 'instagram') {
    return (
      <span
        style={{
          ...base,
          background:
            'radial-gradient(circle at 28% 108%, #FFD776 0%, #FF543E 42%, #C837AB 72%, #515BD4 100%)',
        }}
      >
        <svg viewBox="0 0 100 100" style={svgStyle} fill="none">
          <rect
            x="12"
            y="12"
            width="76"
            height="76"
            rx="23"
            stroke="#FFFFFF"
            strokeWidth="7"
          />
          <circle cx="50" cy="50" r="18" stroke="#FFFFFF" strokeWidth="7" />
          <circle cx="74" cy="27" r="5" fill="#FFFFFF" />
        </svg>
      </span>
    );
  }

  if (type === 'youtube') {
    return (
      <span style={{ ...base, background: '#FFFFFF' }}>
        <svg viewBox="0 0 100 76" width="88%" height="76%">
          <rect x="3" y="5" width="94" height="66" rx="20" fill="#FF0033" />
          <path d="M42 23 L42 53 L67 38 Z" fill="#FFFFFF" />
        </svg>
      </span>
    );
  }

  if (type === 'phone') {
    return (
      <span
        style={{
          ...base,
          background: 'linear-gradient(145deg, #65D96E 0%, #28C840 100%)',
        }}
      >
        <svg
          viewBox="0 0 100 100"
          width="66%"
          height="66%"
          fill="none"
          aria-label="电话"
        >
          <path
            d="M28 13
              C24 12 18 18 16 24
              C12 35 23 53 36 66
              C49 79 66 88 76 83
              C82 80 88 74 86 69
              L71 57
              C68 55 65 56 62 60
              L56 66
              C47 62 38 53 34 44
              L40 38
              C43 35 43 32 41 29
              Z"
            fill="#FFFFFF"
          />
        </svg>
      </span>
    );
  }

  if (type === 'photos') {
    return (
      <span
        style={{
          ...base,
          background: '#FFFFFF',
        }}
      >
        <svg viewBox="0 0 100 100" width="100%" height="100%" aria-label="相册">
          <defs>
            <linearGradient id="petal-red" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FF655D" />
              <stop offset="100%" stopColor="#FF3B30" />
            </linearGradient>
            <linearGradient id="petal-orange" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFCE54" />
              <stop offset="100%" stopColor="#FF9500" />
            </linearGradient>
            <linearGradient id="petal-yellow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFF176" />
              <stop offset="100%" stopColor="#FFD60A" />
            </linearGradient>
            <linearGradient id="petal-green" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#73E6A5" />
              <stop offset="100%" stopColor="#30D158" />
            </linearGradient>
            <linearGradient id="petal-blue" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#64D2FF" />
              <stop offset="100%" stopColor="#0A84FF" />
            </linearGradient>
            <linearGradient id="petal-purple" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#BF8BFF" />
              <stop offset="100%" stopColor="#AF52DE" />
            </linearGradient>
          </defs>

          <g transform="translate(50 50)">
            <g transform="rotate(0)">
              <ellipse
                cx="0"
                cy="-22"
                rx="12.5"
                ry="22"
                fill="url(#petal-red)"
              />
            </g>
            <g transform="rotate(60)">
              <ellipse
                cx="0"
                cy="-22"
                rx="12.5"
                ry="22"
                fill="url(#petal-orange)"
              />
            </g>
            <g transform="rotate(120)">
              <ellipse
                cx="0"
                cy="-22"
                rx="12.5"
                ry="22"
                fill="url(#petal-yellow)"
              />
            </g>
            <g transform="rotate(180)">
              <ellipse
                cx="0"
                cy="-22"
                rx="12.5"
                ry="22"
                fill="url(#petal-green)"
              />
            </g>
            <g transform="rotate(240)">
              <ellipse
                cx="0"
                cy="-22"
                rx="12.5"
                ry="22"
                fill="url(#petal-blue)"
              />
            </g>
            <g transform="rotate(300)">
              <ellipse
                cx="0"
                cy="-22"
                rx="12.5"
                ry="22"
                fill="url(#petal-purple)"
              />
            </g>
            <circle r="10.5" fill="#FFFFFF" />
          </g>
        </svg>
      </span>
    );
  }

  if (type === 'music') {
    return (
      <span
        style={{
          ...base,
          background: '#222222',
          boxShadow: '0 2px 5px rgba(0,0,0,0.18)',
        }}
      >
        <img
          src="/images/treasure-new-wav.jpg"
          alt="TREASURE NEW WAV album cover"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            borderRadius: 'inherit',
          }}
        />
      </span>
    );
  }

  if (type === 'calendar') {
    return (
      <span
        style={{
          ...base,
          background: '#FFFFFF',
          boxShadow: 'inset 0 0 0 0.7px #E5E5EA',
          gridTemplateRows: '27% 1fr',
        }}
      >
        <span
          style={{
            width: '100%',
            height: '100%',
            background: '#FFFFFF',
            color: '#FF3B30',
            display: 'grid',
            placeItems: 'center',
            fontSize: 'clamp(7px, 1.5vw, 10px)',
            fontWeight: 700,
            letterSpacing: 0.2,
          }}
        >
          星期三
        </span>
        <span
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '1%',
            boxSizing: 'border-box',
            color: '#1C1C1E',
            fontSize: 'clamp(25px, 5vw, 36px)',
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: -1.5,
          }}
        >
          {new Date().getDate()}
        </span>
      </span>
    );
  }

  if (type === 'notes') {
    return (
      <span
        style={{
          ...base,
          background: 'linear-gradient(180deg, #FFFDF6 0%, #FFFFFF 100%)',
          boxShadow: 'inset 0 0 0 0.7px #E8E5D8',
        }}
      >
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <defs>
            <linearGradient id="notes-yellow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFE982" />
              <stop offset="100%" stopColor="#FFD84D" />
            </linearGradient>
          </defs>
          <rect
            x="0"
            y="12"
            width="100"
            height="24"
            fill="url(#notes-yellow)"
          />
          <path d="M0 36 H100" stroke="#F0D36A" strokeWidth="1" />
          {[49, 62, 75, 88].map((y) => (
            <line
              key={y}
              x1="10"
              y1={y}
              x2="90"
              y2={y}
              stroke="#E5DDBB"
              strokeWidth="1.5"
            />
          ))}
        </svg>
      </span>
    );
  }

  if (type === 'browser') {
    return (
      <span
        style={{
          ...base,
          background:
            'linear-gradient(145deg, #6DD5FA 0%, #2585F5 48%, #0754C9 100%)',
        }}
      >
        <svg viewBox="0 0 100 100" style={{ width: '84%', height: '84%' }}>
          <defs>
            <linearGradient id="safari-compass" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#DCEBFF" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="39" fill="url(#safari-compass)" />
          <circle
            cx="50"
            cy="50"
            r="34"
            fill="none"
            stroke="#C4DDFB"
            strokeWidth="1.5"
          />
          <g transform="rotate(35 50 50)">
            <path d="M50 13 L63 54 L50 47 L37 54 Z" fill="#FF453A" />
            <path d="M50 87 L37 46 L50 53 L63 46 Z" fill="#1685F8" />
          </g>
          <circle cx="50" cy="50" r="3" fill="#FFFFFF" />
        </svg>
      </span>
    );
  }

  if (type === 'settings') {
    return (
      <span
        style={{
          ...base,
          background:
            'linear-gradient(145deg, #E5E7EB 0%, #AEB4BE 52%, #858C98 100%)',
        }}
      >
        <svg viewBox="0 0 100 100" width="82%" height="82%">
          <defs>
            <linearGradient id="gear-metal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#D8DCE3" />
            </linearGradient>
          </defs>
          <g transform="translate(50 50)">
            <path
              d="M-7 -43 L7 -43 L11 -32 Q17 -30 22 -27 L32 -32 L42 -21 L36 -11 Q39 -5 39 0 Q39 6 36 11 L42 21 L32 32 L22 27 Q17 30 11 32 L7 43 L-7 43 L-11 32 Q-17 30 -22 27 L-32 32 L-42 21 L-36 11 Q-39 5 -39 0 Q-39 -6 -36 -11 L-42 -21 L-32 -32 L-22 -27 Q-17 -30 -11 -32 Z"
              fill="url(#gear-metal)"
              stroke="#F8F9FB"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <circle r="22" fill="#8F96A2" />
            <circle r="14" fill="#DDE1E7" />
            <circle r="8" fill="#A2A8B2" />
          </g>
        </svg>
      </span>
    );
  }

  return <span style={base} />;
}

function getTime() {
  return new Date().toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function getDate() {
  return new Date().toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
}

function readSaved<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveData(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 本地存储不可用时不影响当前操作
  }
}

function openExternal(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

function Header({
  title,
  onBack,
  right,
}: {
  title: string;
  onBack: () => void;
  right?: ReactNode;
}) {
  return (
    <header
      style={{
        flexShrink: 0,
        minHeight: 48,
        padding: '0 12px',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        background: '#fafafa',
        borderBottom: '1px solid #e9e9e9',
        gap: 4,
      }}
    >
      <button
        onClick={onBack}
        style={{ ...plainButton, textAlign: 'left', whiteSpace: 'nowrap' }}
      >
        ‹ 返回桌面
      </button>
      <strong style={{ whiteSpace: 'nowrap' }}>{title}</strong>
      <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>{right}</div>
    </header>
  );
}

function ExternalHome({
  title,
  onBack,
  url,
  description,
}: {
  title: string;
  onBack: () => void;
  url: string;
  description: string;
}) {
  return (
    <div style={{ ...page, background: '#fff' }}>
      <Header
        title={title}
        onBack={onBack}
        right={
          <button
            onClick={() => openExternal(url)}
            style={{ ...plainButton, fontSize: 11 }}
          >
            官方主页 ↗
          </button>
        }
      />
      <div style={{ ...content, textAlign: 'center', paddingTop: 35 }}>
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: 25,
            margin: '0 auto 18px',
            display: 'grid',
            placeItems: 'center',
            background:
              title === 'Instagram'
                ? 'linear-gradient(135deg,#833AB4,#FD1D1D,#FCAF45)'
                : '#FF0033',
            color: '#fff',
            fontSize: 38,
            fontWeight: 800,
          }}
        >
          {title === 'Instagram' ? '◎' : '▶'}
        </div>
        <h2 style={{ margin: '0 0 10px' }}>{title}</h2>
        <p style={{ color: '#777', fontSize: 13, lineHeight: 1.8 }}>
          {description}
        </p>
        <div style={{ ...card, marginTop: 25, textAlign: 'left' }}>
          <strong>TREASURE 官方主页</strong>
          <p style={{ color: '#777', fontSize: 12, overflowWrap: 'anywhere' }}>
            {url}
          </p>
          <button
            onClick={() => openExternal(url)}
            style={{ ...primaryButton, width: '100%' }}
          >
            打开真实主页 ↗
          </button>
        </div>
        <p style={{ color: '#999', fontSize: 11, lineHeight: 1.7 }}>
          官方网站会在新标签页打开。你可以随时点击左上角返回虚拟手机桌面。
        </p>
      </div>
    </div>
  );
}

function InstagramPage({ onBack }: { onBack: () => void }) {
  type Post = {
    id: number;
    user: string;
    name: string;
    location: string;
    image: string;
    caption: string;
    likes: string;
    official?: boolean;
  };

  const [tab, setTab] = useState<'home' | 'search' | 'profile'>('home');
  const [liked, setLiked] = useState<Record<number, boolean>>(() =>
    readSaved('virtual-instagram-likes', {})
  );
  const [saved, setSaved] = useState<Record<number, boolean>>(() =>
    readSaved('virtual-instagram-saved', {})
  );
  const [followed, setFollowed] = useState<Record<string, boolean>>(() =>
    readSaved('virtual-instagram-followed', {})
  );
  const [comments, setComments] = useState<Record<number, string[]>>(() =>
    readSaved('virtual-instagram-comments', {})
  );
  const [commentDraft, setCommentDraft] = useState('');
  const [query, setQuery] = useState('');
  const [storySeen, setStorySeen] = useState<Record<number, boolean>>({});
  const [activePost, setActivePost] = useState<number | null>(null);
  const [notice, setNotice] = useState('');
  const [composerOpen, setComposerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [captionDraft, setCaptionDraft] = useState('');
  const [publishedPosts, setPublishedPosts] = useState<Post[]>([]);
  const [dynamicLikes, setDynamicLikes] = useState<Record<number, number>>({});
  const [notification, setNotification] = useState('');

  const officialUrl = INSTAGRAM_URL;

  const photos: Post[] = [
    {
      id: 1,
      user: 'yg_treasure_official',
      name: 'TREASURE',
      location: 'TREASURE Official',
      image: '🎤',
      caption: 'TREASURE with TEUME ❤️ 오늘도 함께해 줘서 고마워!',
      likes: '128.4K',
      official: true,
    },
    {
      id: 2,
      user: 'doyoung',
      name: 'DOYOUNG',
      location: 'A little moment ♡',
      image: '🐰',
      caption: '오늘도 좋은 하루 보내기 ☀️',
      likes: '86,421',
    },
    {
      id: 3,
      user: 'doyoung',
      name: 'DOYOUNG',
      location: 'White mood',
      image: '🤍',
      caption: '🤍',
      likes: '92,318',
    },
    {
      id: 4,
      user: 'doyoung',
      name: 'DOYOUNG',
      location: 'Seoul, Korea',
      image: '🌷',
      caption: '이 순간도 오래 기억하고 싶어 ♡',
      likes: '74,206',
    },
    {
      id: 5,
      user: 'doyoung',
      name: 'DOYOUNG',
      location: 'Behind the scenes',
      image: '🖤',
      caption: '오늘의 분위기 🖤',
      likes: '68,512',
    },
    {
      id: 6,
      user: 'treasuremembers',
      name: 'TREASURE',
      location: 'With TREASURE MAKER',
      image: '✨',
      caption: '함께하는 순간들이 좋아 ✨',
      likes: '103K',
    },
  ];

  function publishPost() {
    const chosen = photos[selectedImage];

    if (!chosen) {
      setNotice('请选择一张图片');
      return;
    }

    const nextId =
      Math.max(
        0,
        ...photos.map((post) => post.id),
        ...publishedPosts.map((post) => post.id)
      ) + 1;

    const newPost: Post = {
      ...chosen,
      id: nextId,
      user: 'ringring.zip',
      name: '링링 ♡',
      location: '刚刚发布',
      caption: captionDraft.trim() || '今天也要开心呀 ♡',
      likes: '0',
      official: false,
    };

    setPublishedPosts((previous) => [newPost, ...previous]);
    setDynamicLikes((previous) => ({ ...previous, [nextId]: 0 }));
    setComposerOpen(false);
    setCaptionDraft('');
    setSelectedImage(0);
    setTab('home');
    setNotice('帖子发布成功！');

    // 发布 5 秒后，点赞数开始上涨
    window.setTimeout(() => {
      let count = 0;

      const timer = window.setInterval(() => {
        count = Math.min(count + 5000, 100000);

        setDynamicLikes((previous) => ({
          ...previous,
          [nextId]: count,
        }));

        if (count >= 100000) {
          window.clearInterval(timer);

          // 点赞达到 100,000 后，再等 5 秒弹出通知
          window.setTimeout(() => {
            setNotification('你的帖子获得了 100,000 个赞！♡');
          }, 5000);
        }
      }, 250);
    }, 5000);
  }

  const stories = [
    { name: '내 스토리', emoji: '➕', mine: true },
    { name: 'doyoung', emoji: '🐰' },
    { name: 'doyoung', emoji: '🤍' },
    { name: 'treasure', emoji: '💎' },
  ];

  const accounts = [
    {
      name: 'yg_treasure_official',
      desc: 'TREASURE · Official',
      emoji: '💎',
      official: true,
    },
    {
      name: 'doyoung',
      desc: 'DOYOUNG · TREASURE',
      emoji: '🐰',
    },
    {
      name: 'treasuremembers',
      desc: 'TREASURE MEMBERS',
      emoji: '🎤',
    },
    {
      name: 'ringring.zip',
      desc: '링링의 작은 기록 ♡',
      emoji: '🌷',
    },
  ];

  const buttonBase: React.CSSProperties = {
    border: 0,
    background: 'transparent',
    color: 'inherit',
    cursor: 'pointer',
    fontFamily: 'inherit',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    WebkitTapHighlightColor: 'transparent',
  };

  const actionButton: React.CSSProperties = {
    ...buttonBase,
    width: 38,
    height: 38,
    padding: 0,
    borderRadius: 10,
    fontSize: 23,
  };

  const smallButton: React.CSSProperties = {
    ...buttonBase,
    minWidth: 76,
    height: 34,
    padding: '0 12px',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 650,
  };

  function toggleLike(id: number) {
    const next = { ...liked, [id]: !liked[id] };
    setLiked(next);
    saveData('virtual-instagram-likes', next);
  }

  function toggleSave(id: number) {
    const next = { ...saved, [id]: !saved[id] };
    setSaved(next);
    saveData('virtual-instagram-saved', next);
    setNotice(next[id] ? '已收藏到你的帖子' : '已取消收藏');
  }

  function toggleFollow(name: string) {
    const next = { ...followed, [name]: !followed[name] };
    setFollowed(next);
    saveData('virtual-instagram-followed', next);
  }

  function addComment(id: number) {
    const value = commentDraft.trim();
    if (!value) return;

    const next = {
      ...comments,
      [id]: [...(comments[id] || []), value],
    };

    setComments(next);
    saveData('virtual-instagram-comments', next);
    setCommentDraft('');
  }

  const selected = photos.find((p) => p.id === activePost);

  function EmojiAvatar({
    emoji,
    size = 42,
    gradient = true,
  }: {
    emoji: string;
    size?: number;
    gradient?: boolean;
  }) {
    return (
      <div
        style={{
          width: size,
          height: size,
          flexShrink: 0,
          borderRadius: '50%',
          padding: gradient ? 2 : 0,
          boxSizing: 'border-box',
          background: gradient
            ? 'linear-gradient(35deg,#ffd776,#ff426f,#833ab4)'
            : '#f4edf7',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            border: gradient ? '2px solid white' : 'none',
            boxSizing: 'border-box',
            background: 'linear-gradient(145deg,#fff8fc,#f0eafa)',
            fontSize: size * 0.48,
          }}
        >
          {emoji}
        </div>
      </div>
    );
  }

  function EmojiPost({
    post,
    compact = false,
  }: {
    post: Post;
    compact?: boolean;
  }) {
    const palettes: Record<number, [string, string]> = {
      1: ['#e0e9ff', '#fce6f0'],
      2: ['#fff0e6', '#f9dce7'],
      3: ['#f6f4ff', '#e6e7fa'],
      4: ['#fff0f1', '#f9dbe6'],
      5: ['#e8e4ef', '#d4cbdc'],
      6: ['#e0f3f1', '#e8e5fb'],
    };

    const colors = palettes[post.id] || ['#f5f1f5', '#eeeaf5'];

    return (
      <div
        role="img"
        aria-label={`${post.name} emoji illustration`}
        style={{
          width: '100%',
          height: '100%',
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: compact ? 2 : 12,
          boxSizing: 'border-box',
          background: `linear-gradient(145deg,${colors[0]},${colors[1]})`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: compact ? '70%' : '76%',
            aspectRatio: '1',
            borderRadius: '50%',
            background: 'rgba(255,255,255,.48)',
          }}
        />
        <span
          style={{
            position: 'relative',
            fontSize: compact ? 29 : 'clamp(64px, 22vw, 112px)',
            lineHeight: 1.15,
            filter: 'drop-shadow(0 5px 8px rgba(80,50,80,.08))',
          }}
        >
          {post.image}
        </span>
        {!compact && (
          <div
            style={{
              position: 'relative',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              color: '#675a70',
            }}
          >
            {post.name === 'DOYOUNG' ? 'DOYOUNG ♡' : 'TREASURE ✦'}
          </div>
        )}
      </div>
    );
  }

  const pageStyle: React.CSSProperties = {
    ...page,
    position: 'relative',
    background: '#fff',
    color: '#262626',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
  };

  const sectionStyle: React.CSSProperties = {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    overflowX: 'hidden',
    scrollbarWidth: 'none',
    paddingBottom: 8,
  };

  return (
    <div style={pageStyle}>
      <Header title="Instagram" onBack={onBack} />

      <div
        style={{
          height: 48,
          flexShrink: 0,
          padding: '0 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #f2f2f2',
          background: '#fff',
        }}
      >
        <div
          style={{
            fontFamily: 'cursive',
            fontSize: 27,
            fontWeight: 800,
            letterSpacing: -1.2,
          }}
        >
          Instagram
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <button
            onClick={() => setNotice('暂时没有新通知')}
            style={actionButton}
            aria-label="通知"
          >
            ♡
          </button>
          <button
            onClick={() =>
              setNotice('这里是模拟 Instagram，暂不支持发送外部私信')
            }
            style={actionButton}
            aria-label="消息"
          >
            <span style={{ fontSize: 21, transform: 'rotate(-25deg)' }}>➤</span>
          </button>
        </div>
      </div>

      {tab === 'home' && (
        <div style={sectionStyle}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4,minmax(0,1fr))',
              gap: 6,
              padding: '13px 8px 12px',
              borderBottom: '1px solid #f1f1f1',
            }}
          >
            {stories.map((story, i) => (
              <button
                key={`${story.name}-${i}`}
                onClick={() => {
                  setStorySeen((old) => ({ ...old, [i]: true }));
                  if (i === 3) {
                    openExternal(officialUrl);
                  } else if (i === 0) {
                    setNotice('你的故事：暂未发布内容');
                  } else {
                    setNotice(`${story.name} 的限时动态`);
                  }
                }}
                style={{
                  ...buttonBase,
                  minWidth: 0,
                  width: '100%',
                  flexDirection: 'column',
                  gap: 5,
                  padding: 0,
                }}
              >
                <div
                  style={{
                    width: 58,
                    height: 58,
                    maxWidth: '100%',
                    padding: storySeen[i] ? 2 : 2.5,
                    borderRadius: '50%',
                    boxSizing: 'border-box',
                    background: storySeen[i]
                      ? '#d5d5d5'
                      : 'linear-gradient(35deg,#ffd776,#ff426f,#833ab4)',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      border: '2px solid white',
                      boxSizing: 'border-box',
                      background: story.mine ? '#f8f4fa' : '#f4edf7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: story.mine ? 27 : 29,
                    }}
                  >
                    {story.emoji}
                  </div>
                </div>
                <span
                  style={{
                    width: '100%',
                    fontSize: 10,
                    lineHeight: '14px',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {story.name}
                </span>
              </button>
            ))}
          </div>

          {[...publishedPosts, ...photos].map((post) => (
            <article
              key={post.id}
              style={{
                marginBottom: 8,
                borderBottom: '1px solid #f0f0f0',
                paddingBottom: 10,
                background: '#fff',
              }}
            >
              <div
                style={{
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  minWidth: 0,
                }}
              >
                <EmojiAvatar
                  emoji={post.id === 1 || post.id === 6 ? '💎' : post.image}
                  size={38}
                />

                <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 750,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {post.user}
                    {post.official && (
                      <span style={{ color: '#3897f0', flexShrink: 0 }}>✓</span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      marginTop: 3,
                      color: '#777',
                      textAlign: 'left',
                    }}
                  >
                    {post.location}
                  </div>
                </div>

                <button
                  style={actionButton}
                  onClick={() => setActivePost(post.id)}
                  aria-label="帖子详情"
                >
                  ···
                </button>
              </div>

              <button
                onDoubleClick={() => toggleLike(post.id)}
                onClick={() => {
                  if (post.official) openExternal(officialUrl);
                }}
                aria-label={`${post.user} 的帖子，双击点赞`}
                style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  display: 'block',
                  padding: 0,
                  border: 0,
                  background: '#f5f1f5',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
              >
                <EmojiPost post={post} />
              </button>

              <div
                style={{
                  padding: '5px 10px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <button
                  onClick={() => toggleLike(post.id)}
                  style={{
                    ...actionButton,
                    color: liked[post.id] ? '#ed4956' : '#161616',
                    fontSize: 27,
                  }}
                  aria-label="点赞"
                >
                  {liked[post.id] ? '♥' : '♡'}
                </button>

                <button
                  onClick={() => setActivePost(post.id)}
                  style={actionButton}
                  aria-label="评论"
                >
                  <svg
                    width="23"
                    height="23"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 11.5a8.5 8.5 0 0 1-12.9 7.3L3 20l1.2-4.1A8.5 8.5 0 1 1 21 11.5Z" />
                  </svg>
                </button>

                <button
                  onClick={() => setNotice('分享链接功能暂未接入')}
                  style={actionButton}
                  aria-label="分享"
                >
                  <svg
                    width="23"
                    height="23"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 16V3" />
                    <path d="m7 8 5-5 5 5" />
                    <path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
                  </svg>
                </button>

                <button
                  onClick={() => toggleSave(post.id)}
                  style={{
                    ...actionButton,
                    marginLeft: 'auto',
                    fontSize: 23,
                  }}
                  aria-label="收藏"
                >
                  {saved[post.id] ? '▣' : '♧'}
                </button>
              </div>

              <div
                style={{
                  padding: '2px 12px 0',
                  fontSize: 11,
                  lineHeight: 1.5,
                  textAlign: 'left',
                }}
              >
                <strong>
                  {liked[post.id] ? '你和 ' : ''}
                  {(dynamicLikes[post.id] ?? post.likes).toLocaleString
                    ? Number(
                        dynamicLikes[post.id] ?? post.likes
                      ).toLocaleString() + ' likes'
                    : post.likes + ' likes'}
                </strong>
              </div>

              <div
                style={{
                  padding: '4px 12px 0',
                  fontSize: 12,
                  lineHeight: 1.55,
                  overflowWrap: 'anywhere',
                  textAlign: 'left',
                }}
              >
                <strong style={{ marginRight: 5 }}>{post.user}</strong>
                {post.caption}
              </div>

              <button
                onClick={() => setActivePost(post.id)}
                style={{
                  ...buttonBase,
                  display: 'flex',
                  justifyContent: 'flex-start',
                  width: '100%',
                  minHeight: 30,
                  padding: '3px 12px 0',
                  color: '#8e8e8e',
                  fontSize: 11,
                  textAlign: 'left',
                }}
              >
                查看全部评论 · {comments[post.id]?.length || 0} 条
              </button>
            </article>
          ))}
        </div>
      )}

      {tab === 'search' && (
        <div style={{ ...sectionStyle, padding: 12, boxSizing: 'border-box' }}>
          <div
            style={{
              background: '#f2f2f2',
              borderRadius: 12,
              height: 42,
              padding: '0 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 20, color: '#777' }}>⌕</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索账号"
              style={{
                ...field,
                flex: 1,
                minWidth: 0,
                border: 0,
                outline: 'none',
                background: 'transparent',
                padding: '10px 0',
                fontSize: 13,
              }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                style={actionButton}
                aria-label="清除搜索"
              >
                ×
              </button>
            )}
          </div>

          <div style={{ margin: '20px 0 8px', fontSize: 14, fontWeight: 750 }}>
            为你推荐
          </div>

          {accounts
            .filter((a) =>
              `${a.name} ${a.desc}`.toLowerCase().includes(query.toLowerCase())
            )
            .map((account) => (
              <div
                key={account.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '11px 0',
                }}
              >
                <EmojiAvatar emoji={account.emoji} size={46} />

                <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 750,
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {account.name}
                    {account.official && (
                      <span style={{ color: '#3897f0', marginLeft: 4 }}>✓</span>
                    )}
                  </div>
                  <div style={{ fontSize: 10, color: '#888', marginTop: 4 }}>
                    {account.desc}
                  </div>
                </div>

                <button
                  onClick={() =>
                    account.official
                      ? openExternal(officialUrl)
                      : toggleFollow(account.name)
                  }
                  style={{
                    ...smallButton,
                    background:
                      !account.official && followed[account.name]
                        ? '#efefef'
                        : '#1688f8',
                    color:
                      !account.official && followed[account.name]
                        ? '#222'
                        : '#fff',
                  }}
                >
                  {account.official
                    ? '查看'
                    : followed[account.name]
                    ? '已关注'
                    : '关注'}
                </button>
              </div>
            ))}
        </div>
      )}

      {tab === 'profile' && (
        <div style={sectionStyle}>
          <div
            style={{
              padding: '14px 15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <strong style={{ fontSize: 16 }}>ringring.zip</strong>
            <button
              onClick={() => setNotice('个人主页设置')}
              style={actionButton}
              aria-label="主页设置"
            >
              ☰
            </button>
          </div>

          <div
            style={{
              padding: '4px 15px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 15,
            }}
          >
            <EmojiAvatar emoji="🐰" size={78} />

            <div
              style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'space-around',
                textAlign: 'center',
              }}
            >
              <div>
                <strong style={{ display: 'block', fontSize: 16 }}>
                  {photos.length}
                </strong>
                <span style={{ fontSize: 10 }}>帖子</span>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: 16 }}>
                  {Object.values(followed).filter(Boolean).length}
                </strong>
                <span style={{ fontSize: 10 }}>关注</span>
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: 16 }}>128</strong>
                <span style={{ fontSize: 10 }}>粉丝</span>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '0 15px 13px',
              fontSize: 11,
              lineHeight: 1.8,
              textAlign: 'left',
            }}
          >
            <strong>링링 ♡</strong>
            <div>김도영 좋아하는 일상 기록 🐰</div>
            <div style={{ color: '#555' }}>little moments, big feelings.</div>
            <div style={{ color: '#1688f8' }}>♡ @doyoung</div>
          </div>

          <div style={{ padding: '0 15px 14px' }}>
            <button
              onClick={() => openExternal(officialUrl)}
              style={{
                ...smallButton,
                width: '100%',
                background: '#fff',
                border: '1px solid #ddd',
              }}
            >
              查看 TREASURE 官方主页
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
              gap: 2,
            }}
          >
           {[...publishedPosts, ...photos].map((post) => (
              <button
                key={post.id}
                onClick={() => setActivePost(post.id)}
                style={{
                  aspectRatio: '1 / 1',
                  padding: 0,
                  border: 0,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  background: '#f5f1f5',
                }}
              >
                <EmojiPost post={post} compact />
              </button>
            ))}
          </div>

          <div style={{ padding: 12 }}>
            <button
              onClick={() => {
                const count = photos.filter((p) => saved[p.id]).length;
                setNotice(
                  count
                    ? `你收藏了 ${count} 条帖子`
                    : '还没有收藏帖子，点击动态旁的书签即可收藏'
                );
              }}
              style={{
                ...smallButton,
                width: '100%',
                height: 40,
                border: '1px solid #ddd',
                background: '#fff',
              }}
            >
              查看收藏（{Object.values(saved).filter(Boolean).length}）
            </button>
          </div>
        </div>
      )}

      <nav
        style={{
          flexShrink: 0,
          height: 54,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          borderTop: '1px solid #eee',
          background: '#fff',
          paddingBottom: 2,
        }}
      >
        {[
          { key: 'home', label: '首页', icon: '⌂' },
          { key: 'search', label: '搜索', icon: '⌕' },
          { key: 'create', label: '发布', icon: '+' },
          { key: 'profile', label: '个人主页', icon: '◎' },
        ].map((item) => {
          const active = tab === item.key;

          return (
            <button
              key={item.key}
              onClick={() => {
                setNotice('');
                setComposerOpen(true);
              }}
              aria-label={item.label}
              style={{
                ...buttonBase,
                width: 54,
                height: 46,
                borderRadius: 13,
                flexDirection: 'column',
                gap: 1,
                fontSize: item.key === 'create' ? 29 : 25,
                fontWeight: active ? 800 : 400,
                color: '#171717',
                background: active ? '#f5f3f5' : 'transparent',
              }}
            >
              <span style={{ lineHeight: 1.15 }}>{item.icon}</span>
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: active ? '#262626' : 'transparent',
                }}
              />
            </button>
          );
        })}
      </nav>

      {composerOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 18,
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 390,
              maxHeight: '85vh',
              overflowY: 'auto',
              background: '#fff',
              color: '#262626',
              borderRadius: 18,
              padding: 18,
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 18,
              }}
            >
              <button onClick={() => setComposerOpen(false)} style={buttonBase}>
                取消
              </button>

              <strong>创建新帖子</strong>

              <button
                onClick={publishPost}
                style={{
                  ...buttonBase,
                  color: '#0095f6',
                  fontWeight: 700,
                }}
              >
                发布
              </button>
            </div>

            <p style={{ fontSize: 13, color: '#777' }}>选择一张照片</p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 8,
              }}
            >
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => setSelectedImage(index)}
                  style={{
                    aspectRatio: '1',
                    borderRadius: 12,
                    border:
                      selectedImage === index
                        ? '3px solid #0095f6'
                        : '2px solid #eee',
                    background:
                      'linear-gradient(135deg, #fdf2f8, #e0e7ff, #d1fae5)',
                    fontSize: 42,
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  {photo.image}
                </button>
              ))}
            </div>

            <p style={{ fontSize: 13, color: '#777', marginTop: 18 }}>
              添加文案
            </p>

            <textarea
              value={captionDraft}
              onChange={(event) => setCaptionDraft(event.target.value)}
              placeholder="写下你的心情……"
              rows={4}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                resize: 'vertical',
                border: '1px solid #ddd',
                borderRadius: 12,
                padding: 12,
                fontSize: 14,
                outlineColor: '#0095f6',
              }}
            />

            <div
              style={{
                marginTop: 12,
                textAlign: 'center',
                fontSize: 12,
                color: '#999',
              }}
            >
              这是虚拟 Instagram 模拟发布
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div
          style={{
            position: 'fixed',
            top: 48,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 32px)',
            maxWidth: 350,
            zIndex: 1200,
            background: 'rgba(255,255,255,0.97)',
            color: '#262626',
            borderRadius: 16,
            padding: '14px 16px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              flexShrink: 0,
              borderRadius: 13,
              background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 23,
            }}
          >
            ♡
          </div>

          <div style={{ flex: 1, fontSize: 13 }}>
            <strong>Instagram · 刚刚</strong>
            <div style={{ marginTop: 4 }}>{notification}</div>
          </div>

          <button
            onClick={() => setNotification('')}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: 20,
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>
      )}

      {selected && (
        <div
          onClick={() => setActivePost(null)}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 20,
            background: 'rgba(0,0,0,.48)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 18,
            boxSizing: 'border-box',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              color: '#222',
              width: '100%',
              maxWidth: 340,
              maxHeight: '90%',
              borderRadius: 16,
              overflow: 'auto',
              boxShadow: '0 12px 45px rgba(0,0,0,.2)',
            }}
          >
            <div
              style={{
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                borderBottom: '1px solid #f2f2f2',
              }}
            >
              <EmojiAvatar
                emoji={
                  selected.id === 1 || selected.id === 6 ? '💎' : selected.image
                }
                size={34}
              />
              <strong style={{ fontSize: 12, flex: 1 }}>{selected.user}</strong>
              <button
                onClick={() => setActivePost(null)}
                style={actionButton}
                aria-label="关闭帖子"
              >
                ×
              </button>
            </div>

            <div
              style={{
                width: '100%',
                aspectRatio: '1 / 1',
                background: '#f5f1f5',
              }}
            >
              <EmojiPost post={selected} />
            </div>

            <div style={{ padding: 12, textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <button
                  onClick={() => toggleLike(selected.id)}
                  style={{
                    ...actionButton,
                    color: liked[selected.id] ? '#ed4956' : '#111',
                  }}
                  aria-label="点赞"
                >
                  {liked[selected.id] ? '♥' : '♡'}
                </button>
                <button
                  onClick={() => toggleSave(selected.id)}
                  style={actionButton}
                  aria-label="收藏"
                >
                  {saved[selected.id] ? '▣' : '♧'}
                </button>
              </div>

              <div style={{ fontSize: 12, marginTop: 6, lineHeight: 1.7 }}>
                <strong>{selected.user}</strong> {selected.caption}
              </div>

              <div style={{ marginTop: 15, fontSize: 12, fontWeight: 750 }}>
                评论（{comments[selected.id]?.length || 0}）
              </div>

              {(comments[selected.id] || []).map((comment, index) => (
                <div
                  key={`${selected.id}-${index}`}
                  style={{
                    marginTop: 9,
                    fontSize: 12,
                    lineHeight: 1.5,
                    overflowWrap: 'anywhere',
                  }}
                >
                  <strong>ringring.zip</strong> {comment}
                </div>
              ))}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addComment(selected.id);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  marginTop: 12,
                  borderTop: '1px solid #eee',
                  paddingTop: 10,
                }}
              >
                <input
                  value={commentDraft}
                  onChange={(e) => setCommentDraft(e.target.value)}
                  placeholder="添加评论..."
                  style={{
                    ...field,
                    flex: 1,
                    minWidth: 0,
                    height: 36,
                    boxSizing: 'border-box',
                    border: '1px solid #eee',
                    borderRadius: 9,
                    padding: '0 10px',
                    fontSize: 12,
                  }}
                />
                <button
                  type="submit"
                  style={{
                    ...smallButton,
                    minWidth: 54,
                    height: 36,
                    color: '#1688f8',
                    background: '#eef6ff',
                  }}
                >
                  发布
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {notice && (
        <div
          role="status"
          onClick={() => setNotice('')}
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 62,
            zIndex: 30,
            background: '#262626',
            color: '#fff',
            padding: '12px 14px',
            borderRadius: 12,
            fontSize: 12,
            lineHeight: 1.5,
            boxShadow: '0 4px 18px rgba(0,0,0,.2)',
            cursor: 'pointer',
          }}
        >
          {notice}　×
        </div>
      )}
    </div>
  );
}

function YouTubePage({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState('首页');
  const [selected, setSelected] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [subscribed, setSubscribed] = useState<Record<string, boolean>>({});
  const [liked, setLiked] = useState<Record<number, boolean>>({});

  const videos = [
    {
      id: 1,
      title: 'TREASURE - 官方频道',
      channel: 'TREASURE',
      views: '官方频道',
      duration: '频道',
      emoji: '💎',
      color: 'linear-gradient(135deg,#182d59,#7694d9)',
      url: YOUTUBE_URL,
    },
    {
      id: 2,
      title: 'TREASURE 官方音乐视频与舞台',
      channel: 'TREASURE',
      views: '前往官方频道观看',
      duration: 'MV',
      emoji: '🎤',
      color: 'linear-gradient(135deg,#f4d5bc,#d58c9b)',
      url: YOUTUBE_URL,
    },
    {
      id: 3,
      title: 'TREASURE behind the scenes',
      channel: 'TREASURE',
      views: '官方视频',
      duration: 'BEHIND',
      emoji: '🎬',
      color: 'linear-gradient(135deg,#b5c6de,#7c91a7)',
      url: YOUTUBE_URL,
    },
    {
      id: 4,
      title: 'TREASURE 音乐与播放列表',
      channel: 'TREASURE',
      views: '官方频道',
      duration: 'MUSIC',
      emoji: '🎧',
      color: 'linear-gradient(135deg,#d8b9dc,#7897c9)',
      url: YOUTUBE_URL,
    },
  ];

  if (selected !== null) {
    const video = videos.find((v) => v.id === selected);
    if (!video) return null;

    return (
      <div style={{ ...page, background: '#fff' }}>
        <Header
          title="YouTube"
          onBack={onBack}
          right={
            <button
              onClick={() => setSelected(null)}
              style={{ ...plainButton, fontSize: 11 }}
            >
              返回列表
            </button>
          }
        />
        <div style={{ ...content, padding: 0 }}>
          <button
            onClick={() => openExternal(video.url)}
            style={{
              width: '100%',
              aspectRatio: '16/9',
              border: 0,
              background: video.color,
              display: 'grid',
              placeItems: 'center',
              fontSize: 75,
              color: '#fff',
            }}
          >
            {video.emoji}
            <span style={{ fontSize: 13 }}>点击打开真实官方内容 ↗</span>
          </button>
          <div style={{ padding: 14 }}>
            <strong style={{ fontSize: 16 }}>{video.title}</strong>
            <p style={{ fontSize: 11, color: '#777' }}>{video.views}</p>
            <button
              onClick={() => openExternal(video.url)}
              style={{ ...primaryButton, width: '100%' }}
            >
              在 YouTube 打开 ↗
            </button>
            <div style={{ display: 'flex', gap: 10, margin: '14px 0' }}>
              <button
                onClick={() =>
                  setLiked({ ...liked, [video.id]: !liked[video.id] })
                }
                style={{
                  ...plainButton,
                  borderRadius: 18,
                  background: '#f2f2f2',
                  color: '#222',
                  padding: '8px 12px',
                }}
              >
                {liked[video.id] ? '👍 已点赞' : '👍 点赞'}
              </button>
              <button
                onClick={() => openExternal(video.url)}
                style={{
                  ...plainButton,
                  borderRadius: 18,
                  background: '#f2f2f2',
                  color: '#222',
                  padding: '8px 12px',
                }}
              >
                分享 ↗
              </button>
            </div>
            <div
              style={{
                ...card,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span style={{ fontSize: 27 }}>📺</span>
              <strong style={{ flex: 1 }}>TREASURE</strong>
              <button
                onClick={() => openExternal(YOUTUBE_URL)}
                style={{ ...primaryButton, borderRadius: 18 }}
              >
                官方频道 ↗
              </button>
            </div>
            <h3>更多官方内容</h3>
            {videos
              .filter((v) => v.id !== video.id)
              .map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelected(v.id)}
                  style={{
                    display: 'flex',
                    gap: 10,
                    width: '100%',
                    border: 0,
                    background: '#fff',
                    padding: '8px 0',
                    textAlign: 'left',
                  }}
                >
                  <span
                    style={{
                      width: 115,
                      aspectRatio: '16/9',
                      borderRadius: 8,
                      background: v.color,
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: 27,
                    }}
                  >
                    {v.emoji}
                  </span>
                  <span>
                    <strong style={{ fontSize: 12 }}>{v.title}</strong>
                    <small
                      style={{ display: 'block', color: '#777', marginTop: 6 }}
                    >
                      {v.channel}
                    </small>
                  </span>
                </button>
              ))}
          </div>
        </div>
      </div>
    );
  }

  const filtered = videos.filter((v) =>
    `${v.title} ${v.channel}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ ...page, background: '#fff' }}>
      <Header
        title="YouTube"
        onBack={onBack}
        right={
          <button
            onClick={() => openExternal(YOUTUBE_URL)}
            style={{ ...plainButton, fontSize: 11 }}
          >
            官方频道 ↗
          </button>
        }
      />
      <div style={{ padding: '12px 12px', display: 'flex', gap: 8 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索 TREASURE 视频"
          style={{ ...field, borderRadius: 20 }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          gap: 8,
          padding: '0 12px 12px',
          overflowX: 'auto',
        }}
      >
        {['首页', '音乐', 'TREASURE', '推荐'].map((item) => (
          <button
            key={item}
            onClick={() => setTab(item)}
            style={{
              border: 0,
              borderRadius: 8,
              padding: '8px 12px',
              background: tab === item ? '#222' : '#eee',
              color: tab === item ? '#fff' : '#222',
              whiteSpace: 'nowrap',
            }}
          >
            {item}
          </button>
        ))}
      </div>
      <div style={content}>
        <button
          onClick={() => openExternal(YOUTUBE_URL)}
          style={{
            ...card,
            width: '100%',
            boxSizing: 'border-box',
            border: 0,
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span
            style={{
              background: '#FF0033',
              color: '#fff',
              borderRadius: 10,
              padding: 10,
              fontSize: 24,
            }}
          >
            ▶
          </span>
          <span style={{ flex: 1 }}>
            <strong style={{ display: 'block' }}>TREASURE 官方 YouTube</strong>
            <small style={{ color: '#777' }}>查看真实 MV、舞台和幕后内容</small>
          </span>
          <span style={{ color: '#1688F8' }}>打开 ↗</span>
        </button>
        {filtered
          .filter(
            (v) =>
              tab !== 'TREASURE' || v.channel.toLowerCase().includes('treasure')
          )
          .filter((v) => tab !== '音乐' || v.title.includes('音乐'))
          .map((video) => (
            <button
              key={video.id}
              onClick={() => setSelected(video.id)}
              style={{
                width: '100%',
                padding: 0,
                border: 0,
                background: '#fff',
                textAlign: 'left',
                marginBottom: 19,
              }}
            >
              <div
                style={{
                  aspectRatio: '16/9',
                  borderRadius: 10,
                  background: video.color,
                  display: 'grid',
                  placeItems: 'center',
                  position: 'relative',
                  fontSize: 70,
                }}
              >
                {video.emoji}
                <span
                  style={{
                    position: 'absolute',
                    right: 8,
                    bottom: 8,
                    background: '#111b',
                    color: '#fff',
                    borderRadius: 4,
                    fontSize: 10,
                    padding: '3px 5px',
                  }}
                >
                  {video.duration}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 10, paddingTop: 9 }}>
                <span
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: '#eee',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  💎
                </span>
                <span>
                  <strong
                    style={{ display: 'block', fontSize: 13, lineHeight: 1.5 }}
                  >
                    {video.title}
                  </strong>
                  <span
                    style={{
                      display: 'block',
                      fontSize: 11,
                      color: '#777',
                      marginTop: 4,
                    }}
                  >
                    {video.channel} · {video.views}
                  </span>
                </span>
              </div>
            </button>
          ))}
        {filtered.length === 0 && (
          <p style={{ color: '#888', textAlign: 'center' }}>没有找到视频</p>
        )}
      </div>
      <nav
        style={{
          height: 48,
          borderTop: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        {['首页', 'Shorts', '订阅', '我的'].map((item) => (
          <button
            key={item}
            onClick={() =>
              item === '我的' ? openExternal(YOUTUBE_URL) : setTab(item)
            }
            style={{ ...plainButton, color: '#222', fontSize: 11 }}
          >
            {item}
          </button>
        ))}
      </nav>
    </div>
  );
}

function MusicPage() {
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const songs = [
    { title: 'DARARI', artist: 'TREASURE', emoji: '💎', color: '#a5b8df' },
    { title: 'HELLO', artist: 'TREASURE', emoji: '🌈', color: '#f2b8ca' },
    { title: 'MOVE', artist: 'TREASURE', emoji: '🎧', color: '#a9cdb5' },
    { title: 'YELLOW', artist: 'TREASURE', emoji: '☀️', color: '#f0d76e' },
  ];
  const song = songs[current];

  return (
    <div style={{ ...page, background: '#fff7fa' }}>
      <div style={content}>
        <div style={{ textAlign: 'center', color: '#a26d83', fontSize: 12 }}>
          NOW PLAYING
        </div>
        <div
          style={{
            aspectRatio: '1',
            maxWidth: 260,
            margin: '30px auto',
            borderRadius: 20,
            background: song.color,
            display: 'grid',
            placeItems: 'center',
            fontSize: 90,
            boxShadow: '0 15px 30px #0001',
          }}
        >
          {song.emoji}
        </div>
        <div style={{ textAlign: 'center' }}>
          <strong style={{ fontSize: 24 }}>{song.title}</strong>
          <p style={{ color: '#888' }}>{song.artist}</p>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 30,
            margin: '28px 0',
          }}
        >
          <button
            onClick={() =>
              setCurrent((current + songs.length - 1) % songs.length)
            }
            style={{ ...plainButton, fontSize: 25 }}
          >
            ⏮
          </button>
          <button
            onClick={() => setPlaying(!playing)}
            style={{
              border: 0,
              borderRadius: '50%',
              width: 58,
              height: 58,
              background: '#e84d79',
              color: '#fff',
              fontSize: 23,
            }}
          >
            {playing ? 'Ⅱ' : '▶'}
          </button>
          <button
            onClick={() => setCurrent((current + 1) % songs.length)}
            style={{ ...plainButton, fontSize: 25 }}
          >
            ⏭
          </button>
        </div>
        {songs.map((s, i) => (
          <button
            key={s.title}
            onClick={() => {
              setCurrent(i);
              setPlaying(true);
            }}
            style={{
              display: 'flex',
              width: '100%',
              gap: 12,
              padding: 12,
              border: 0,
              borderRadius: 12,
              background: i === current ? '#f8e0e9' : 'transparent',
              textAlign: 'left',
            }}
          >
            <span>{s.emoji}</span>
            <span style={{ flex: 1 }}>
              {s.title}
              <small style={{ display: 'block', color: '#888', marginTop: 4 }}>
                {s.artist}
              </small>
            </span>
            {i === current ? '♫' : ''}
          </button>
        ))}
        <p style={{ color: '#999', fontSize: 11 }}>
          当前为播放界面演示，尚未接入真实音频。
        </p>
      </div>
    </div>
  );
}

function CalendarPage() {
  const [month, setMonth] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [selected, setSelected] = useState(
    new Date().toLocaleDateString('en-CA')
  );
  const [events, setEvents] = useState<
    { id: number; date: string; title: string; time: string }[]
  >(() => readSaved('virtual-phone-events-v1', []));
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('12:00');
  const y = month.getFullYear();
  const m = month.getMonth();
  const days = new Date(y, m + 1, 0).getDate();
  const first = new Date(y, m, 1).getDay();

  function update(next: typeof events) {
    setEvents(next);
    saveData('virtual-phone-events-v1', next);
  }

  return (
    <div style={page}>
      <div style={content}>
        <div style={card}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <button
              style={{ ...plainButton, fontSize: 24 }}
              onClick={() => setMonth(new Date(y, m - 1, 1))}
            >
              ‹
            </button>
            <strong style={{ fontSize: 19 }}>
              {y}年{m + 1}月
            </strong>
            <button
              style={{ ...plainButton, fontSize: 24 }}
              onClick={() => setMonth(new Date(y, m + 1, 1))}
            >
              ›
            </button>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7,1fr)',
              textAlign: 'center',
              gap: '8px 0',
              marginTop: 15,
            }}
          >
            {['日', '一', '二', '三', '四', '五', '六'].map((d) => (
              <span key={d} style={{ color: '#999', fontSize: 12 }}>
                {d}
              </span>
            ))}
            {Array.from({ length: first }, (_, i) => (
              <span key={`blank-${i}`} />
            ))}
            {Array.from({ length: days }, (_, i) => {
              const day = i + 1;
              const date = `${y}-${String(m + 1).padStart(2, '0')}-${String(
                day
              ).padStart(2, '0')}`;
              return (
                <button
                  key={day}
                  onClick={() => setSelected(date)}
                  style={{
                    height: 35,
                    border: 0,
                    borderRadius: '50%',
                    background: selected === date ? '#f33' : 'transparent',
                    color: selected === date ? '#fff' : '#222',
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
        <div style={card}>
          <strong>{selected} · 日程</strong>
          {events
            .filter((e) => e.date === selected)
            .map((e) => (
              <div
                key={e.id}
                style={{
                  display: 'flex',
                  gap: 10,
                  padding: '12px 0',
                  borderBottom: '1px solid #eee',
                }}
              >
                <span style={{ color: '#f33' }}>{e.time}</span>
                <span style={{ flex: 1 }}>{e.title}</span>
                <button
                  onClick={() => update(events.filter((x) => x.id !== e.id))}
                  style={plainButton}
                >
                  删除
                </button>
              </div>
            ))}
          {!events.some((e) => e.date === selected) && (
            <p style={{ color: '#999', fontSize: 13 }}>这一天还没有日程。</p>
          )}
        </div>
        <div style={card}>
          <strong>添加日程</strong>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="日程名称"
            style={{ ...field, marginTop: 12 }}
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={{ ...field, marginTop: 8 }}
          />
          <button
            onClick={() => {
              if (!title.trim()) return;
              update([
                ...events,
                { id: Date.now(), date: selected, title: title.trim(), time },
              ]);
              setTitle('');
            }}
            style={{ ...primaryButton, width: '100%', marginTop: 10 }}
          >
            保存日程
          </button>
        </div>
      </div>
    </div>
  );
}

function NotesPage() {
  type Note = { id: number; title: string; body: string };
  const [notes, setNotes] = useState<Note[]>(() =>
    readSaved('virtual-phone-notes-v1', [
      { id: 1, title: '灵感收集', body: '把想做的事情，一件一件完成。' },
    ])
  );
  const [active, setActive] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  function update(next: Note[]) {
    setNotes(next);
    saveData('virtual-phone-notes-v1', next);
  }

  const note = notes.find((n) => n.id === active);
  if (note) {
    return (
      <div style={{ ...page, background: '#fff' }}>
        <Header
          title="编辑备忘录"
          onBack={() => setActive(null)}
          right={
            <button
              style={plainButton}
              onClick={() => {
                update(notes.filter((n) => n.id !== note.id));
                setActive(null);
              }}
            >
              删除
            </button>
          }
        />
        <div style={content}>
          <input
            value={note.title}
            onChange={(e) =>
              update(
                notes.map((n) =>
                  n.id === note.id ? { ...n, title: e.target.value } : n
                )
              )
            }
            placeholder="标题"
            style={{ ...field, fontSize: 23, border: 0 }}
          />
          <textarea
            value={note.body}
            onChange={(e) =>
              update(
                notes.map((n) =>
                  n.id === note.id ? { ...n, body: e.target.value } : n
                )
              )
            }
            placeholder="开始记录……"
            style={{
              ...field,
              marginTop: 12,
              minHeight: 300,
              border: 0,
              lineHeight: 1.8,
              resize: 'vertical',
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={page}>
      <div style={content}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <strong style={{ fontSize: 27 }}>备忘录</strong>
            <p style={{ color: '#888', fontSize: 12 }}>{notes.length} 条笔记</p>
          </div>
          <button
            onClick={() => {
              const n = { id: Date.now(), title: '', body: '' };
              update([n, ...notes]);
              setActive(n.id);
            }}
            style={{ ...primaryButton, fontSize: 22 }}
          >
            ＋
          </button>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索备忘录"
          style={{ ...field, marginBottom: 14 }}
        />
        {notes
          .filter((n) =>
            `${n.title} ${n.body}`.toLowerCase().includes(search.toLowerCase())
          )
          .map((n) => (
            <button
              key={n.id}
              onClick={() => setActive(n.id)}
              style={{
                ...card,
                display: 'block',
                width: '100%',
                border: 0,
                textAlign: 'left',
              }}
            >
              <strong>{n.title || '新建备忘录'}</strong>
              <p style={{ color: '#777', fontSize: 13 }}>
                {n.body || '没有其他内容'}
              </p>
            </button>
          ))}
      </div>
    </div>
  );
}

function BrowserPage() {
  const [address, setAddress] = useState('');
  const [history, setHistory] = useState<string[]>(() =>
    readSaved('virtual-phone-browser-history-v1', [])
  );
  const [current, setCurrent] = useState('');

  function go(value: string) {
    if (!value.trim()) return;
    const url = /^https?:\/\//i.test(value)
      ? value
      : value.includes('.') && !value.includes(' ')
      ? `https://${value}`
      : `https://www.google.com/search?q=${encodeURIComponent(value)}`;
    setAddress(url);
    setCurrent(url);
    const next = [url, ...history.filter((x) => x !== url)].slice(0, 12);
    setHistory(next);
    saveData('virtual-phone-browser-history-v1', next);
  }

  return (
    <div style={{ ...page, background: '#fff' }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          go(address);
        }}
        style={{ display: 'flex', gap: 7, padding: 12 }}
      >
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="搜索或输入网址"
          style={field}
        />
        <button style={primaryButton}>前往</button>
      </form>
      <div style={content}>
        {current ? (
          <div style={card}>
            <p style={{ overflowWrap: 'anywhere', fontSize: 12 }}>{current}</p>
            <p style={{ color: '#777', fontSize: 13 }}>
              部分网站不允许嵌入虚拟手机，可在新标签页打开。
            </p>
            <button onClick={() => openExternal(current)} style={primaryButton}>
              在新标签页打开 ↗
            </button>
            <button
              onClick={() => setCurrent('')}
              style={{
                ...primaryButton,
                background: '#eee',
                color: '#222',
                marginLeft: 8,
              }}
            >
              返回
            </button>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <div style={{ fontSize: 38 }}>Safari</div>
              <p style={{ color: '#888' }}>搜索互联网</p>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4,1fr)',
                gap: 10,
              }}
            >
              {[
                ['Google', 'G', '#4285f4', 'https://google.com'],
                ['YouTube', '▶', '#f33', YOUTUBE_URL],
                ['TREASURE', '💎', '#333', YOUTUBE_URL],
                ['Instagram', '◎', '#c13584', INSTAGRAM_URL],
              ].map(([name, icon, color, url]) => (
                <button
                  key={name}
                  onClick={() => go(url)}
                  style={{ border: 0, background: 'transparent', fontSize: 11 }}
                >
                  <span
                    style={{
                      display: 'grid',
                      placeItems: 'center',
                      width: 46,
                      height: 46,
                      margin: '0 auto 6px',
                      borderRadius: 13,
                      background: color,
                      color: '#fff',
                      fontSize: 21,
                    }}
                  >
                    {icon}
                  </span>
                  {name}
                </button>
              ))}
            </div>
            <h4>最近访问</h4>
            {history.map((url) => (
              <button
                key={url}
                onClick={() => go(url)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: 12,
                  border: 0,
                  borderBottom: '1px solid #eee',
                  background: '#fff',
                  textAlign: 'left',
                  overflowWrap: 'anywhere',
                }}
              >
                ◷　{url}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function SettingsPage() {
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(false);
  const [dark, setDark] = useState(false);

  const row = (title: string, value: boolean, set: (v: boolean) => void) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '15px 0',
        borderBottom: '1px solid #eee',
      }}
    >
      <span style={{ flex: 1 }}>{title}</span>
      <button
        onClick={() => set(!value)}
        style={{
          border: 0,
          borderRadius: 20,
          width: 48,
          height: 28,
          padding: 3,
          background: value ? '#34c759' : '#ccc',
          display: 'flex',
          justifyContent: value ? 'flex-end' : 'flex-start',
        }}
      >
        <span
          style={{
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: '#fff',
          }}
        />
      </button>
    </div>
  );

  return (
    <div
      style={{
        ...page,
        background: dark ? '#222' : '#f5f5f8',
        color: dark ? '#fff' : '#222',
      }}
    >
      <div style={content}>
        <div
          style={{ ...card, display: 'flex', gap: 13, alignItems: 'center' }}
        >
          <span style={{ fontSize: 35 }}>👤</span>
          <span>
            <strong>我的 iPhone</strong>
            <small style={{ display: 'block', marginTop: 5, color: '#888' }}>
              iPhone 17 Pro（模拟）
            </small>
          </span>
        </div>
        <div style={{ ...card, background: dark ? '#333' : '#fff' }}>
          {row('Wi-Fi', wifi, setWifi)}
          {row('蓝牙', bluetooth, setBluetooth)}
          {row('深色模式', dark, setDark)}
        </div>
        <div style={card}>
          <strong>关于本机</strong>
          <p style={{ color: '#888', fontSize: 13, lineHeight: 1.8 }}>
            系统：iOS 风格界面
            <br />
            数据：浏览器本地存储
            <br />
            版本：虚拟手机体验版
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [openedApp, setOpenedApp] = useState<string | null>(null);
  const [locked, setLocked] = useState(true);
  const [time, setTime] = useState(getTime);
  const [date, setDate] = useState(getDate);
  const [wallpaper, setWallpaper] = useState(
    'linear-gradient(145deg,#c7d8f1 0%,#9eb8e5 40%,#e9c9dc 100%)'
  );
  const [touchY, setTouchY] = useState<number | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTime(getTime());
      setDate(getDate());
    }, 15000);

    const onWallpaper = (event: Event) => {
      const name = (event as CustomEvent<string>).detail;
      const wallpapers: Record<string, string> = {
        蓝色海岸: 'linear-gradient(145deg,#8bbce9,#354f8a)',
        森林晨光: 'linear-gradient(145deg,#bad8a6,#47795f)',
        粉色晚霞: 'linear-gradient(145deg,#f8c9d7,#a16f9b)',
        深空夜色: 'linear-gradient(145deg,#34395e,#111321)',
      };
      setWallpaper(
        wallpapers[name] ||
          'linear-gradient(145deg,#c7d8f1 0%,#9eb8e5 40%,#e9c9dc 100%)'
      );
    };

    window.addEventListener('virtual-phone-wallpaper', onWallpaper);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('virtual-phone-wallpaper', onWallpaper);
    };
  }, []);

  return (
    <main className="stage">
      <section
        className="phone"
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        <div className="wallpaper" style={{ background: wallpaper }}>
          <div className="status-bar">
            <span>{time}</span>
            <div className="island">
              <span className="island-camera" />
            </div>
            <span className="status-icons" aria-label="手机信号和电量">
              <svg
                viewBox="0 0 48 18"
                width="48"
                height="18"
                fill="white"
                aria-hidden="true"
              >
                <path d="M1 15V11H5V15ZM7 15V8H11V15ZM13 15V5H17V15ZM19 15V2H23V15Z" />
                <path d="M28 5C33 1 40 1 45 5L42 8C38 5 33 5 30 8Z" />
                <path d="M31 10C34 7 39 7 42 10L39 13C37 11 35 11 33 13Z" />
                <rect x="35" y="14" width="3" height="2" rx="1" />
              </svg>
            </span>
          </div>

          <header className="home-date-block">
            <p className="home-weekday">{date.split(' ')[1] || date}</p>
            <h1>{time}</h1>
          </header>

          <div className="app-grid">
            {apps.map((app) => (
              <button
                className="app-item"
                key={app.name}
                onClick={() => setOpenedApp(app.name)}
                aria-label={`打开${app.name}`}
              >
                <span
                  className={`app-icon app-icon-${app.icon}`}
                  style={{ background: app.color }}
                >
                  <Icon type={app.icon} />
                </span>
                <span className="app-name">{app.name}</span>
              </button>
            ))}
          </div>

          <div className="dock">
            {apps.slice(0, 4).map((app) => (
              <button
                className="dock-icon"
                key={app.name}
                aria-label={app.name}
                onClick={() => setOpenedApp(app.name)}
              >
                <span
                  className={`app-icon app-icon-${app.icon}`}
                  style={{ background: app.color }}
                >
                  <Icon type={app.icon} />
                </span>
              </button>
            ))}
          </div>
          <div className="home-indicator" />
        </div>

        {locked && (
          <div
            onTouchStart={(e) => setTouchY(e.touches[0].clientY)}
            onTouchEnd={(e) => {
              if (touchY !== null && touchY - e.changedTouches[0].clientY > 35)
                setLocked(false);
              setTouchY(null);
            }}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1000,
              color: '#fff',
              background:
                'radial-gradient(ellipse at 20% 18%, rgba(172,155,255,.9) 0%, transparent 32%), radial-gradient(ellipse at 82% 36%, rgba(89,190,255,.72) 0%, transparent 35%), radial-gradient(ellipse at 55% 78%, rgba(250,139,207,.55) 0%, transparent 36%), linear-gradient(155deg, #10152f 0%, #292958 46%, #17152f 100%)',
              backdropFilter: 'blur(18px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '58px 20px 25px',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 18,
                left: 22,
                right: 22,
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 13,
              }}
            >
              <span>{time}</span>
              <span>●●●　Wi-Fi　▰</span>
            </div>
            <div style={{ fontSize: 15, marginTop: 25 }}>{date}</div>
            <div
              style={{
                fontSize: 76,
                fontWeight: 200,
                letterSpacing: -4,
                lineHeight: 1,
                textShadow: '0 4px 32px rgba(12, 10, 35, .22)',
                marginTop: 8,
              }}
            >
              {time}
            </div>

            <div
              style={{
                marginTop: 0,
                width: '100%',
                maxWidth: 320,
                padding: '12px 14px 10px',
                boxSizing: 'border-box',
                borderRadius: 24,
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.11)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                boxShadow: '0 16px 40px rgba(0,0,0,0.16)',
                color: '#fff',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 9,
                }}
              >
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 650,
                    letterSpacing: 0,
                    lineHeight: 1.2,
                  }}
                >
                  오늘의 일정
                </div>

                <div
                  style={{
                    padding: '6px 9px',
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.13)',
                    fontSize: 10,
                    letterSpacing: 0.5,
                  }}
                >
                  THU · 22
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0,
                }}
              >
                {[
                  {
                    time: '10:30',
                    title: '헤어 & 메이크업',
                    subtitle: 'Hair & Makeup',
                  },
                  {
                    time: '13:00',
                    title: '촬영 스케줄',
                    subtitle: 'Photo / Video Shoot',
                  },
                  {
                    time: '16:30',
                    title: '개인 연습',
                    subtitle: 'Personal Practice',
                  },
                  {
                    time: '19:00',
                    title: '저녁 & 휴식',
                    subtitle: 'Dinner & Rest',
                  },
                ].map((item) => (
                  <div
                    key={item.time}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '6px 0',
                      borderBottom: '1px solid rgba(255,255,255,0.12)',
                    }}
                  >
                    <div
                      style={{
                        width: 43,
                        flexShrink: 0,
                        fontSize: 12,
                        fontWeight: 600,
                        fontVariantNumeric: 'tabular-nums',
                        opacity: 0.9,
                      }}
                    >
                      {item.time}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          lineHeight: 1.25,
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          marginTop: 2,
                          fontSize: 10,
                          lineHeight: 1.2,
                          opacity: 0.65,
                        }}
                      >
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ flex: 1 }} />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                padding: '0 8px 28px',
                boxSizing: 'border-box',
              }}
            >
              <button
                onClick={() => setLocked(false)}
                style={{
                  width: 47,
                  height: 47,
                  borderRadius: '50%',
                  border: '1px solid #ffffff66',
                  background: '#ffffff30',
                  color: '#fff',
                  fontSize: 22,
                }}
              >
                ◉
              </button>
              <button
                onClick={() => setLocked(false)}
                style={{
                  width: 47,
                  height: 47,
                  borderRadius: '50%',
                  border: '1px solid #ffffff66',
                  background: '#ffffff30',
                  color: '#fff',
                  fontSize: 22,
                }}
              >
                ⌁
              </button>
            </div>
            <button
              onClick={() => setLocked(false)}
              style={{
                border: 0,
                background: 'transparent',
                color: '#fff',
                fontSize: 13,
                padding: '8px 20px 4px',
              }}
            >
              ↑　向上滑动或点击解锁
            </button>
            <div
              style={{
                width: 110,
                height: 4,
                borderRadius: 5,
                background: '#fff',
                marginTop: 14,
              }}
            />
          </div>
        )}

        {openedApp && !locked && (
          <div className="app-overlay">
            <div className="app-window">
              {openedApp === 'KKT' ? (
                <MessageApp onBack={() => setOpenedApp(null)} />
              ) : openedApp === '相册' ? (
                <PhotoApp onBack={() => setOpenedApp(null)} />
              ) : openedApp === '电话' ? (
                <PhoneApp onBack={() => setOpenedApp(null)} />
              ) : openedApp === 'Instagram' ? (
                <InstagramPage onBack={() => setOpenedApp(null)} />
              ) : openedApp === 'YouTube' ? (
                <YouTubePage onBack={() => setOpenedApp(null)} />
              ) : (
                <>
                  <Header title={openedApp} onBack={() => setOpenedApp(null)} />
                  {openedApp === '音乐' && <MusicPage />}
                  {openedApp === '日历' && <CalendarPage />}
                  {openedApp === '备忘录' && <NotesPage />}
                  {openedApp === '浏览器' && <BrowserPage />}
                  {openedApp === '设置' && <SettingsPage />}
                </>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
