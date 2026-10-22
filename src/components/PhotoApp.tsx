
import { useRef, useState } from 'react';

type Photo = {
  id: number;
  emoji: string;
  title: string;
  date: string;
  color: string;
  imageUrl: string;
};

const STORAGE_KEY = 'virtual-phone-photos-v1';
const FAVORITES_KEY = 'virtual-phone-photo-favorites';

const initialPhotos: Photo[] = [
  {
    id: 1,
    emoji: '🐰',
    title: '今天的道荣',
    date: '今天',
    color: '#F4DCE5',
    imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600',
  },
  {
    id: 2,
    emoji: '🌷',
    title: '春日约会',
    date: '10月18日',
    color: '#F4E6D8',
    imageUrl: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=600',
  },
  {
    id: 3,
    emoji: '💎',
    title: 'TREASURE',
    date: '10月15日',
    color: '#DCE7F8',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600',
  },
  {
    id: 4,
    emoji: '☁️',
    title: '云朵与晚风',
    date: '10月12日',
    color: '#E5E4F5',
    imageUrl: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=600',
  },
  {
    id: 5,
    emoji: '🎧',
    title: '一起听歌',
    date: '10月9日',
    color: '#F5E7C9',
    imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600',
  },
  {
    id: 6,
    emoji: '🧸',
    title: '可爱收藏',
    date: '10月6日',
    color: '#DDEBDD',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600',
  },
];

function loadPhotos(): Photo[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Photo[]) : initialPhotos;
  } catch {
    return initialPhotos;
  }
}

function loadFavorites(): number[] {
  try {
    const saved = localStorage.getItem(FAVORITES_KEY);
    return saved ? (JSON.parse(saved) as number[]) : [];
  } catch {
    return [];
  }
}

function PhotoSymbol({ name, size = 22 }: { name: string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  };

  switch (name) {
    case 'back':
      return <svg {...common}><path d="M15 18l-6-6 6-6" /><path d="M9 12h11" /></svg>;
    case 'heart':
      return <svg {...common}><path d="M20.8 8.7c0 5.2-8.8 10-8.8 10s-8.8-4.8-8.8-10A4.7 4.7 0 0 1 12 6.4a4.7 4.7 0 0 1 8.8 2.3Z" /></svg>;
    case 'plus':
      return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>;
    case 'trash':
      return <svg {...common}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>;
    case 'grid':
      return <svg {...common}><rect x="3.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.5" /></svg>;
    case 'albums':
      return <svg {...common}><rect x="5" y="5" width="15" height="15" rx="3" /><path d="M3 16V5a2 2 0 0 1 2-2h11" /></svg>;
    case 'search':
      return <svg {...common}><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></svg>;
    case 'share':
      return <svg {...common}><path d="M12 15V3M7.5 7.5 12 3l4.5 4.5" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" /></svg>;
    default:
      return null;
  }
}

export default function PhotoApp({ onBack }: { onBack: () => void }) {
  const [photos, setPhotos] = useState<Photo[]>(loadPhotos);
  const [favoriteIds, setFavoriteIds] = useState<number[]>(loadFavorites);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [formError, setFormError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function savePhotos(next: Photo[]) {
    setPhotos(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      setFormError('浏览器存储空间不足，请尝试使用较小的图片。');
    }
  }

  function saveFavorites(next: number[]) {
    setFavoriteIds(next);
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    } catch {
      // 收藏状态仍会在当前页面中更新。
    }
  }

  function toggleFavorite(id: number) {
    saveFavorites(
      favoriteIds.includes(id)
        ? favoriteIds.filter((item) => item !== id)
        : [...favoriteIds, id],
    );
  }

  function addPhoto(url: string) {
    const cleanUrl = url.trim();
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      setFormError('请先为照片填写名称。');
      return;
    }

    if (!cleanUrl) {
      setFormError('请填写图片链接，或从设备选择一张照片。');
      return;
    }

    if (!/^https?:\/\/\S+/i.test(cleanUrl) && !cleanUrl.startsWith('data:image/')) {
      setFormError('图片链接需要以 http:// 或 https:// 开头。');
      return;
    }

    const photo: Photo = {
      id: Date.now(),
      emoji: '📷',
      title: cleanTitle,
      date: '刚刚',
      color: '#E5E5EA',
      imageUrl: cleanUrl,
    };

    savePhotos([photo, ...photos]);
    setTitle('');
    setImageUrl('');
    setFormError('');
    setShowAddForm(false);
    setShowFavoritesOnly(false);
    setSelectedPhoto(photo);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('请选择图片文件。');
      return;
    }

    if (file.size > 1.5 * 1024 * 1024) {
      setFormError('图片太大了，请选择小于 1.5 MB 的图片。');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        addPhoto(reader.result);
      } else {
        setFormError('读取图片失败，请重试。');
      }
    };
    reader.onerror = () => setFormError('读取图片失败，请重试。');
    reader.readAsDataURL(file);
    event.target.value = '';
  }

  function deleteSelectedPhoto() {
    if (!selectedPhoto) return;

    savePhotos(photos.filter((photo) => photo.id !== selectedPhoto.id));
    saveFavorites(favoriteIds.filter((id) => id !== selectedPhoto.id));
    setSelectedPhoto(null);
    setShowDeleteConfirm(false);
  }

  const visiblePhotos = photos.filter(
    (photo) => !showFavoritesOnly || favoriteIds.includes(photo.id),
  );

  function handleBack() {
    if (showAddForm) {
      setShowAddForm(false);
      setFormError('');
    } else if (selectedPhoto) {
      setSelectedPhoto(null);
      setShowDeleteConfirm(false);
    } else {
      onBack();
    }
  }

  return (
    <div className="photo-app">
      <div className="photo-status-spacer" />

      <header className="photo-header">
        <div className="photo-header-top">
          <button className="photo-back" onClick={handleBack} aria-label="返回">
            <PhotoSymbol name="back" size={21} />
            <span>{showAddForm || selectedPhoto ? '图库' : '桌面'}</span>
          </button>

          {!showAddForm && !selectedPhoto && (
            <button
              className={`photo-header-action ${showFavoritesOnly ? 'is-active' : ''}`}
              onClick={() => setShowFavoritesOnly((current) => !current)}
              aria-label={showFavoritesOnly ? '显示全部照片' : '只看收藏'}
              title={showFavoritesOnly ? '显示全部照片' : '只看收藏'}
            >
              <PhotoSymbol name="heart" size={21} />
            </button>
          )}
        </div>

        <div className="photo-title-row">
          <div>
            <h2>
              {showAddForm
                ? '添加照片'
                : selectedPhoto
                  ? '照片'
                  : showFavoritesOnly
                    ? '个人收藏'
                    : '图库'}
            </h2>
            <p>
              {showAddForm
                ? '把新的瞬间保存下来'
                : selectedPhoto
                  ? selectedPhoto.date
                  : `${visiblePhotos.length} 张照片`}
            </p>
          </div>

          {!showAddForm && !selectedPhoto && (
            <button
              className="photo-add-round"
              onClick={() => {
                setFormError('');
                setShowAddForm(true);
              }}
              aria-label="添加照片"
              title="添加照片"
            >
              <PhotoSymbol name="plus" size={23} />
            </button>
          )}
        </div>
      </header>

      {showAddForm ? (
        <div className="photo-content photo-form-screen">
          <form
            className="photo-add-form"
            onSubmit={(event) => {
              event.preventDefault();
              addPhoto(imageUrl);
            }}
          >
            <div className="photo-form-intro">
              <div className="photo-form-icon">
                <PhotoSymbol name="albums" size={30} />
              </div>
              <h3>添加到图库</h3>
              <p>选择一张照片，留住喜欢的瞬间。</p>
            </div>

            <div className="photo-form-group">
              <label htmlFor="photo-title">照片名称</label>
              <input
                id="photo-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="例如：道荣的可爱瞬间"
                maxLength={60}
              />

              <label htmlFor="photo-url">图片链接</label>
              <input
                id="photo-url"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="粘贴图片链接"
                type="url"
              />
            </div>

            <button className="photo-primary-button" type="submit">
              保存到图库
            </button>

            <div className="photo-form-separator"><span>或者</span></div>

            <button
              className="photo-secondary-button"
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              <PhotoSymbol name="albums" size={19} />
              从设备选择照片
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />

            <p className="photo-footnote">
              支持小于 1.5 MB 的图片。照片会保存在当前浏览器中。
            </p>

            {formError && <p className="photo-form-error">{formError}</p>}
          </form>
        </div>
      ) : selectedPhoto ? (
        <div className="photo-detail-screen">
          <div className="photo-detail-image" style={{ backgroundColor: selectedPhoto.color }}>
            <img
              src={selectedPhoto.imageUrl}
              alt={selectedPhoto.title}
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
            <span className="photo-image-fallback">{selectedPhoto.emoji}</span>
          </div>

          <div className="photo-detail-info">
            <div>
              <h3>{selectedPhoto.title}</h3>
              <p>{selectedPhoto.date} · 照片</p>
            </div>
            <button
              className={`photo-round-action ${favoriteIds.includes(selectedPhoto.id) ? 'is-favorite' : ''}`}
              onClick={() => toggleFavorite(selectedPhoto.id)}
              aria-label={favoriteIds.includes(selectedPhoto.id) ? '取消收藏' : '收藏照片'}
              title={favoriteIds.includes(selectedPhoto.id) ? '取消收藏' : '收藏照片'}
            >
              <PhotoSymbol name="heart" size={22} />
            </button>
          </div>

          <div className="photo-detail-toolbar">
            <button
              className="photo-toolbar-button"
              onClick={() => toggleFavorite(selectedPhoto.id)}
            >
              <PhotoSymbol name="heart" size={21} />
              <span>{favoriteIds.includes(selectedPhoto.id) ? '已收藏' : '收藏'}</span>
            </button>
            <button
              className="photo-toolbar-button photo-delete-action"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <PhotoSymbol name="trash" size={21} />
              <span>删除</span>
            </button>
          </div>

          {showDeleteConfirm && (
            <div className="photo-confirm-backdrop">
              <div className="photo-confirm" role="dialog" aria-modal="true">
                <h3>删除照片？</h3>
                <p>确定删除「{selectedPhoto.title}」吗？删除后无法在相册中恢复。</p>
                <div className="photo-confirm-actions">
                  <button
                    className="photo-confirm-cancel"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    取消
                  </button>
                  <button className="photo-confirm-delete" onClick={deleteSelectedPhoto}>
                    删除照片
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="photo-detail-bottom">
            <button className="photo-secondary-button" onClick={() => setSelectedPhoto(null)}>
              <PhotoSymbol name="grid" size={18} />
              返回图库
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="photo-content photo-library-content">
            <div className="photo-library-toolbar">
              <span>{showFavoritesOnly ? '已收藏的照片' : '最近项目'}</span>
              <span>{visiblePhotos.length} 项</span>
            </div>

            {visiblePhotos.length > 0 ? (
              <div className="photo-grid">
                {visiblePhotos.map((photo) => (
                  <button
                    className="photo-card"
                    key={photo.id}
                    onClick={() => setSelectedPhoto(photo)}
                    aria-label={`查看照片：${photo.title}`}
                  >
                    <div className="photo-thumbnail" style={{ backgroundColor: photo.color }}>
                      <img
                        src={photo.imageUrl}
                        alt={photo.title}
                        onError={(event) => {
                          event.currentTarget.style.display = 'none';
                        }}
                      />
                      <span className="photo-image-fallback">{photo.emoji}</span>
                      {favoriteIds.includes(photo.id) && (
                        <span className="photo-card-favorite">
                          <PhotoSymbol name="heart" size={13} />
                        </span>
                      )}
                    </div>
                    <span className="photo-card-title">{photo.title}</span>
                    <span className="photo-card-date">{photo.date}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="photo-empty">
                <div className="photo-empty-icon">
                  <PhotoSymbol name="heart" size={34} />
                </div>
                <h3>{showFavoritesOnly ? '还没有收藏照片' : '图库还是空的'}</h3>
                <p>
                  {showFavoritesOnly
                    ? '打开一张喜欢的照片，点击爱心即可收藏。'
                    : '添加第一张照片，留下美好回忆。'}
                </p>
                {showFavoritesOnly && (
                  <button
                    className="photo-primary-button photo-empty-button"
                    onClick={() => setShowFavoritesOnly(false)}
                  >
                    查看全部照片
                  </button>
                )}
              </div>
            )}
          </div>

          <nav className="photo-tab-bar" aria-label="相册导航">
            <button
              className={`photo-tab ${!showFavoritesOnly ? 'is-active' : ''}`}
              onClick={() => setShowFavoritesOnly(false)}
            >
              <PhotoSymbol name="grid" size={21} />
              <span>图库</span>
            </button>
            <button
              className={`photo-tab ${showFavoritesOnly ? 'is-active' : ''}`}
              onClick={() => setShowFavoritesOnly(true)}
            >
              <PhotoSymbol name="heart" size={21} />
              <span>收藏</span>
            </button>
            <button
              className="photo-tab"
              onClick={() => {
                setFormError('');
                setShowAddForm(true);
              }}
            >
              <PhotoSymbol name="plus" size={21} />
              <span>添加</span>
            </button>
          </nav>
        </>
      )}
    </div>
  );
}
