import { Link } from 'react-router-dom';
import { Emblem } from '../components/Emblem.jsx';

const STANDINGS = [
  { rank:1, name:'영동',  w:9, d:1, l:0, gf:34, ga:8,  pts:28 },
  { rank:2, name:'준현',  w:7, d:2, l:1, gf:28, ga:14, pts:23 },
  { rank:3, name:'종성',  w:6, d:2, l:2, gf:24, ga:16, pts:20 },
  { rank:4, name:'민혁',  w:5, d:2, l:3, gf:20, ga:18, pts:17 },
  { rank:5, name:'삼주',  w:4, d:1, l:5, gf:17, ga:22, pts:13 },
  { rank:6, name:'영모',  w:3, d:2, l:5, gf:14, ga:24, pts:11 },
  { rank:7, name:'진수',  w:2, d:1, l:7, gf:11, ga:28, pts:7  },
  { rank:8, name:'기성',  w:1, d:1, l:8, gf:8,  ga:30, pts:4  },
];

const RECENT = [
  { home:'영동', away:'준현', hs:3, as:1, date:'06-29' },
  { home:'종성', away:'민혁', hs:2, as:2, date:'06-29' },
  { home:'삼주', away:'진수', hs:3, as:0, date:'06-22' },
];

const UPCOMING = [
  { home:'영동', away:'종성', date:'07-06' },
  { home:'준현', away:'민혁', date:'07-06' },
];

const TOP_SCORERS = [
  { rank:1, player:'홀란드',    manager:'영동', goals:14 },
  { rank:2, player:'음바페',    manager:'준현', goals:11 },
  { rank:3, player:'손흥민',    manager:'영동', goals:9  },
  { rank:4, player:'살라',      manager:'종성', goals:8  },
  { rank:5, player:'비니시우스', manager:'민혁', goals:7  },
];

const RANK_COLOR = (r) => r === 1 ? '#FFD700' : r === 2 ? '#C0C0C0' : r === 3 ? '#CD7F32' : null;

export default function Home() {
  const top = STANDINGS[0];
  const totalPlayed = STANDINGS.reduce((s, m) => s + m.w + m.d + m.l, 0) / 2;
  const totalGoals  = STANDINGS.reduce((s, m) => s + m.gf, 0) / 2;

  return (
    <div className="space-y-6">

      {/* 리그 현황판 */}
      <section className="relative rounded-2xl overflow-hidden p-6"
        style={{ background:'linear-gradient(135deg, #0d1526 0%, #0d1f20 100%)', border:'1px solid rgba(0,217,126,0.25)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background:'radial-gradient(ellipse at 0% 50%, rgba(0,217,126,0.08) 0%, transparent 60%)' }} />

        <div className="relative flex flex-col md:flex-row md:items-center gap-6">
          <div className="shrink-0 space-y-1 md:border-r md:border-border md:pr-6">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse inline-block" />
                LIVE
              </span>
              <span className="text-xs text-muted">시즌 1</span>
            </div>
            <p className="text-2xl font-black text-text">리그 현황</p>
            <p className="text-xs text-muted">2025.06.01 ~ 2025.09.30</p>
          </div>

          <div className="flex gap-6 md:border-r md:border-border md:pr-6">
            {[
              { label:'참가 감독', value:'8명' },
              { label:'진행 경기', value:`${totalPlayed}경기` },
              { label:'총 득점',   value:`${totalGoals}골` },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-black text-accent">{value}</p>
                <p className="text-xs text-muted mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 md:border-r md:border-border md:pr-6">
            <Emblem name={top.name} size={56} />
            <div>
              <p className="text-xs text-muted">현재 1위</p>
              <p className="font-black text-base" style={{ color:'#FFD700' }}>{top.name}</p>
              <p className="text-xs text-muted">{top.pts}pt · {top.w}승</p>
            </div>
          </div>

          <div className="flex-1 space-y-1.5">
            <p className="text-xs text-muted uppercase tracking-widest font-bold">다음 경기</p>
            {UPCOMING.map((m, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="text-xs text-muted w-10 shrink-0">{m.date}</span>
                <span className="font-bold">{m.home}</span>
                <span className="text-muted text-xs">vs</span>
                <span className="font-bold">{m.away}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 순위표 */}
        <section className="rounded-2xl border border-border overflow-hidden"
          style={{ background:'linear-gradient(135deg, #0d1526, #111e38)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-bold text-sm uppercase tracking-widest text-muted">순위표</h2>
            <Link to="/league" className="text-xs text-accent hover:underline">전체 보기</Link>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted text-xs border-b border-border">
                <th className="px-4 py-2 text-left w-6">#</th>
                <th className="px-3 py-2 text-left w-10"></th>
                <th className="px-2 py-2 text-left">감독</th>
                <th className="px-3 py-2 text-center">승</th>
                <th className="px-3 py-2 text-center">무</th>
                <th className="px-3 py-2 text-center">패</th>
                <th className="px-3 py-2 text-center font-bold text-text">승점</th>
              </tr>
            </thead>
            <tbody>
              {STANDINGS.map((s) => {
                const rc = RANK_COLOR(s.rank);
                return (
                  <tr key={s.rank}
                    className="border-b border-border/40 hover:bg-bg-elevated/40 transition-colors"
                    style={{ borderLeft: rc ? `3px solid ${rc}` : '3px solid transparent' }}>
                    <td className="px-4 py-2 text-muted font-bold text-xs">{s.rank}</td>
                    <td className="px-2 py-1">
                      <Emblem name={s.name} size={28} />
                    </td>
                    <td className="px-2 py-2 font-bold" style={{ color: rc || '#e2eaf5' }}>{s.name}</td>
                    <td className="px-3 py-2 text-center text-accent">{s.w}</td>
                    <td className="px-3 py-2 text-center text-muted">{s.d}</td>
                    <td className="px-3 py-2 text-center text-red-400">{s.l}</td>
                    <td className="px-3 py-2 text-center font-black text-text">{s.pts}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <div className="space-y-4">
          <section className="rounded-2xl border border-border p-5"
            style={{ background:'linear-gradient(135deg, #0d1526, #111e38)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-sm uppercase tracking-widest text-muted">최근 경기</h2>
              <Link to="/league" className="text-xs text-accent hover:underline">전체 보기</Link>
            </div>
            <div className="space-y-2">
              {RECENT.map((m, i) => (
                <div key={i} className="grid grid-cols-3 items-center text-sm rounded-lg px-3 py-2"
                  style={{ background:'rgba(255,255,255,0.03)' }}>
                  <span className="font-bold text-right pr-3">{m.home}</span>
                  <span className="font-black text-center" style={{ color:'#00d97e' }}>{m.hs} - {m.as}</span>
                  <span className="font-bold text-left pl-3">{m.away}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border p-5"
            style={{ background:'linear-gradient(135deg, #0d1526, #111e38)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-sm uppercase tracking-widest text-muted">득점 순위 Top 5</h2>
              <Link to="/stats" className="text-xs text-accent hover:underline">통계 보기</Link>
            </div>
            <div className="space-y-2.5">
              {TOP_SCORERS.map((s) => (
                <div key={s.rank} className="flex items-center gap-3">
                  <span className="w-5 text-center font-black text-xs shrink-0"
                    style={{ color: RANK_COLOR(s.rank) || '#5a7490' }}>{s.rank}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-1">
                      <span className="font-bold text-sm text-text">{s.player}</span>
                      <span className="text-xs text-muted">({s.manager})</span>
                    </div>
                    <div className="mt-1 h-1 rounded-full bg-bg-elevated overflow-hidden">
                      <div className="h-full rounded-full" style={{ width:`${(s.goals/14)*100}%`, background:'#00d97e' }} />
                    </div>
                  </div>
                  <span className="font-black text-accent shrink-0">{s.goals}골</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
