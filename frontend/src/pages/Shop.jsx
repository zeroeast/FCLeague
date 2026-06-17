import { useMemo, useState } from 'react';
import { SHOP_PASSIVE_SKILLS, SHOP_ACTIVE_SKILLS } from '../constants/shopProducts.js';
import { GachaPanel } from './Gacha.jsx';

const TABS = [
  { key: 'passive', label: '패시브 스킬' },
  { key: 'active', label: '액티브 스킬' },
  { key: 'content', label: '포인트 콘텐츠' },
];

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

function SkillSection({ title, subtitle, icon, skills, ownedIds, points, onBuy }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <h2 className="text-lg font-black">{title}</h2>
          <p className="text-xs text-muted">{subtitle}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {skills.map((skill) => {
          const owned = ownedIds.has(skill.id);
          return (
            <ProductCard
              key={skill.id}
              accent={skill.accent}
              glow={skill.glow}
              icon={skill.icon}
              badge={owned ? '보유' : skill.oneShot ? '액티브' : '패시브'}
              title={skill.name}
              subtitle={skill.oneShot ? '발동 후 소모 · 경기당 사용' : '지속 효과 · 소모 없음'}
              price={skill.shopPrice}
              meta={skill.description}
              disabled={owned || points < skill.shopPrice}
              onBuy={() => onBuy(skill)}
            />
          );
        })}
      </div>
    </section>
  );
}

export default function Shop() {
  const [tab, setTab] = useState('passive');
  const [points, setPoints] = useState(1600);
  const [toast, setToast] = useState('');
  const [inventory, setInventory] = useState({ passive: [], active: [] });

  const ownedPassiveIds = useMemo(() => new Set(inventory.passive), [inventory.passive]);
  const ownedActiveIds = useMemo(() => new Set(inventory.active), [inventory.active]);

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

  const buySkill = (skill) => {
    const bucket = skill.oneShot ? 'active' : 'passive';
    const ownedIds = skill.oneShot ? ownedActiveIds : ownedPassiveIds;

    if (ownedIds.has(skill.id)) {
      setToast('이미 보유한 스킬입니다');
      return;
    }

    purchase(skill.shopPrice, () => {
      setInventory((inv) => ({ ...inv, [bucket]: [...inv[bucket], skill.id] }));
    }, skill.name);
  };

  return (
    <div className="space-y-8">
      <section
        className="relative rounded-2xl overflow-hidden p-6 md:p-8 border"
        style={{
          background: 'linear-gradient(135deg, #0d1526 0%, #1a1030 50%, #0d1f20 100%)',
          borderColor: 'rgba(255,215,0,0.2)',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(255,215,0,0.12) 0%, transparent 55%)' }}
        />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-amber-400/80 mb-1">Point Shop</p>
            <h1 className="text-3xl md:text-4xl font-black text-text">상점</h1>
            <p className="text-sm text-muted mt-2 max-w-lg">
              패시브·액티브 스킬 구매와 포인트 콘텐츠(뽑기·강화·셔플)를 탭으로 이용합니다.
            </p>
          </div>
          <PointBadge points={points} />
        </div>

        <div className="relative mt-6 flex flex-wrap gap-3">
          {[
            { label: '패시브 스킬', value: `${inventory.passive.length}개` },
            { label: '액티브 스킬', value: `${inventory.active.length}개` },
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

      <div className="flex gap-2 flex-wrap border-b border-border pb-0">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className="px-5 py-2.5 text-sm font-bold transition-all rounded-t-lg"
            style={{
              background: tab === key ? '#0d1526' : 'transparent',
              color: tab === key ? '#00d97e' : '#5a7490',
              borderBottom: tab === key ? '2px solid #00d97e' : '2px solid transparent',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'passive' && (
        <SkillSection
          title="패시브 스킬"
          subtitle="구매 후 지속 적용 · 120P"
          icon="🛡️"
          skills={SHOP_PASSIVE_SKILLS}
          ownedIds={ownedPassiveIds}
          points={points}
          onBuy={buySkill}
        />
      )}

      {tab === 'active' && (
        <SkillSection
          title="액티브 스킬"
          subtitle="경기 중 발동 · 사용 후 소모 · 60P"
          icon="⚡"
          skills={SHOP_ACTIVE_SKILLS}
          ownedIds={ownedActiveIds}
          points={points}
          onBuy={buySkill}
        />
      )}

      {tab === 'content' && (
        <div
          className="rounded-2xl border p-6 md:p-8"
          style={{
            background: 'linear-gradient(160deg, #0a0e18 0%, #0d1526 40%, #111e38 100%)',
            borderColor: 'rgba(0,217,126,0.25)',
            boxShadow: '0 0 48px rgba(0,217,126,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          <GachaPanel fullWidth />
        </div>
      )}

      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  );
}
