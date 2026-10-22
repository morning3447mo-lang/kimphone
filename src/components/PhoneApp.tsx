import { useMemo, useState } from 'react';

type PhoneAppProps = {
  onBack: () => void;
};

type Contact = {
  id: string;
  name: string;
  koreanName: string;
  phone: string;
  birthday: string;
  color: string;
};

type CallRecord = {
  id: number;
  contactId?: string;
  name: string;
  phone: string;
  type: 'outgoing' | 'incoming' | 'missed';
  time: string;
};

const treasureContacts: Contact[] = [
  {
    id: 'hyunsuk',
    name: '崔玹硕',
    koreanName: '최현석',
    phone: '010-19990421',
    birthday: '1999.04.21',
    color: '#DCE8FF',
  },
  {
    id: 'jihoon',
    name: '朴志焄',
    koreanName: '박지훈',
    phone: '010-20000314',
    birthday: '2000.03.14',
    color: '#FFE3E8',
  },
  {
    id: 'yoshi',
    name: 'YOSHI',
    koreanName: '요시',
    phone: '010-20000515',
    birthday: '2000.05.15',
    color: '#E5DFFF',
  },
  {
    id: 'junkyu',
    name: '金俊奎',
    koreanName: '김준규',
    phone: '010-20000909',
    birthday: '2000.09.09',
    color: '#FFF0D6',
  },
  {
    id: 'jaehyuk',
    name: '尹材赫',
    koreanName: '윤재혁',
    phone: '010-20010723',
    birthday: '2001.07.23',
    color: '#DDF5E5',
  },
  {
    id: 'asahi',
    name: 'ASAHI',
    koreanName: '아사히',
    phone: '010-20010820',
    birthday: '2001.08.20',
    color: '#E0F0FF',
  },
  {
    id: 'doyoung',
    name: '金道荣',
    koreanName: '김도영',
    phone: '010-20031204',
    birthday: '2003.12.04',
    color: '#FFE8D8',
  },
  {
    id: 'haruto',
    name: '渡边温斗',
    koreanName: '하루토',
    phone: '010-20040405',
    birthday: '2004.04.05',
    color: '#E9E9EE',
  },
  {
    id: 'jeongwoo',
    name: '朴炡禹',
    koreanName: '박정우',
    phone: '010-20040928',
    birthday: '2004.09.28',
    color: '#F8E0F4',
  },
  {
    id: 'junghwan',
    name: '苏庭焕',
    koreanName: '소정환',
    phone: '010-20050218',
    birthday: '2005.02.18',
    color: '#DDF3F5',
  },
];

const initialCalls: CallRecord[] = [
  {
    id: 1,
    contactId: 'doyoung',
    name: '金道荣',
    phone: '010-20031204',
    type: 'missed',
    time: '今天 10:42',
  },
  {
    id: 2,
    contactId: 'jaehyuk',
    name: '尹材赫',
    phone: '010-20010723',
    type: 'incoming',
    time: '今天 09:18',
  },
  {
    id: 3,
    contactId: 'jihoon',
    name: '朴志焄',
    phone: '010-20000314',
    type: 'outgoing',
    time: '昨天 21:36',
  },
  {
    id: 4,
    contactId: 'junkyu',
    name: '金俊奎',
    phone: '010-20000909',
    type: 'incoming',
    time: '昨天 18:20',
  },
  {
    id: 5,
    contactId: 'asahi',
    name: 'ASAHI',
    phone: '010-20010820',
    type: 'outgoing',
    time: '昨天 14:05',
  },
];

const tabs = [
  { id: '收藏', label: '个人收藏', icon: '☆' },
  { id: '最近', label: '最近通话', icon: '◷' },
  { id: '通讯录', label: '通讯录', icon: '♙' },
  { id: '拨号', label: '拨号键盘', icon: '▦' },
] as const;

type TabId = (typeof tabs)[number]['id'];

const blue = '#007AFF';
const secondary = '#8E8E93';
const separator = '#E2E2E7';

function formatPhone(phone: string) {
  return phone;
}

function Avatar({ contact, size = 48 }: { contact: Contact; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: '50%',
        background: contact.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#454550',
        fontSize: size * 0.35,
        fontWeight: 600,
        letterSpacing: -0.5,
      }}
    >
      {contact.name.slice(0, 1)}
    </div>
  );
}

function SmallButton({
  children,
  onClick,
  color = blue,
}: {
  children: React.ReactNode;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        border: 0,
        background: 'transparent',
        color,
        fontSize: 16,
        padding: '7px 0',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}

export default function PhoneApp({ onBack }: PhoneAppProps) {
  const [activeTab, setActiveTab] = useState<TabId>('收藏');
  const [number, setNumber] = useState('');
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<string[]>([
    'doyoung',
    'jaehyuk',
    'jihoon',
  ]);
  const [calls, setCalls] = useState<CallRecord[]>(initialCalls);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [activeCall, setActiveCall] = useState<{
    name: string;
    phone: string;
    contactId?: string;
  } | null>(null);
  const [callMessage, setCallMessage] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filteredContacts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return treasureContacts;

    return treasureContacts.filter((contact) =>
      [
        contact.name,
        contact.koreanName,
        contact.phone,
        contact.id,
        contact.birthday,
      ].some((value) => value.toLowerCase().includes(query))
    );
  }, [search]);

  const favoriteContacts = treasureContacts.filter((contact) =>
    favorites.includes(contact.id)
  );

  const matchedContact = treasureContacts.find(
    (contact) =>
      contact.phone.replace(/\D/g, '') === number.replace(/\D/g, '') ||
      contact.phone.replace(/\D/g, '').endsWith(number.replace(/\D/g, ''))
  );

  function toggleFavorite(contactId: string) {
    setFavorites((old) =>
      old.includes(contactId)
        ? old.filter((id) => id !== contactId)
        : [...old, contactId]
    );
  }

  function startCall(contact?: Contact) {
    const phone = contact?.phone || number.trim();

    if (!phone) {
      setCallMessage('请先输入电话号码');
      return;
    }

    const target = contact
      ? {
          name: contact.name,
          phone: contact.phone,
          contactId: contact.id,
        }
      : {
          name: matchedContact?.name || '未知号码',
          phone,
          contactId: matchedContact?.id,
        };

    setCalls((old) => [
      {
        id: Date.now(),
        contactId: target.contactId,
        name: target.name,
        phone: target.phone,
        type: 'outgoing',
        time: '刚刚',
      },
      ...old,
    ]);

    setActiveCall({
      name: target.name,
      phone: target.phone,
      contactId: target.contactId,
    });

    setSelectedContact(null);
    setCallMessage('');
  }

  function endCall() {
    setActiveCall(null);
    setCallMessage('虚拟通话已结束');
    setActiveTab('最近');
  }

  function openDialer(phone = '') {
    setNumber(phone);
    setActiveTab('拨号');
    setSelectedContact(null);
    setCallMessage('');
  }

  function callIcon(type: CallRecord['type']) {
    if (type === 'missed') return { symbol: '↙', color: '#FF3B30' };
    if (type === 'incoming') return { symbol: '↙', color: secondary };
    return { symbol: '↗', color: secondary };
  }

  const rootStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    minHeight: 0,
    background: '#F2F2F7',
    color: '#111111',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxSizing: 'border-box',
  };

  const headerStyle: React.CSSProperties = {
    flexShrink: 0,
    padding: '12px 20px 10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#F2F2F7',
  };

  const scrollStyle: React.CSSProperties = {
    flex: '1 1 0',
    minHeight: 0,
    overflowY: 'auto',
    overflowX: 'hidden',

    // 更接近 iOS 原生列表滚动
    WebkitOverflowScrolling: 'touch',
    overscrollBehaviorY: 'auto',
    touchAction: 'pan-y',

    // 隐藏滚动条，避免网页感
    scrollbarWidth: 'none',

    padding: '8px 16px 18px',
    boxSizing: 'border-box',
  };

  const bottomStyle: React.CSSProperties = {
    flexShrink: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    padding: '9px 4px max(18px, env(safe-area-inset-bottom))',
    background: 'rgba(249,249,251,0.97)',
    borderTop: '1px solid #D8D8DE',
  };

  return (
    <div style={rootStyle}>
      <div
        style={{
          ...headerStyle,
          minHeight: 48,
          padding: '10px 20px 12px',
          background: 'rgba(242,242,247,0.96)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          borderBottom: '1px solid rgba(60,60,67,0.08)',
        }}
      >
        <div
          style={{ width: 64, display: 'flex', justifyContent: 'flex-start' }}
        >
          <SmallButton onClick={onBack}>‹ 返回</SmallButton>
        </div>

        <div
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: 17,
            fontWeight: 650,
            letterSpacing: -0.35,
            color: '#17171B',
          }}
        >
          {activeCall
            ? '通话中'
            : selectedContact
            ? selectedContact.name
            : activeTab === '收藏'
            ? '个人收藏'
            : activeTab === '最近'
            ? '最近通话'
            : activeTab === '通讯录'
            ? '通讯录'
            : '拨号键盘'}
        </div>

        <div style={{ width: 64, display: 'flex', justifyContent: 'flex-end' }}>
          {activeTab === '最近' && !activeCall ? (
            <SmallButton color={blue} onClick={() => setShowClearConfirm(true)}>
              编辑
            </SmallButton>
          ) : (
            <span style={{ width: 30 }} />
          )}
        </div>
      </div>

      {activeCall ? (
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '48px 24px 28px',
            background: 'linear-gradient(180deg, #F2F2F7 0%, #E9EAF0 100%)',
            boxSizing: 'border-box',
          }}
        >
          {(() => {
            const contact = treasureContacts.find(
              (item) => item.id === activeCall.contactId
            );

            return contact ? (
              <Avatar contact={contact} size={104} />
            ) : (
              <div
                style={{
                  width: 104,
                  height: 104,
                  borderRadius: '50%',
                  background: '#DADAE0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 42,
                }}
              >
                ☎
              </div>
            );
          })()}

          <div
            style={{
              marginTop: 22,
              fontSize: 29,
              fontWeight: 500,
              letterSpacing: -0.7,
            }}
          >
            {activeCall.name}
          </div>

          <div style={{ marginTop: 8, fontSize: 15, color: secondary }}>
            {activeCall.phone}
          </div>

          <div
            style={{
              marginTop: 15,
              color: '#34A853',
              fontSize: 14,
            }}
          >
            虚拟通话 · 正在连接
          </div>

          <div
            style={{
              marginTop: 'auto',
              paddingTop: 48,
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 68px)',
              gap: 26,
              justifyContent: 'center',
            }}
          >
            {[
              ['静音', '◖'],
              ['键盘', '▦'],
              ['扬声器', '◉'],
            ].map(([label, icon]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: 62,
                    height: 62,
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    margin: '0 auto 9px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 25,
                    color: '#33333A',
                  }}
                >
                  {icon}
                </div>
                <div style={{ fontSize: 12 }}>{label}</div>
              </div>
            ))}
          </div>

          <button
            onClick={endCall}
            style={{
              marginTop: 54,
              marginBottom: 20,
              width: 72,
              height: 72,
              borderRadius: '50%',
              border: 0,
              background: '#FF3B30',
              color: '#FFFFFF',
              fontSize: 30,
              cursor: 'pointer',
              boxShadow: '0 5px 15px #FF3B3030',
            }}
            aria-label="挂断虚拟通话"
          >
            ☎
          </button>

          <div style={{ color: secondary, fontSize: 12 }}>
            这是模拟通话，不会连接真实电话网络
          </div>
        </div>
      ) : selectedContact ? (
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            padding: '20px',
            boxSizing: 'border-box',
          }}
        >
          <SmallButton onClick={() => setSelectedContact(null)}>
            ‹ 返回列表
          </SmallButton>

          <div
            style={{
              padding: '28px 0 30px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar contact={selectedContact} size={104} />

            <div
              style={{
                marginTop: 17,
                fontSize: 27,
                fontWeight: 600,
                letterSpacing: -0.6,
              }}
            >
              {selectedContact.name}
            </div>

            <div style={{ marginTop: 6, color: secondary, fontSize: 15 }}>
              {selectedContact.koreanName}
            </div>

            <div
              style={{
                display: 'flex',
                gap: 28,
                marginTop: 25,
              }}
            >
              <button
                onClick={() => startCall(selectedContact)}
                style={{
                  border: 0,
                  background: '#FFFFFF',
                  borderRadius: 16,
                  padding: '13px 26px',
                  color: blue,
                  fontSize: 15,
                  cursor: 'pointer',
                }}
              >
                ☎ 电话
              </button>

              <button
                onClick={() => toggleFavorite(selectedContact.id)}
                style={{
                  border: 0,
                  background: '#FFFFFF',
                  borderRadius: 16,
                  padding: '13px 20px',
                  color: blue,
                  fontSize: 15,
                  cursor: 'pointer',
                }}
              >
                {favorites.includes(selectedContact.id) ? '★ 已收藏' : '☆ 收藏'}
              </button>
            </div>
          </div>

          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 13,
              padding: '4px 16px',
            }}
          >
            <div
              style={{
                padding: '13px 0',
                borderBottom: `1px solid ${separator}`,
              }}
            >
              <div style={{ fontSize: 12, color: secondary }}>手机</div>
              <div style={{ color: blue, fontSize: 17, marginTop: 5 }}>
                {formatPhone(selectedContact.phone)}
              </div>
            </div>

            <div style={{ padding: '13px 0' }}>
              <div style={{ fontSize: 12, color: secondary }}>生日</div>
              <div style={{ fontSize: 16, marginTop: 5 }}>
                {selectedContact.birthday}
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              color: secondary,
              fontSize: 12,
              lineHeight: 1.6,
            }}
          >
            虚拟联系人资料。电话号码根据成员生日设计，仅用于此模拟项目。
          </div>
        </div>
      ) : (
        <>
          <div style={scrollStyle}>
            {activeTab === '收藏' && (
              <div>
                <div
                  style={{
                    fontSize: 30,
                    fontWeight: 700,
                    letterSpacing: -1,
                    margin: '12px 0 20px',
                  }}
                >
                  个人收藏
                </div>

                {favoriteContacts.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      color: secondary,
                      padding: '90px 0',
                    }}
                  >
                    <div style={{ fontSize: 42 }}>☆</div>
                    <div style={{ marginTop: 12 }}>还没有收藏联系人</div>
                    <div style={{ fontSize: 13, marginTop: 6 }}>
                      可以在通讯录中添加成员
                    </div>
                    <SmallButton onClick={() => setActiveTab('通讯录')}>
                      前往通讯录
                    </SmallButton>
                  </div>
                ) : (
                  <div
                    style={{
                      background: '#FFFFFF',
                      borderRadius: 14,
                      padding: '0 14px',
                    }}
                  >
                    {favoriteContacts.map((contact, index) => (
                      <button
                        key={contact.id}
                        onClick={() => setSelectedContact(contact)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          textAlign: 'left',
                          border: 0,
                          borderBottom:
                            index === favoriteContacts.length - 1
                              ? 0
                              : `1px solid ${separator}`,
                          background: 'transparent',
                          padding: '13px 0',
                          cursor: 'pointer',
                        }}
                      >
                        <Avatar contact={contact} size={50} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 16, fontWeight: 500 }}>
                            {contact.name}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: secondary,
                              marginTop: 4,
                            }}
                          >
                            {contact.koreanName}
                          </div>
                        </div>
                        <span style={{ color: '#C7C7CC', fontSize: 24 }}>
                          ›
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                <div
                  style={{
                    fontSize: 13,
                    color: secondary,
                    marginTop: 25,
                    marginBottom: 10,
                  }}
                >
                  TREASURE 成员
                </div>

                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 14,
                    padding: '0 14px',
                  }}
                >
                  {treasureContacts.map((contact, index) => (
                    <button
                      key={contact.id}
                      onClick={() => setSelectedContact(contact)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        textAlign: 'left',
                        border: 0,
                        borderBottom:
                          index === treasureContacts.length - 1
                            ? 0
                            : `1px solid ${separator}`,
                        background: 'transparent',
                        padding: '11px 0',
                        cursor: 'pointer',
                      }}
                    >
                      <Avatar contact={contact} size={42} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 15 }}>{contact.name}</div>
                        <div
                          style={{
                            fontSize: 12,
                            color: secondary,
                            marginTop: 3,
                          }}
                        >
                          {contact.koreanName}
                        </div>
                      </div>
                      <span style={{ color: '#C7C7CC', fontSize: 23 }}>›</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === '最近' && (
              <div>
                <div
                  style={{
                    fontSize: 30,
                    fontWeight: 700,
                    letterSpacing: -1,
                    margin: '12px 0 18px',
                  }}
                >
                  最近通话
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    marginBottom: 15,
                  }}
                >
                  <button
                    onClick={() => setCalls((old) => [...old].reverse())}
                    style={{
                      border: `1px solid ${separator}`,
                      background: '#FFFFFF',
                      borderRadius: 9,
                      padding: '7px 12px',
                      color: blue,
                      fontSize: 13,
                    }}
                  >
                    切换排序
                  </button>
                  <div
                    style={{
                      alignSelf: 'center',
                      color: secondary,
                      fontSize: 12,
                    }}
                  >
                    {calls.length} 条记录 · 模拟数据
                  </div>
                </div>

                {calls.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      color: secondary,
                      padding: '90px 0',
                    }}
                  >
                    <div style={{ fontSize: 42 }}>◷</div>
                    <div style={{ marginTop: 12 }}>暂无通话记录</div>
                  </div>
                ) : (
                  <div
                    style={{
                      background: '#FFFFFF',
                      borderRadius: 14,
                      padding: '0 14px',
                    }}
                  >
                    {calls.map((call, index) => {
                      const contact = treasureContacts.find(
                        (item) => item.id === call.contactId
                      );
                      const icon = callIcon(call.type);

                      return (
                        <div
                          key={call.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 11,
                            padding: '13px 0',
                            borderBottom:
                              index === calls.length - 1
                                ? 0
                                : `1px solid ${separator}`,
                          }}
                        >
                          {contact ? (
                            <Avatar contact={contact} size={45} />
                          ) : (
                            <div
                              style={{
                                width: 45,
                                height: 45,
                                borderRadius: '50%',
                                background: '#E5E5EA',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: secondary,
                              }}
                            >
                              ☎
                            </div>
                          )}

                          <button
                            onClick={() => {
                              if (contact) setSelectedContact(contact);
                              else openDialer(call.phone);
                            }}
                            style={{
                              flex: 1,
                              minWidth: 0,
                              textAlign: 'left',
                              border: 0,
                              padding: 0,
                              background: 'transparent',
                              cursor: 'pointer',
                            }}
                          >
                            <div
                              style={{
                                fontSize: 15,
                                fontWeight: 500,
                                color:
                                  call.type === 'missed'
                                    ? '#FF3B30'
                                    : '#17171B',
                              }}
                            >
                              {call.name}
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                color: secondary,
                                marginTop: 5,
                              }}
                            >
                              <span style={{ color: icon.color }}>
                                {icon.symbol}
                              </span>{' '}
                              {call.type === 'missed'
                                ? '未接来电'
                                : call.type === 'incoming'
                                ? '来电'
                                : '已拨电话'}
                              {' · '}
                              {call.time}
                            </div>
                          </button>

                          <button
                            onClick={() => openDialer(call.phone)}
                            aria-label={`拨打 ${call.name}`}
                            style={{
                              border: 0,
                              background: 'transparent',
                              color: blue,
                              fontSize: 22,
                              cursor: 'pointer',
                              padding: 5,
                            }}
                          >
                            ⓘ
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === '通讯录' && (
              <div>
                <div
                  style={{
                    fontSize: 30,
                    fontWeight: 700,
                    letterSpacing: -1,
                    margin: '12px 0 18px',
                  }}
                >
                  通讯录
                </div>

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="搜索姓名、韩文名或号码"
                  aria-label="搜索联系人"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    border: 0,
                    borderRadius: 11,
                    padding: '11px 13px',
                    background: '#E3E3E8',
                    fontSize: 15,
                    outline: 'none',
                    marginBottom: 17,
                  }}
                />

                <div
                  style={{
                    fontSize: 13,
                    color: secondary,
                    marginBottom: 9,
                  }}
                >
                  TREASURE · {filteredContacts.length} 位成员
                </div>

                <div
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 14,
                    padding: '0 14px',
                  }}
                >
                  {filteredContacts.map((contact, index) => (
                    <button
                      key={contact.id}
                      onClick={() => setSelectedContact(contact)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        textAlign: 'left',
                        border: 0,
                        borderBottom:
                          index === filteredContacts.length - 1
                            ? 0
                            : `1px solid ${separator}`,
                        background: 'transparent',
                        padding: '12px 0',
                        cursor: 'pointer',
                      }}
                    >
                      <Avatar contact={contact} size={45} />

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 500 }}>
                          {contact.name}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: secondary,
                            marginTop: 4,
                          }}
                        >
                          {contact.koreanName}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: secondary,
                            marginTop: 4,
                          }}
                        >
                          {contact.phone}
                        </div>
                      </div>

                      {favorites.includes(contact.id) && (
                        <span style={{ color: '#FFB340', fontSize: 18 }}>
                          ★
                        </span>
                      )}

                      <span style={{ color: '#C7C7CC', fontSize: 23 }}>›</span>
                    </button>
                  ))}

                  {filteredContacts.length === 0 && (
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '36px 8px',
                        color: secondary,
                        fontSize: 14,
                      }}
                    >
                      没有找到匹配的联系人
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === '拨号' && (
              <div
                style={{
                  maxWidth: 330,
                  margin: '0 auto',
                  paddingTop: 12,
                }}
              >
                <div
                  style={{
                    height: 82,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    fontSize: number.length > 14 ? 19 : 27,
                    letterSpacing: 1,
                    overflowWrap: 'anywhere',
                    wordBreak: 'break-all',
                  }}
                >
                  {number || <span style={{ color: '#B8B8BE' }}>输入号码</span>}
                </div>

                {matchedContact && number.length > 3 && (
                  <button
                    onClick={() => setSelectedContact(matchedContact)}
                    style={{
                      border: 0,
                      background: 'transparent',
                      color: blue,
                      display: 'block',
                      margin: '0 auto 10px',
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    匹配联系人：{matchedContact.name} · 查看资料
                  </button>
                )}

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                    gap: '12px 19px',
                    maxWidth: 280,
                    margin: '0 auto',
                  }}
                >
                  {[
                    ['1', ''],
                    ['2', 'ABC'],
                    ['3', 'DEF'],
                    ['4', 'GHI'],
                    ['5', 'JKL'],
                    ['6', 'MNO'],
                    ['7', 'PQRS'],
                    ['8', 'TUV'],
                    ['9', 'WXYZ'],
                    ['*', ''],
                    ['0', '+'],
                    ['#', ''],
                  ].map(([digit, letters]) => (
                    <button
                      key={digit}
                      onClick={() => {
                        setNumber((old) =>
                          old.length < 20 ? old + digit : old
                        );
                        setCallMessage('');
                      }}
                      style={{
                        width: '100%',
                        aspectRatio: '1',
                        maxWidth: 76,
                        maxHeight: 76,
                        justifySelf: 'center',
                        border: 0,
                        borderRadius: '50%',
                        background: '#FFFFFF',
                        color: '#17171B',
                        fontSize: 27,
                        fontWeight: 400,
                        boxShadow: '0 1px 2px #0000000A',
                        cursor: 'pointer',
                      }}
                    >
                      {digit}
                      {letters && (
                        <div
                          style={{
                            fontSize: 9,
                            letterSpacing: 1.5,
                            marginTop: 1,
                            fontWeight: 600,
                          }}
                        >
                          {letters}
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 29,
                    marginTop: 20,
                  }}
                >
                  <div style={{ width: 54 }} />

                  <button
                    onClick={() => {
                      if (number) startCall();
                      else setCallMessage('请先输入电话号码');
                    }}
                    aria-label="拨打虚拟电话"
                    style={{
                      width: 62,
                      height: 62,
                      borderRadius: '50%',
                      border: 0,
                      background: '#34C759',
                      color: '#FFFFFF',
                      fontSize: 27,
                      cursor: 'pointer',
                      boxShadow: '0 3px 9px #34C75935',
                    }}
                  >
                    ☎
                  </button>

                  <button
                    onClick={() => {
                      setNumber((old) => old.slice(0, -1));
                      setCallMessage('');
                    }}
                    aria-label="删除最后一位数字"
                    style={{
                      width: 54,
                      height: 54,
                      border: 0,
                      background: 'transparent',
                      color: '#6E6E73',
                      fontSize: 26,
                      cursor: 'pointer',
                    }}
                  >
                    ⌫
                  </button>
                </div>

                {number && (
                  <button
                    onClick={() => {
                      setNumber('');
                      setCallMessage('');
                    }}
                    style={{
                      display: 'block',
                      border: 0,
                      background: 'transparent',
                      color: blue,
                      margin: '10px auto 0',
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    清空号码
                  </button>
                )}

                {callMessage && (
                  <div
                    style={{
                      textAlign: 'center',
                      color: secondary,
                      fontSize: 13,
                      marginTop: 14,
                    }}
                  >
                    {callMessage}
                  </div>
                )}

                <div
                  style={{
                    textAlign: 'center',
                    color: secondary,
                    fontSize: 11,
                    marginTop: 17,
                    lineHeight: 1.6,
                  }}
                >
                  虚拟拨号 · 不会连接真实电话网络
                </div>
              </div>
            )}
          </div>

          <div style={bottomStyle}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedContact(null);
                  setCallMessage('');
                }}
                style={{
                  border: 0,
                  background: 'transparent',
                  color: activeTab === tab.id ? blue : secondary,
                  fontSize: 10,
                  padding: '2px 0',
                  cursor: 'pointer',
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    fontSize: 23,
                    lineHeight: 1.2,
                    marginBottom: 4,
                  }}
                >
                  {tab.icon}
                </div>
                {tab.label}
              </button>
            ))}
          </div>
        </>
      )}

      {showClearConfirm && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 20,
            background: '#00000040',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 300,
              background: '#FFFFFF',
              borderRadius: 16,
              padding: 22,
              textAlign: 'center',
              boxShadow: '0 10px 35px #00000020',
            }}
          >
            <div style={{ fontSize: 17, fontWeight: 600 }}>清空最近通话？</div>
            <div
              style={{
                color: secondary,
                fontSize: 13,
                lineHeight: 1.6,
                marginTop: 9,
              }}
            >
              这会清除当前模拟电话 App 中的通话记录。
            </div>

            <button
              onClick={() => {
                setCalls([]);
                setShowClearConfirm(false);
              }}
              style={{
                width: '100%',
                border: 0,
                borderRadius: 10,
                background: '#FF3B30',
                color: '#FFFFFF',
                padding: 11,
                marginTop: 20,
                fontSize: 15,
                cursor: 'pointer',
              }}
            >
              清空记录
            </button>

            <button
              onClick={() => setShowClearConfirm(false)}
              style={{
                width: '100%',
                border: 0,
                borderRadius: 10,
                background: '#F2F2F7',
                color: blue,
                padding: 11,
                marginTop: 9,
                fontSize: 15,
                cursor: 'pointer',
              }}
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
