import { useState } from 'react';
import { Emblem } from '../components/Emblem.jsx';
import { getPositionColor } from '../constants/playerColors.js';

const TEAM_STATS = [
  { name:'영동', played:10, w:9, d:1, l:0, gf:34, ga:8,  pts:28, recent:['W','W','W','D','W'] },
  { name:'준현', played:10, w:7, d:2, l:1, gf:28, ga:14, pts:23, recent:['W','W','D','W','L'] },
  { name:'종성', played:10, w:6, d:2, l:2, gf:24, ga:16, pts:20, recent:['W','L','W','D','W'] },
  { name:'민혁', played:10, w:5, d:2, l:3, gf:20, ga:18, pts:17, recent:['L','W','W','D','L'] },
  { name:'삼주', played:10, w:4, d:1, l:5, gf:17, ga:22, pts:13, recent:['L','W','L','L','W'] },
  { name:'영모', played:10, w:3, d:2, l:5, gf:14, ga:24, pts:11, recent:['D','L','W','L','D'] },
  { name:'진수', played:10, w:2, d:1, l:7, gf:11, ga:28, pts:7,  recent:['L','L','D','L','W'] },
  { name:'기성', played:10, w:1, d:1, l:8, gf:8,  ga:30, pts:4,  recent:['L','L','L','D','L'] },
];

const PLAYERS = [
  { player:'홀란드',     season:'24', pos:'ST',  manager:'영동', apps:10, goals:14, assists:4,  defense:18 },
  { player:'음바페',     season:'24', pos:'ST',  manager:'준현', apps:10, goals:11, assists:6,  defense:14 },
  { player:'손흥민',     season:'24', pos:'LW',  manager:'영동', apps:9,  goals:9,  assists:5,  defense:22 },
  { player:'살라',       season:'24', pos:'RW',  manager:'종성', apps:10, goals:8,  assists:7,  defense:20 },
  { player:'비니시우스', season:'24', pos:'LW',  manager:'민혁', apps:9,  goals:7,  assists:3,  defense:16 },
  { player:'사카',       season:'24', pos:'RW',  manager:'준현', apps:10, goals:6,  assists:8,  defense:24 },
  { player:'이강인',     season:'24', pos:'CAM', manager:'영모', apps:8,  goals:4,  assists:6,  defense:28 },
  { player:'반 다이크',  season:'23', pos:'CB',  manager:'종성', apps:10, goals:1,  assists:0,  defense:82 },
  { player:'알리송',     season:'24', pos:'GK',  manager:'영동', apps:10, goals:0,  assists:0,  defense:88 },
  { player:'페페',       season:'23', pos:'CB',  manager:'기성', apps:8,  goals:0,  assists:0,  defense:31 },
  { player:'호드리구',   season:'23', pos:'CM',  manager:'삼주', apps:7,  goals:0,  assists:1,  defense:35 },
  { player:'마르티네스', season:'24', pos:'GK',  manager:'기성', apps:9,  goals:0,  assists:0,  defense:76 },
];

const WORST_PERFORMERS = [
  { player:'페페',     season:'23', manager:'기성', apps:8, goals:0, assists:0, reason:'8경기 출전, 골·도움 0 — 아쉬운 수비 라인' },
  { player:'호드리구', season:'23', manager:'삼주', apps:7, goals:0, assists:1, reason:'미드필드 기대 대비 기여도 부족' },
  { player:'기성',     season:'24', pos:'ST',  manager:'기성', apps:6, goals:1, assists:0, reason:'워스트 퍼포먼스 — 득점 기회 전환율 최하위' },
];

const RANK_COLOR = (r) => (r === 1 ? '#FFD700' : r === 2 ? '#C0C0C0' : r === 3 ? '#CD7F32' : '#5a7490');
const FORM_STYLE = { W:{ bg:'#00d97e22', color:'#00d97e', label:'승' }, D:{ bg:'#f59e0b22', color:'#f59e0b', label:'무' }, L:{ bg:'#ef444422', color:'#ef4444', label:'패' } };
const CARD_BG = 'linear-gradient(135deg, #0d1526, #111e38)';

function winRate(w, played) {
  return played ? ((w / played) * 100).toFixed(1) : '0.0';
}

function powerScore(p) {
  return Math.round(p.goals * 3 + p.assists * 2 + p.apps * 1.5);
}

function recentFormComment(recent) {
  const w = recent.filter((r) => r === 'W').length;
  const d = recent.filter((r) => r === 'D').length;
  return `최근 5경기 ${w}승 ${d}무`;
}

function StatCard({ title, filter = '전체 기간', children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-border overflow-hidden flex flex-col ${className}`}
      style={{ background: CARD_BG, boxShadow:'0 4px 24px rgba(0,0,0,0.25)' }}>
      <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-3 shrink-0">
        <p className="text-sm font-black text-text">{title}</p>
        <span className="text-[10px] text-muted px-2 py-1 rounded-md border border-border/60 bg-bg-elevated/50">
          {filter}
        </span>
      </div>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}

function RankBadge({ rank, sm }) {
  const size = sm ? 'w-6 h-6 text-xs' : 'w-7 h-7 text-sm';
  return (
    <span className={`inline-flex items-center justify-center rounded-full font-black shrink-0 ${size}`}
      style={{ color: RANK_COLOR(rank), background: `${RANK_COLOR(rank)}18`, border:`1px solid ${RANK_COLOR(rank)}44` }}>
      {rank}
    </span>
  );
}

function FormBadges({ recent }) {
  return (
    <div className="flex gap-0.5 justify-center">
      {recent.map((r, i) => {
        const s = FORM_STYLE[r];
        return (
          <span key={i} title={s.label}
            className="w-5 h-5 rounded text-[9px] font-black flex items-center justify-center"
            style={{ background: s.bg, color: s.color, border:`1px solid ${s.color}44` }}>
            {r}
          </span>
        );
      })}
    </div>
  );
}

function MiniRankList({ rows, valueKey, valueLabel, barColor, perGame }) {
  const max = Math.max(...rows.map((r) => r[valueKey]), 1);
  return (
    <div className="divide-y divide-border/40">
      {rows.map((row, i) => (
        <div key={row.name ?? row.player} className="px-4 py-3 flex items-center gap-2.5 hover:bg-bg-elevated/30 transition-colors">
          <RankBadge rank={i + 1} sm />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{row.name ?? row.player}</p>
            {perGame && (
              <p className="text-[10px] text-muted">경기당 {perGame(row)}</p>
            )}
          </div>
          <div className="w-16 h-1 rounded-full bg-bg-elevated overflow-hidden hidden sm:block">
            <div className="h-full rounded-full" style={{ width:`${(row[valueKey] / max) * 100}%`, background: barColor }} />
          </div>
          <span className="text-sm font-black w-10 text-right" style={{ color: barColor }}>
            {row[valueKey]}{valueLabel}
          </span>
        </div>
      ))}
    </div>
  );
}

function TeamTab() {
  const sorted = [...TEAM_STATS].sort((a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga));
  const leader = sorted[0];
  const byGoals = [...TEAM_STATS].sort((a, b) => b.gf - a.gf);
  const byGd = [...TEAM_STATS].sort((a, b) => (b.gf - b.ga) - (a.gf - a.ga));
  const byGa = [...TEAM_STATS].sort((a, b) => a.ga - b.ga);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StatCard title="리그 종합 순위" className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] text-muted uppercase tracking-wider border-b border-border/60">
                  {['순위','구단주','경기','승','무','패','승률','득점','실점','골득실','최근 5경기'].map((h) => (
                    <th key={h} className="px-3 py-3 font-bold text-left last:text-center whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {sorted.map((t, i) => {
                  const rank = i + 1;
                  const gd = t.gf - t.ga;
                  return (
                    <tr key={t.name} className="hover:bg-bg-elevated/30 transition-colors">
                      <td className="px-3 py-2.5"><RankBadge rank={rank} sm /></td>
                      <td className="px-3 py-2.5 font-bold whitespace-nowrap">
                        <span className="inline-flex items-center gap-2">
                          <Emblem name={t.name} size={28} />
                          {t.name}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-muted">{t.played}</td>
                      <td className="px-3 py-2.5 text-accent">{t.w}</td>
                      <td className="px-3 py-2.5 text-amber-400">{t.d}</td>
                      <td className="px-3 py-2.5 text-red-400">{t.l}</td>
                      <td className="px-3 py-2.5 font-bold">{winRate(t.w, t.played)}%</td>
                      <td className="px-3 py-2.5">{t.gf}</td>
                      <td className="px-3 py-2.5">{t.ga}</td>
                      <td className="px-3 py-2.5 font-bold" style={{ color: gd >= 0 ? '#00d97e' : '#ef4444' }}>
                        {gd > 0 ? '+' : ''}{gd}
                      </td>
                      <td className="px-3 py-2.5"><FormBadges recent={t.recent} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </StatCard>

        <StatCard title="현재 1위 팀">
          <div className="p-5 flex flex-col items-center text-center gap-4">
            <Emblem name={leader.name} size={72} />
            <div>
              <p className="text-2xl font-black" style={{ color:'#FFD700' }}>{leader.name}</p>
              <p className="text-xs text-muted mt-1">시즌 1 리그 1위</p>
            </div>
            <div className="w-full grid grid-cols-2 gap-3 text-left">
              {[
                { label:'승률', value:`${winRate(leader.w, leader.played)}%` },
                { label:'총 경기', value:`${leader.played}경기` },
                { label:'골득실', value:`+${leader.gf - leader.ga}` },
                { label:'승점', value:`${leader.pts}점` },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl px-3 py-2 border border-border/50 bg-bg-elevated/40">
                  <p className="text-[10px] text-muted">{label}</p>
                  <p className="text-lg font-black text-accent">{value}</p>
                </div>
              ))}
            </div>
            <div className="w-full rounded-xl px-4 py-3 border border-accent/20 bg-accent/5 text-left">
              <p className="text-[10px] text-muted mb-2">최근 폼</p>
              <FormBadges recent={leader.recent} />
              <p className="text-xs text-text mt-2 font-medium">{recentFormComment(leader.recent)}</p>
            </div>
          </div>
        </StatCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="팀 총 득점 순위">
          <MiniRankList rows={byGoals} valueKey="gf" valueLabel="" barColor="#00d97e"
            perGame={(r) => `${(r.gf / r.played).toFixed(1)}골`} />
        </StatCard>
        <StatCard title="팀 골득실 순위">
          <MiniRankList
            rows={byGd.map((t) => ({ ...t, gd: t.gf - t.ga }))}
            valueKey="gd" valueLabel="" barColor="#38bdf8"
            perGame={(r) => `득${r.gf} · 실${r.ga}`} />
        </StatCard>
        <StatCard title="최소 실점 순위">
          <MiniRankList rows={byGa} valueKey="ga" valueLabel="" barColor="#a78bfa"
            perGame={(r) => `${(r.ga / r.played).toFixed(1)}실점`} />
        </StatCard>
      </div>
    </div>
  );
}

function PlayerTab() {
  const withPower = PLAYERS.map((p) => ({ ...p, power: powerScore(p) }));
  const powerTop = [...withPower].sort((a, b) => b.power - a.power).slice(0, 10);
  const byGoals = [...PLAYERS].sort((a, b) => b.goals - a.goals).slice(0, 8);
  const byAssists = [...PLAYERS].sort((a, b) => b.assists - a.assists).slice(0, 8);
  const byDefense = [...PLAYERS].sort((a, b) => b.defense - a.defense).slice(0, 8);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StatCard title="현재 선수 파워랭킹" className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] text-muted uppercase tracking-wider border-b border-border/60">
                  {['순위','선수','시즌','포지션','출전','골','도움','파워'].map((h) => (
                    <th key={h} className="px-3 py-3 font-bold text-left whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {powerTop.map((p, i) => {
                  const rank = i + 1;
                  return (
                    <tr key={`${p.player}-${p.manager}`} className="hover:bg-bg-elevated/30 transition-colors">
                      <td className="px-3 py-2.5"><RankBadge rank={rank} sm /></td>
                      <td className="px-3 py-2.5">
                        <span className="font-bold">{p.player}</span>
                        <span className="text-[10px] text-muted ml-1.5">({p.manager})</span>
                      </td>
                      <td className="px-3 py-2.5 text-muted">{p.season}</td>
                      <td className="px-3 py-2.5">
                        <span className="text-xs font-bold px-1.5 py-0.5 rounded"
                          style={{ color: getPositionColor(p.pos), background:`${getPositionColor(p.pos)}18` }}>
                          {p.pos}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">{p.apps}</td>
                      <td className="px-3 py-2.5 text-accent font-bold">{p.goals}</td>
                      <td className="px-3 py-2.5" style={{ color:'#7c3aed' }}>{p.assists}</td>
                      <td className="px-3 py-2.5 font-black" style={{ color:'#FFD700' }}>{p.power}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </StatCard>

        <StatCard title="워스트 퍼포먼스">
          <div className="p-4 space-y-3">
            <p className="text-[10px] text-muted px-1">기대 대비 아쉬운 선수 — 친구들끼리 웃어넘기는 랭킹</p>
            {WORST_PERFORMERS.map((w, i) => (
              <div key={w.player} className="rounded-xl border border-border/50 p-3 bg-bg-elevated/30 hover:bg-bg-elevated/50 transition-colors">
                <div className="flex items-center gap-2 mb-1.5">
                  <RankBadge rank={i + 1} sm />
                  <span className="font-bold text-sm">{w.player}</span>
                  <span className="text-[10px] text-muted">{w.season} · {w.manager}</span>
                </div>
                <p className="text-xs text-muted">
                  출전 {w.apps} · 골 {w.goals} · 도움 {w.assists}
                </p>
                <p className="text-xs text-amber-400/90 mt-1.5 leading-relaxed">{w.reason}</p>
              </div>
            ))}
          </div>
        </StatCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="득점 순위">
          <div className="divide-y divide-border/40">
            {byGoals.map((p, i) => (
              <div key={p.player} className="px-4 py-3 flex items-center gap-2.5 hover:bg-bg-elevated/30">
                <RankBadge rank={i + 1} sm />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{p.player}</p>
                  <p className="text-[10px] text-muted">{p.season} · {p.pos} · 경기당 {(p.goals / p.apps).toFixed(1)}골</p>
                </div>
                <span className="text-lg font-black text-accent">{p.goals}</span>
              </div>
            ))}
          </div>
        </StatCard>

        <StatCard title="어시스트 순위">
          <div className="divide-y divide-border/40">
            {byAssists.map((p, i) => (
              <div key={p.player} className="px-4 py-3 flex items-center gap-2.5 hover:bg-bg-elevated/30">
                <RankBadge rank={i + 1} sm />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{p.player}</p>
                  <p className="text-[10px] text-muted">{p.season} · {p.pos} · 경기당 {(p.assists / p.apps).toFixed(1)}도움</p>
                </div>
                <span className="text-lg font-black" style={{ color:'#7c3aed' }}>{p.assists}</span>
              </div>
            ))}
          </div>
        </StatCard>

        <StatCard title="수비 순위">
          <div className="divide-y divide-border/40">
            {byDefense.map((p, i) => (
              <div key={p.player} className="px-4 py-3 flex items-center gap-2.5 hover:bg-bg-elevated/30">
                <RankBadge rank={i + 1} sm />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{p.player}</p>
                  <p className="text-[10px] text-muted">{p.season} · {p.pos}</p>
                </div>
                <span className="text-lg font-black" style={{ color:'#38bdf8' }}>{p.defense}</span>
              </div>
            ))}
          </div>
        </StatCard>
      </div>
    </div>
  );
}

export default function Stats() {
  const [tab, setTab] = useState('team');

  return (
    <div className="space-y-6 max-w-[1200px]">
      <div>
        <h1 className="text-2xl font-black">통계</h1>
        <p className="text-sm text-muted mt-1">친구 리그 전적 · 팀/선수 랭킹 대시보드</p>
      </div>

      <div className="flex gap-2 border-b border-border">
        {[['team','팀'],['player','선수']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className="px-6 py-2.5 text-sm font-bold transition-all rounded-t-lg"
            style={{
              color: tab === key ? '#00d97e' : '#5a7490',
              borderBottom: tab === key ? '2px solid #00d97e' : '2px solid transparent',
              background: tab === key ? 'rgba(0,217,126,0.06)' : 'transparent',
            }}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'team' ? <TeamTab /> : <PlayerTab />}
    </div>
  );
}
