import { useState, useMemo } from 'react';
import { Emblem } from '../components/Emblem.jsx';

// ── 샘플 거래 데이터 ─────────────────────────────────────────────────────────
const SAMPLE_TX = [
  { id:1,  manager:'영동',  delta:+300, type:'match_win',  desc:'11R 리그 승리 포인트 (영동 vs 준현)',            time:'2025-06-29 22:00', balance:1750 },
  { id:2,  manager:'영동',  delta:+50,  type:'mom',        desc:'11R MOM 보너스 (영동 vs 준현)',                 time:'2025-06-29 22:01', balance:1800 },
  { id:3,  manager:'준현',  delta:+100, type:'match_lose', desc:'11R 리그 패배 참여 포인트 (영동 vs 준현)',        time:'2025-06-29 22:00', balance:830 },
  { id:4,  manager:'영동',  delta:+320, type:'pred_win',   desc:'승부예측 적중: 영동 vs 준현 홈승 (+1.6배당)',     time:'2025-06-29 22:05', balance:1450 },
  { id:5,  manager:'종성',  delta:+150, type:'match_draw', desc:'10R 리그 무승부 포인트 (종성 vs 민혁)',           time:'2025-06-29 22:00', balance:970 },
  { id:6,  manager:'민혁',  delta:+150, type:'match_draw', desc:'10R 리그 무승부 포인트 (종성 vs 민혁)',           time:'2025-06-29 22:00', balance:740 },
  { id:7,  manager:'영동',  delta:-120, type:'item_buy',   desc:'감독 특성 구매: 강화의 달인 (120P)',              time:'2025-06-28 15:00', balance:1130 },
  { id:8,  manager:'준현',  delta:-200, type:'prediction', desc:'승부예측 참여: 영동 vs 준현 홈승 (200P)',         time:'2025-06-27 10:00', balance:730 },
  { id:9,  manager:'준현',  delta:-60,  type:'item_buy',   desc:'소모 아이템 구매: 닥터스트레인지 (60P)',           time:'2025-06-26 18:00', balance:930 },
  { id:10, manager:'삼주',  delta:-700, type:'gacha',      desc:'선수 뽑기 1회 (700P)',                          time:'2025-06-25 18:00', balance:420 },
  { id:11, manager:'영모',  delta:+100, type:'attend',     desc:'주간 경기 참여 기본 포인트',                      time:'2025-06-22 00:00', balance:650 },
  { id:12, manager:'진수',  delta:-350, type:'enhance',    desc:'강화 시도: 홀란드 +7→+8 실패 (350P)',            time:'2025-06-20 14:30', balance:210 },
  { id:13, manager:'기성',  delta:+200, type:'match_lose', desc:'9R 리그 패배 참여 포인트 (기성 vs 삼주)',          time:'2025-06-22 22:00', balance:340 },
  { id:14, manager:'삼주',  delta:+300, type:'match_win',  desc:'9R 리그 승리 포인트 (삼주 vs 진수)',              time:'2025-06-22 22:00', balance:1120 },
  { id:15, manager:'영동',  delta:-200, type:'prediction', desc:'승부예측 참여: 영동 vs 준현 홈승 (200P)',         time:'2025-06-22 09:00', balance:810 },
  { id:16, manager:'종성',  delta:-500, type:'enhance',    desc:'강화 시도: 음바페 +8→+9 성공 (500P)',            time:'2025-06-21 11:20', balance:820 },
  { id:17, manager:'민혁',  delta:+500, type:'attend',     desc:'시즌1 중간 정산 보너스 (관리자 지급)',              time:'2025-06-15 12:00', balance:590 },
  { id:18, manager:'준현',  delta:+120, type:'pred_win',   desc:'승부예측 적중: 삼주 vs 진수 홈승 (+1.7배당)',     time:'2025-06-22 22:10', balance:990 },
  { id:19, manager:'영모',  delta:-120, type:'item_buy',   desc:'감독 특성 구매: 뽑기의 달인 (120P)',              time:'2025-06-18 16:00', balance:550 },
  { id:20, manager:'기성',  delta:-60,  type:'item_buy',   desc:'소모 아이템 구매: 선수 밴 능력 (60P)',             time:'2025-06-17 20:00', balance:140 },
];

const TYPE_META = {
  match_win:  { label: '경기 승리',   color: '#00d97e', bg: 'rgba(0,217,126,0.12)',   border: 'rgba(0,217,126,0.3)' },
  match_draw: { label: '경기 무',     color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)' },
  match_lose: { label: '경기 패',     color: '#5a7490', bg: 'rgba(90,116,144,0.12)',  border: 'rgba(90,116,144,0.3)' },
  mom:        { label: 'MOM',         color: '#FFD700', bg: 'rgba(255,215,0,0.12)',   border: 'rgba(255,215,0,0.3)' },
  pred_win:   { label: '예측 적중',   color: '#00d97e', bg: 'rgba(0,217,126,0.12)',   border: 'rgba(0,217,126,0.3)' },
  pred_lose:  { label: '예측 낙선',   color: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.3)' },
  prediction: { label: '예측 참여',   color: '#c084fc', bg: 'rgba(192,132,252,0.12)', border: 'rgba(192,132,252,0.3)' },
  item_buy:   { label: '아이템 구매', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.3)' },
  gacha:      { label: '선수 뽑기',   color: '#a855f7', bg: 'rgba(168,85,247,0.12)',  border: 'rgba(168,85,247,0.3)' },
  enhance:    { label: '강화',        color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)' },
  attend:     { label: '참여 보상',   color: '#22d3ee', bg: 'rgba(34,211,238,0.12)',  border: 'rgba(34,211,238,0.3)' },
  admin:      { label: '관리자',      color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.3)' },
};

const MANAGERS = ['영동', '준현', '종성', '민혁', '삼주', '영모', '진수', '기성'];
const ALL_TYPES = Object.keys(TYPE_META);
const PAGE_SIZE = 10;
const CURRENT_USER = '영동'; // TODO: 실제 로그인 연동 시 교체

function TypeBadge({ type }) {
  const m = TYPE_META[type] ?? TYPE_META.admin;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap"
      style={{ color: m.color, background: m.bg, border: `1px solid ${m.border}` }}
    >
      {m.label}
    </span>
  );
}

export default function Wallet() {
  const [managerFilter, setManagerFilter] = useState('all');
  const [typeFilter, setTypeFilter]       = useState('all');
  const [page, setPage]                   = useState(1);

  // 필터 적용
  const filtered = useMemo(() => {
    return SAMPLE_TX
      .filter((tx) => managerFilter === 'all' || tx.manager === managerFilter)
      .filter((tx) => typeFilter    === 'all' || tx.type    === typeFilter);
  }, [managerFilter, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageItems  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleFilter = (setter) => (val) => { setter(val); setPage(1); };

  // 내 포인트 요약
  const myTx      = SAMPLE_TX.filter((tx) => tx.manager === CURRENT_USER);
  const myBalance = myTx.length ? myTx[0].balance : 0;
  const myEarned  = myTx.filter((tx) => tx.delta > 0).reduce((s, tx) => s + tx.delta, 0);
  const mySpent   = myTx.filter((tx) => tx.delta < 0).reduce((s, tx) => s + Math.abs(tx.delta), 0);

  return (
    <div className="space-y-6">

      {/* 헤더 */}
      <section
        className="relative rounded-2xl overflow-hidden p-6"
        style={{
          background: 'linear-gradient(135deg, #0d1526 0%, #101a30 60%, #0d1f2e 100%)',
          border: '1px solid rgba(96,165,250,0.2)',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(96,165,250,0.1) 0%, transparent 55%)' }}
        />
        <div className="relative">
          <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-blue-400/80 mb-1">Point History</p>
          <h1 className="text-3xl font-black text-text">포인트 히스토리</h1>
          <p className="text-sm text-muted mt-1.5">
            전체 감독의 포인트 변동 내역을 공개합니다
          </p>
        </div>
      </section>

      {/* 내 포인트 요약 카드 */}
      <section
        className="rounded-2xl border p-5"
        style={{
          background: 'linear-gradient(145deg, #0d1526, #111e38)',
          borderColor: 'rgba(0,217,126,0.2)',
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Emblem name={CURRENT_USER} size={36} />
          <div>
            <p className="text-xs text-muted">내 포인트 현황</p>
            <p className="font-black text-base text-text">{CURRENT_USER} 감독</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: '현재 잔액',    value: `${myBalance.toLocaleString()}P`, color: '#00d97e' },
            { label: '이번 시즌 획득', value: `+${myEarned.toLocaleString()}P`, color: '#60a5fa' },
            { label: '이번 시즌 소비', value: `-${mySpent.toLocaleString()}P`,  color: '#f87171' },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center">
              <p className="text-[10px] text-muted mb-0.5">{label}</p>
              <p className="text-xl font-black tabular-nums" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 필터 바 */}
      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={managerFilter}
          onChange={(e) => handleFilter(setManagerFilter)(e.target.value)}
          className="px-3 py-2 rounded-xl text-sm font-bold"
          style={{ background: '#0d1526', border: '1px solid #1e2d45', color: '#e2eaf5' }}
        >
          <option value="all">전체 감독</option>
          {MANAGERS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => handleFilter(setTypeFilter)(e.target.value)}
          className="px-3 py-2 rounded-xl text-sm font-bold"
          style={{ background: '#0d1526', border: '1px solid #1e2d45', color: '#e2eaf5' }}
        >
          <option value="all">전체 유형</option>
          {ALL_TYPES.map((t) => (
            <option key={t} value={t}>{TYPE_META[t].label}</option>
          ))}
        </select>

        <span className="text-xs text-muted ml-auto">
          총 <span className="font-bold text-text">{filtered.length}건</span>
        </span>
      </div>

      {/* 거래 내역 테이블 */}
      <section
        className="rounded-2xl border overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d1526, #111e38)', borderColor: 'rgba(255,255,255,0.07)' }}
      >
        {/* 테이블 헤더 */}
        <div
          className="grid text-[11px] font-bold uppercase tracking-widest text-muted px-5 py-3 border-b"
          style={{
            gridTemplateColumns: '7rem 1fr 8rem 5rem 7rem',
            borderColor: 'rgba(255,255,255,0.06)',
          }}
        >
          <span>감독</span>
          <span>설명</span>
          <span>거래 유형</span>
          <span className="text-right">증감</span>
          <span className="text-right">잔액</span>
        </div>

        {pageItems.length === 0 ? (
          <div className="py-16 text-center text-muted text-sm">해당하는 거래 내역이 없습니다</div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
            {pageItems.map((tx) => (
              <div
                key={tx.id}
                className="grid items-center px-5 py-3 hover:bg-white/[0.02] transition-colors"
                style={{ gridTemplateColumns: '7rem 1fr 8rem 5rem 7rem' }}
              >
                {/* 감독 */}
                <div className="flex items-center gap-2">
                  <Emblem name={tx.manager} size={24} />
                  <span className="text-sm font-bold text-text truncate">{tx.manager}</span>
                </div>

                {/* 설명 */}
                <div className="min-w-0 pr-4">
                  <p className="text-xs text-text truncate">{tx.desc}</p>
                  <p className="text-[10px] text-muted mt-0.5">{tx.time}</p>
                </div>

                {/* 유형 */}
                <TypeBadge type={tx.type} />

                {/* 증감 */}
                <p
                  className="text-sm font-black tabular-nums text-right"
                  style={{ color: tx.delta > 0 ? '#00d97e' : '#f87171' }}
                >
                  {tx.delta > 0 ? `+${tx.delta.toLocaleString()}` : tx.delta.toLocaleString()}P
                </p>

                {/* 잔액 */}
                <p className="text-sm font-bold tabular-nums text-right text-muted">
                  {tx.balance.toLocaleString()}P
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="px-3 py-1.5 rounded-lg text-sm font-bold disabled:opacity-30"
            style={{ background: '#0d1526', border: '1px solid #1e2d45', color: '#e2eaf5' }}
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              className="w-9 h-9 rounded-lg text-sm font-black transition-all"
              style={{
                background: safePage === n ? '#00d97e' : '#0d1526',
                color:      safePage === n ? '#080c16' : '#5a7490',
                border: `1px solid ${safePage === n ? '#00d97e' : '#1e2d45'}`,
              }}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="px-3 py-1.5 rounded-lg text-sm font-bold disabled:opacity-30"
            style={{ background: '#0d1526', border: '1px solid #1e2d45', color: '#e2eaf5' }}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
