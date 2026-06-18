import { useState } from 'react';
import { Emblem } from '../components/Emblem.jsx';

// ── 샘플 데이터 ──────────────────────────────────────────────────────────────
const EVENTS = [
  {
    id: 1,
    home: '영동', away: '종성', date: '07-06', round: '11라운드',
    status: 'open',
    odds: { home: 1.6, draw: 3.2, away: 2.8 },
    pool: { home: 450, draw: 120, away: 280 },
  },
  {
    id: 2,
    home: '준현', away: '민혁', date: '07-06', round: '11라운드',
    status: 'open',
    odds: { home: 1.8, draw: 3.0, away: 2.4 },
    pool: { home: 300, draw: 90, away: 220 },
  },
  {
    id: 3,
    home: '삼주', away: '영모', date: '07-13', round: '12라운드',
    status: 'open',
    odds: { home: 2.1, draw: 2.9, away: 2.0 },
    pool: { home: 150, draw: 60, away: 200 },
  },
  {
    id: 4,
    home: '영동', away: '준현', date: '06-29', round: '10라운드',
    status: 'settled',
    odds: { home: 1.5, draw: 3.5, away: 3.0 },
    result: 'home',
    pool: { home: 600, draw: 150, away: 200 },
  },
  {
    id: 5,
    home: '종성', away: '민혁', date: '06-29', round: '10라운드',
    status: 'settled',
    odds: { home: 2.0, draw: 2.8, away: 2.2 },
    result: 'draw',
    pool: { home: 200, draw: 180, away: 250 },
  },
  {
    id: 6,
    home: '삼주', away: '진수', date: '06-22', round: '9라운드',
    status: 'settled',
    odds: { home: 1.7, draw: 3.1, away: 2.6 },
    result: 'home',
    pool: { home: 400, draw: 100, away: 180 },
  },
];

const STATUS_META = {
  open:      { label: '예측 가능', color: '#00d97e', bg: 'rgba(0,217,126,0.12)',   border: 'rgba(0,217,126,0.3)' },
  closed:    { label: '마감',      color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)' },
  settled:   { label: '정산 완료', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.3)' },
  cancelled: { label: '취소',      color: '#6b7280', bg: 'rgba(107,114,128,0.12)', border: 'rgba(107,114,128,0.3)' },
};

const CHOICES = [
  { key: 'home',  label: '홈 승',    accentKey: '#00d97e' },
  { key: 'draw',  label: '무승부',   accentKey: '#f59e0b' },
  { key: 'away',  label: '원정 승',  accentKey: '#f87171' },
];

const MIN_BET = 50;

// ── 서브 컴포넌트 ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const m = STATUS_META[status] ?? STATUS_META.cancelled;
  return (
    <span
      className="text-[11px] font-black px-2 py-0.5 rounded-full"
      style={{ color: m.color, background: m.bg, border: `1px solid ${m.border}` }}
    >
      {m.label}
    </span>
  );
}

function OddsBtn({ choiceKey, label, odds, selected, settled, result, onSelect, disabled }) {
  const isWin    = settled && result === choiceKey;
  const isLose   = settled && result && result !== choiceKey;
  const isActive = selected && !settled;

  const accent = CHOICES.find((c) => c.key === choiceKey)?.accentKey ?? '#00d97e';

  let bg = 'rgba(255,255,255,0.04)';
  let border = '#1e2d45';
  let color = '#5a7490';

  if (isWin)    { bg = `${accent}22`; border = `${accent}88`; color = accent; }
  else if (isLose) { bg = 'rgba(0,0,0,0.2)'; color = '#2a3a55'; }
  else if (isActive) { bg = `${accent}18`; border = accent; color = accent; }

  return (
    <button
      type="button"
      disabled={disabled || settled}
      onClick={() => !settled && onSelect(choiceKey)}
      className="flex-1 rounded-xl py-3 flex flex-col items-center gap-0.5 transition-all"
      style={{ background: bg, border: `1px solid ${border}`, cursor: settled ? 'default' : 'pointer' }}
    >
      <span className="text-[10px] font-bold" style={{ color: isLose ? '#2a3a55' : '#5a7490' }}>{label}</span>
      <span className="text-lg font-black tabular-nums" style={{ color }}>{odds.toFixed(1)}</span>
      {isWin && <span className="text-[9px] font-black" style={{ color: accent }}>★ 적중</span>}
    </button>
  );
}

function EventCard({ event, myBet, onBet, onSpend, points }) {
  const [selChoice, setSelChoice]   = useState(null);
  const [amountStr, setAmountStr]   = useState('');
  const [confirmed, setConfirmed]   = useState(false);

  const isOpen    = event.status === 'open';
  const isSettled = event.status === 'settled';
  const hasBet    = !!myBet;

  const amount  = parseInt(amountStr, 10) || 0;
  const payout  = selChoice ? Math.floor(amount * event.odds[selChoice]) : 0;
  const canBet  = selChoice && amount >= MIN_BET && amount <= points && !hasBet;

  const handleConfirm = () => {
    if (!canBet) return;
    onSpend(amount, () => {
      onBet(event.id, { choice: selChoice, amount });
      setConfirmed(true);
      setSelChoice(null);
      setAmountStr('');
    });
  };

  // payout for my settled bet
  const myPayout = hasBet && isSettled
    ? (myBet.choice === event.result ? Math.floor(myBet.amount * event.odds[myBet.choice]) : 0)
    : null;

  const totalPool = event.pool.home + event.pool.draw + event.pool.away;

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #0d1526, #111e38)',
        borderColor: isOpen ? 'rgba(0,217,126,0.2)' : 'rgba(255,255,255,0.07)',
      }}
    >
      {/* 헤더 */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-muted">{event.round}</span>
          <span className="text-[10px] text-muted">·</span>
          <span className="text-[10px] text-muted">{event.date}</span>
        </div>
        <StatusBadge status={event.status} />
      </div>

      <div className="p-4 space-y-4">
        {/* 팀 대결 */}
        <div className="flex items-center justify-center gap-4">
          <div className="flex flex-col items-center gap-1.5">
            <Emblem name={event.home} size={40} />
            <span className="text-sm font-black text-text">{event.home}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-muted uppercase tracking-widest font-bold">vs</span>
            {isSettled && (
              <span
                className="mt-1 text-xs font-black px-2 py-0.5 rounded-full"
                style={{ color: '#60a5fa', background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.3)' }}
              >
                {event.result === 'home' ? `${event.home} 승` : event.result === 'away' ? `${event.away} 승` : '무승부'}
              </span>
            )}
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Emblem name={event.away} size={40} />
            <span className="text-sm font-black text-text">{event.away}</span>
          </div>
        </div>

        {/* 배당 버튼 */}
        <div className="flex gap-2">
          {CHOICES.map(({ key, label }) => (
            <OddsBtn
              key={key}
              choiceKey={key}
              label={label}
              odds={event.odds[key]}
              selected={selChoice === key}
              settled={isSettled}
              result={event.result}
              onSelect={(k) => {
                if (!isOpen || hasBet) return;
                setSelChoice((prev) => (prev === k ? null : k));
                setAmountStr('');
              }}
              disabled={hasBet && !isSettled}
            />
          ))}
        </div>

        {/* 총 참여 풀 */}
        <div className="flex items-center justify-between text-[11px] text-muted">
          <span>총 참여 포인트</span>
          <span className="font-bold text-text">{totalPool.toLocaleString()}P</span>
        </div>

        {/* 내가 이미 예측한 경우 */}
        {hasBet && (
          <div
            className="rounded-xl px-4 py-3 space-y-1"
            style={{ background: 'rgba(0,217,126,0.07)', border: '1px solid rgba(0,217,126,0.2)' }}
          >
            <p className="text-[11px] font-bold text-accent">내 예측</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">
                {CHOICES.find((c) => c.key === myBet.choice)?.label} · {myBet.amount.toLocaleString()}P
              </span>
              {isSettled && myPayout !== null && (
                <span
                  className="font-black"
                  style={{ color: myPayout > 0 ? '#00d97e' : '#f87171' }}
                >
                  {myPayout > 0 ? `+${myPayout.toLocaleString()}P 적중!` : '낙선'}
                </span>
              )}
              {!isSettled && (
                <span className="text-[10px] font-bold text-muted">정산 대기 중</span>
              )}
            </div>
          </div>
        )}

        {/* 베팅 입력 폼 (오픈 + 선택 + 미배팅) */}
        {isOpen && selChoice && !hasBet && (
          <div
            className="rounded-xl p-3 space-y-3"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1e2d45' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted flex-1">
                {CHOICES.find((c) => c.key === selChoice)?.label} · 배당 {event.odds[selChoice].toFixed(1)}배
              </span>
              <span className="text-[10px] text-muted">최소 {MIN_BET}P</span>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                min={MIN_BET}
                max={points}
                placeholder={`${MIN_BET}P 이상`}
                value={amountStr}
                onChange={(e) => setAmountStr(e.target.value)}
                className="flex-1 rounded-lg px-3 py-2 text-sm font-bold text-center tabular-nums"
                style={{ background: '#141f35', border: '1px solid #1e2d45', color: '#e2eaf5' }}
              />
              <button
                type="button"
                onClick={() => setAmountStr(String(Math.floor(points / 2)))}
                className="px-3 py-2 rounded-lg text-xs font-bold"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#5a7490', border: '1px solid #1e2d45' }}
              >
                절반
              </button>
            </div>
            {amount >= MIN_BET && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">예상 획득</span>
                <span className="font-black text-accent">{payout.toLocaleString()}P</span>
              </div>
            )}
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!canBet}
              className="w-full py-2.5 rounded-xl text-sm font-black transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: canBet ? '#00d97e' : '#1e2d45',
                color: canBet ? '#080c16' : '#5a7490',
              }}
            >
              {amount < MIN_BET ? `${MIN_BET}P 이상 입력` : amount > points ? '포인트 부족' : `${amount.toLocaleString()}P 예측 확정`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── 메인 컴포넌트 ──────────────────────────────────────────────────────────────
export function PredictionPanel({ points, onSpend }) {
  const [filter, setFilter] = useState('all');
  const [myBets, setMyBets] = useState({});

  const handleBet = (eventId, bet) => {
    setMyBets((prev) => ({ ...prev, [eventId]: bet }));
  };

  const FILTER_TABS = [
    { key: 'all',     label: '전체' },
    { key: 'open',    label: '진행 중' },
    { key: 'settled', label: '정산 완료' },
  ];

  const filtered = filter === 'all'
    ? EVENTS
    : EVENTS.filter((e) => e.status === filter);

  const myWins   = Object.entries(myBets).filter(([id, b]) => {
    const ev = EVENTS.find((e) => e.id === Number(id));
    return ev?.status === 'settled' && ev.result === b.choice;
  });
  const totalBetP = Object.values(myBets).reduce((s, b) => s + b.amount, 0);
  const totalWinP = myWins.reduce((s, [id, b]) => {
    const ev = EVENTS.find((e) => e.id === Number(id));
    return s + Math.floor(b.amount * (ev?.odds[b.choice] ?? 1));
  }, 0);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent mb-1">Match Prediction</p>
          <h2 className="text-2xl font-black text-text">승부 예측</h2>
          <p className="text-xs text-muted mt-1">
            경기 결과를 예측하고 포인트를 획득하세요 · 고정 배당제 · 최소 {MIN_BET}P
          </p>
        </div>
        {/* 내 예측 요약 */}
        <div
          className="flex gap-4 px-4 py-3 rounded-xl shrink-0"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #1e2d45' }}
        >
          {[
            { label: '총 예측 참여', value: `${Object.keys(myBets).length}건` },
            { label: '참여 포인트',  value: `${totalBetP.toLocaleString()}P` },
            { label: '적중 포인트',  value: `${totalWinP.toLocaleString()}P`, accent: true },
          ].map(({ label, value, accent }) => (
            <div key={label} className="text-center">
              <p className="text-[10px] text-muted">{label}</p>
              <p className={`text-sm font-black ${accent ? 'text-accent' : 'text-text'}`}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 규칙 안내 */}
      <div
        className="rounded-xl px-4 py-3 flex flex-wrap gap-4 text-[11px] text-muted"
        style={{ background: 'rgba(0,217,126,0.05)', border: '1px solid rgba(0,217,126,0.15)' }}
      >
        <span>📌 <b className="text-text">고정 배당제</b> — 예측 시점 배당 고정</span>
        <span>📌 획득 = <b className="text-text">floor(참여P × 배당)</b></span>
        <span>📌 <b className="text-text">최소 {MIN_BET}P</b> 이상 참여</span>
        <span>📌 예측 확정 후 변경 불가</span>
      </div>

      {/* 필터 탭 */}
      <div className="flex gap-1 border-b border-border pb-0">
        {FILTER_TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className="px-4 py-2 text-sm font-bold transition-all rounded-t-lg"
            style={{
              color: filter === key ? '#00d97e' : '#5a7490',
              borderBottom: filter === key ? '2px solid #00d97e' : '2px solid transparent',
            }}
          >
            {label}
            <span
              className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full"
              style={{
                background: filter === key ? 'rgba(0,217,126,0.15)' : 'rgba(255,255,255,0.05)',
                color: filter === key ? '#00d97e' : '#3a5070',
              }}
            >
              {key === 'all' ? EVENTS.length : EVENTS.filter((e) => e.status === key).length}
            </span>
          </button>
        ))}
      </div>

      {/* 이벤트 카드 그리드 */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-muted text-sm">해당 상태의 예측 이벤트가 없습니다</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              myBet={myBets[event.id] ?? null}
              onBet={handleBet}
              onSpend={onSpend}
              points={points}
            />
          ))}
        </div>
      )}
    </div>
  );
}
