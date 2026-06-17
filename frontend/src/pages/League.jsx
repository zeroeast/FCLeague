import { useState } from 'react';

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

const MATCHES = [
  { id:1,  date:'2025-06-01', home:'영동', away:'기성',  hs:5, as:0, done:true },
  { id:2,  date:'2025-06-01', home:'준현', away:'진수',  hs:4, as:1, done:true },
  { id:3,  date:'2025-06-08', home:'종성', away:'영모',  hs:3, as:1, done:true },
  { id:4,  date:'2025-06-08', home:'민혁', away:'삼주',  hs:2, as:2, done:true },
  { id:5,  date:'2025-06-15', home:'영동', away:'진수',  hs:4, as:2, done:true },
  { id:6,  date:'2025-06-15', home:'준현', away:'삼주',  hs:3, as:0, done:true },
  { id:7,  date:'2025-06-22', home:'종성', away:'기성',  hs:3, as:1, done:true },
  { id:8,  date:'2025-06-22', home:'민혁', away:'영모',  hs:2, as:1, done:true },
  { id:9,  date:'2025-06-29', home:'영동', away:'영모',  hs:3, as:0, done:true },
  { id:10, date:'2025-06-29', home:'준현', away:'기성',  hs:4, as:0, done:true },
  { id:11, date:'2025-07-06', home:'영동', away:'종성',  hs:null, as:null, done:false },
  { id:12, date:'2025-07-06', home:'준현', away:'민혁',  hs:null, as:null, done:false },
  { id:13, date:'2025-07-13', home:'삼주', away:'진수',  hs:null, as:null, done:false },
  { id:14, date:'2025-07-13', home:'영모', away:'기성',  hs:null, as:null, done:false },
  { id:15, date:'2025-07-20', home:'영동', away:'준현',  hs:null, as:null, done:false },
];

export default function League() {
  const [tab, setTab] = useState('schedule');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">리그 일정</h1>
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse inline-block" />
          시즌 1 진행 중
        </span>
      </div>

      <div className="flex gap-2 border-b border-border pb-0">
        {['schedule', 'standings'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-5 py-2.5 text-sm font-bold transition-all rounded-t-lg"
            style={{
              background: tab === t ? '#0d1526' : 'transparent',
              color:      tab === t ? '#00d97e' : '#5a7490',
              borderBottom: tab === t ? '2px solid #00d97e' : '2px solid transparent',
            }}>
            {t === 'schedule' ? '경기 일정' : '순위표'}
          </button>
        ))}
      </div>

      {tab === 'standings' && (
        <div className="rounded-2xl border border-border overflow-hidden"
          style={{ background:'linear-gradient(135deg, #0d1526, #111e38)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted text-xs uppercase tracking-wide border-b border-border">
                <th className="px-4 py-3 text-left w-8">#</th>
                <th className="px-4 py-3 text-left">감독</th>
                <th className="px-3 py-3 text-center">경기</th>
                <th className="px-3 py-3 text-center">승</th>
                <th className="px-3 py-3 text-center">무</th>
                <th className="px-3 py-3 text-center">패</th>
                <th className="px-3 py-3 text-center">득점</th>
                <th className="px-3 py-3 text-center">실점</th>
                <th className="px-3 py-3 text-center">득실</th>
                <th className="px-3 py-3 text-center font-bold text-text">승점</th>
              </tr>
            </thead>
            <tbody>
              {STANDINGS.map((s) => {
                const gd = s.gf - s.ga;
                const rankColor = s.rank === 1 ? '#FFD700' : s.rank === 2 ? '#C0C0C0' : s.rank === 3 ? '#CD7F32' : null;
                return (
                  <tr key={s.rank}
                    className="border-b border-border/40 hover:bg-bg-elevated/40 transition-colors"
                    style={{ borderLeft: rankColor ? `3px solid ${rankColor}` : '3px solid transparent' }}>
                    <td className="px-4 py-3 font-black text-muted">{s.rank}</td>
                    <td className="px-4 py-3 font-bold" style={{ color: rankColor || '#e2eaf5' }}>{s.name}</td>
                    <td className="px-3 py-3 text-center text-muted">{s.w + s.d + s.l}</td>
                    <td className="px-3 py-3 text-center text-accent font-bold">{s.w}</td>
                    <td className="px-3 py-3 text-center text-muted">{s.d}</td>
                    <td className="px-3 py-3 text-center text-red-400">{s.l}</td>
                    <td className="px-3 py-3 text-center text-muted">{s.gf}</td>
                    <td className="px-3 py-3 text-center text-muted">{s.ga}</td>
                    <td className="px-3 py-3 text-center text-muted">{gd > 0 ? '+' : ''}{gd}</td>
                    <td className="px-3 py-3 text-center font-black text-xl text-text">{s.pts}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'schedule' && (
        <div className="space-y-2">
          {MATCHES.map((m) => (
            <div key={m.id}
              className="rounded-xl px-5 py-4 flex items-center gap-4 border transition-colors hover:border-accent/30"
              style={{ background:'linear-gradient(135deg, #0d1526, #111e38)', border:'1px solid #1e2d45' }}>
              <span className="text-muted text-xs w-24 shrink-0">{m.date}</span>
              <div className="flex-1 grid grid-cols-3 items-center text-center">
                <span className="font-bold text-right pr-4">{m.home}</span>
                {m.done
                  ? <span className="font-black text-xl" style={{ color:'#00d97e' }}>{m.hs} - {m.as}</span>
                  : <span className="text-muted text-sm">vs</span>
                }
                <span className="font-bold text-left pl-4">{m.away}</span>
              </div>
              <span className="text-xs w-12 text-right shrink-0"
                style={{ color: m.done ? '#00d97e' : '#5a7490' }}>
                {m.done ? '완료' : '예정'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
