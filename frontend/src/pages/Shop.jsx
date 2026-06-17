import { useMemo, useState } from 'react';
import {
  DRAW_TICKET_PRODUCTS,
  ENHANCE_LEVEL_SURCHARGE,
  ENHANCE_TICKET_BASE,
  getEnhanceTicketPrice,
  SHOP_TRAITS,
} from '../constants/shopProducts.js';

const TABS = [
  { key: 'all', label: '전체' },
  { key: 'traits', label: '특성' },
  { key: 'draw', label: '뽑기권' },
  { key: 'enhance', label: '강화권' },
];

const ENHANCE_LEVELS = [5, 6, 7, 8, 9, 10];

function PointBadge({ points }) {
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border font-black"
      style={{
        background: 'linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,215,0,0.04))',
        borderColor: 'rgba(255,215,0,0.45)',
        color: '#FFD700',
        boxShadow: '0 0 24px rgba(255,215,0,0.15)',
      }}
    >
      <span className="text-lg">P</span>
      <span className="text-xl tabular-nums">{points.toLocaleString()}</span>
      <span className="text-xs text-muted font-bold">보유 포인트</span>
    </div>
  );
}

function Toast({ message, onClose }) {
  if (!message) return null;
  return (
    <div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-xl border font-bold text-sm animate-pulse"
      style={{
        background: 'linear-gradient(135deg, #0d1f20, #0d1526)',
        borderColor: '#00d97e66',
        color: '#00d97e',
        boxShadow: '0 8px 32px rgba(0,217,126,0.25)',
      }}
      onAnimationEnd={onClose}
    >
      {message}
    </div>
  );
}

function ProductCard({ accent, glow, icon, badge, title, subtitle, price, meta, onBuy, disabled }) {
  return (
    <div
      className="group relative rounded-2xl border overflow-hidden transition-all hover:-translate-y-1"
      style={{
        background: `linear-gradient(145deg, #0d1526 0%, #111e38 50%, ${glow} 140%)`,
        borderColor: `${accent}44`,
        boxShadow: `0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)`,
      }}
    >
      {badge && (
        <span
          className="absolute top-3 right-3 text-[10px] font-black px-2 py-0.5 rounded-full"
          style={{ background: accent, color: '#080c16' }}
        >
          {badge}
        </span>
      )}
      <div className="p-5 flex flex-col h-full">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4"
          style={{
            background: `${accent}18`,
            border: `1px solid ${accent}66`,
            boxShadow: `0 0 20px ${glow}`,
          }}
        >
          {icon}
        </div>
        <p className="font-black text-lg text-text">{title}</p>
        <p className="text-xs text-muted mt-0.5 mb-3">{subtitle}</p>
        {meta && <p className="text-[11px] text-muted/90 mb-4 flex-1 leading-relaxed">{meta}</p>}
        <div className="flex items-end justify-between gap-3 mt-auto pt-3 border-t border-border/40">
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wider">가격</p>
            <p className="text-2xl font-black tabular-nums" style={{ color: accent }}>
              {price.toLocaleString()}
              <span className="text-sm ml-0.5">P</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onBuy}
            disabled={disabled}
            className="px-4 py-2 rounded-lg text-sm font-black transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110"
            style={{
              background: disabled ? '#1e2d45' : `linear-gradient(135deg, ${accent}, ${accent}cc)`,
              color: disabled ? '#5a7490' : '#080c16',
              boxShadow: disabled ? 'none' : `0 4px 16px ${glow}`,
            }}
          >
            구매
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  const [tab, setTab] = useState('all');
  const [points, setPoints] = useState(1500);
  const [toast, setToast] = useState('');
  const [enhanceLevel, setEnhanceLevel] = useState(7);
  const [inventory, setInventory] = useState({
    traits: [],
    drawTickets: 0,
    enhanceTickets: Object.fromEntries(ENHANCE_LEVELS.map((lv) => [lv, 0])),
  });

  const enhancePrice = getEnhanceTicketPrice(enhanceLevel);

  const showTraits = tab === 'all' || tab === 'traits';
  const showDraw = tab === 'all' || tab === 'draw';
  const showEnhance = tab === 'all' || tab === 'enhance';

  const ownedTraitIds = useMemo(() => new Set(inventory.traits), [inventory.traits]);

  const purchase = (cost, onSuccess, label) => {
    if (points < cost) {
      setToast('포인트가 부족합니다');
      return;
    }
    setPoints((p) => p - cost);
    onSuccess();
    setToast(`${label} 구매 완료!`);
    setTimeout(() => setToast(''), 2500);
  };

  const buyTrait = (trait) => {
    if (ownedTraitIds.has(trait.id)) {
      setToast('이미 보유한 특성입니다');
      return;
    }
    purchase(trait.shopPrice, () => {
      setInventory((inv) => ({ ...inv, traits: [...inv.traits, trait.id] }));
    }, trait.name);
  };

  const buyDraw = (product) => {
    purchase(product.price, () => {
      setInventory((inv) => ({ ...inv, drawTickets: inv.drawTickets + product.qty }));
    }, product.name);
  };

  const buyEnhance = () => {
    purchase(enhancePrice, () => {
      setInventory((inv) => ({
        ...inv,
        enhanceTickets: {
          ...inv.enhanceTickets,
          [enhanceLevel]: inv.enhanceTickets[enhanceLevel] + 1,
        },
      }));
    }, `+${enhanceLevel} 강화권`);
  };

  return (
    <div className="space-y-8">
      <style>{`
        @keyframes shop-shimmer {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .shop-hero-glow { animation: shop-shimmer 4s ease-in-out infinite; }
      `}</style>

      {/* hero */}
      <section
        className="relative rounded-2xl overflow-hidden p-6 md:p-8 border"
        style={{
          background: 'linear-gradient(135deg, #0d1526 0%, #1a1030 50%, #0d1f20 100%)',
          borderColor: 'rgba(255,215,0,0.2)',
        }}
      >
        <div
          className="shop-hero-glow absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(255,215,0,0.12) 0%, transparent 55%)' }}
        />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-amber-400/80 mb-1">Point Shop</p>
            <h1 className="text-3xl md:text-4xl font-black text-text">상점</h1>
            <p className="text-sm text-muted mt-2 max-w-md">
              리그 포인트로 감독 특성, 뽑기권, 강화권을 구매하세요.
            </p>
          </div>
          <PointBadge points={points} />
        </div>

        {/* inventory strip */}
        <div className="relative mt-6 flex flex-wrap gap-3">
          {[
            { label: '뽑기권', value: `${inventory.drawTickets}장` },
            { label: '보유 특성', value: `${inventory.traits.length}개` },
            { label: '강화권 합계', value: `${Object.values(inventory.enhanceTickets).reduce((a, b) => a + b, 0)}장` },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="px-4 py-2 rounded-xl border text-sm"
              style={{ background: 'rgba(0,0,0,0.25)', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <span className="text-muted">{label}</span>
              <span className="ml-2 font-black text-text">{value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className="px-5 py-2 rounded-full text-sm font-bold transition-all"
            style={{
              background: tab === key ? '#00d97e' : 'rgba(0,217,126,0.08)',
              color: tab === key ? '#080c16' : '#00d97e',
              border: `1px solid ${tab === key ? '#00d97e' : 'rgba(0,217,126,0.25)'}`,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* traits */}
      {showTraits && (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <h2 className="text-lg font-black">감독 특성</h2>
              <p className="text-xs text-muted">소모형 60P · 패시브 120P</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {SHOP_TRAITS.map((trait) => {
              const owned = ownedTraitIds.has(trait.id);
              return (
                <ProductCard
                  key={trait.id}
                  accent={trait.accent}
                  glow={trait.glow}
                  icon={trait.icon}
                  badge={owned ? '보유' : trait.oneShot ? '소모형' : '패시브'}
                  title={trait.name}
                  subtitle={trait.oneShot ? '경기당 1회 사용' : '지속 효과'}
                  price={trait.shopPrice}
                  meta={trait.description}
                  disabled={owned || points < trait.shopPrice}
                  onBuy={() => buyTrait(trait)}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* draw tickets */}
      {showDraw && (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎰</span>
            <div>
              <h2 className="text-lg font-black">뽑기권</h2>
              <p className="text-xs text-muted">선수 뽑기 메뉴에서 사용 · 번들일수록 할인</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {DRAW_TICKET_PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                accent={product.accent}
                glow={product.glow}
                icon={product.icon}
                badge={product.badge}
                title={product.name}
                subtitle={`${product.qty}회 · 장당 ${Math.round(product.price / product.qty)}P`}
                price={product.price}
                meta="구매 즉시 인벤토리에 적립됩니다."
                disabled={points < product.price}
                onBuy={() => buyDraw(product)}
              />
            ))}
          </div>
        </section>
      )}

      {/* enhance tickets */}
      {showEnhance && (
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✨</span>
            <div>
              <h2 className="text-lg font-black">강화권</h2>
              <p className="text-xs text-muted">목표 강화 단계마다 추가 포인트 소모</p>
            </div>
          </div>

          <div
            className="rounded-2xl border p-6 md:p-8"
            style={{
              background: 'linear-gradient(135deg, #0d1526, #1a1408)',
              borderColor: 'rgba(234,179,8,0.3)',
              boxShadow: '0 0 40px rgba(234,179,8,0.08)',
            }}
          >
            <p className="text-sm text-muted mb-4">강화 목표 단계를 선택하세요</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {ENHANCE_LEVELS.map((lv) => {
                const price = getEnhanceTicketPrice(lv);
                const active = enhanceLevel === lv;
                return (
                  <button
                    key={lv}
                    type="button"
                    onClick={() => setEnhanceLevel(lv)}
                    className="px-4 py-3 rounded-xl border text-left transition-all min-w-[88px]"
                    style={{
                      background: active ? 'rgba(234,179,8,0.15)' : 'rgba(255,255,255,0.03)',
                      borderColor: active ? '#eab308' : 'rgba(255,255,255,0.1)',
                      boxShadow: active ? '0 0 20px rgba(234,179,8,0.25)' : 'none',
                    }}
                  >
                    <p className="text-lg font-black" style={{ color: active ? '#FFD700' : '#94a3b8' }}>
                      +{lv}
                    </p>
                    <p className="text-[10px] text-muted mt-0.5">{price}P</p>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-border/40">
                  <span className="text-muted">기본 가격</span>
                  <span className="font-bold">{ENHANCE_TICKET_BASE}P</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/40">
                  <span className="text-muted">+{enhanceLevel} 단계 추가</span>
                  <span className="font-bold text-amber-400">+{ENHANCE_LEVEL_SURCHARGE[enhanceLevel]}P</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="font-black">합계</span>
                  <span className="text-2xl font-black text-amber-400">{enhancePrice}P</span>
                </div>
                <p className="text-[11px] text-muted">
                  보유: +{enhanceLevel} 강화권 {inventory.enhanceTickets[enhanceLevel]}장
                </p>
              </div>

              <div className="flex justify-center md:justify-end">
                <button
                  type="button"
                  onClick={buyEnhance}
                  disabled={points < enhancePrice}
                  className="px-10 py-4 rounded-xl font-black text-lg transition-all disabled:opacity-40 hover:brightness-110"
                  style={{
                    background: 'linear-gradient(135deg, #FFD700, #eab308)',
                    color: '#080c16',
                    boxShadow: '0 8px 28px rgba(255,215,0,0.35)',
                  }}
                >
                  +{enhanceLevel} 강화권 구매
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  );
}
