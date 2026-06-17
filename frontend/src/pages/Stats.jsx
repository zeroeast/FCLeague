import { useState } from 'react';

const PLAYER_GOALS = [
  { rank:1, player:'홀란드',      manager:'영동', goals:14, assists:4 },
  { rank:2, player:'음바페',      manager:'준현', goals:11, assists:6 },
  { rank:3, player:'손흥민',      manager:'영동', goals:9,  assists:5 },
  { rank:4, player:'살라',        manager:'종성', goals:8,  assists:7 },
  { rank:5, player:'비니시우스',  manager:'민혁', goals:7,  assists:3 },
  { rank:6, player:'사카',        manager:'준현', goals:6,  assists:8 },
  { rank:7, player:'홀란드',      manager:'삼주', goals:5,  assists:2 },
  { rank:8, player:'이강인',      manager:'영모', goals:4,  assists:6 },
];

const PLAYER_ASSISTS = [
  { rank:1, player:'사카',        manager:'준현', assists:8 },
  { rank:2, player:'살라',        manager:'종성', assists:7 },
  { rank:3, player:'음바페',      manager:'준현', assists:6 },
  { rank:4, player:'이강인',      manager:'영모', assists:6 },
  { rank:5, player:'손흥민',      manager:'영동', assists:5 },
  { rank:6, player:'비니시우스',  manager:'민혁', assists:3 },
  { rank:7, player:'홀란드',      manager:'삼주', assists:2 },
  { rank:8, player:'홀란드',      manager:'영동', assists:4 },
];

const TEAM_STATS = [
  { rank:1, name:'영동', played:10, w:9, d:1, l:0, gf:34, ga:8,  pts:28 },
  { rank:2, name:'준현', played:10, w:7, d:2, l:1, gf:28, ga:14, pts:23 },
  { rank:3, name:'종성', played:10, w:6, d:2, l:2, gf:24, ga:16, pts:20 },
  { rank:4, name:'민혁', played:10, w:5, d:2, l:3, gf:20, ga:18, pts:17 },
  { rank:5, name:'삼주', played:10, w:4, d:1, l:5, gf:17, ga:22, pts:13 },
  { rank:6, name:'영모', played:10, w:3, d:2, l:5, gf:14, ga:24, pts:11 },
  { rank:7, name:'진수', played:10, w:2, d:1, l:7, gf:11, ga:28, pts:7  },
  { rank:8, name:'기성', played:10, w:1, d:1, l:8, gf:8,  ga:30, pts:4  },
];

const RANK_COLOR = (r) => r === 1 ? '#FFD700' : r === 2 ? '#C0C0C0' : r === 3 ? '#CD7F32' : '#5a7490';

const BAR_MAX_GOALS = 14;

export default function Stats() {
  const [tab, setTab] = useState('goals');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">통계</h1>

      <div className="flex gap-2 border-b border-border">
        {[['goals','득점 순위'],['assists','도움 순위'],['team','팀 기록']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className="px-5 py-2.5 text-sm font-bold transition-all rounded-t-lg"
            style={{
              color:        tab === key ? '#00d97e' : '#5a7490',
              borderBottom: tab === key ? '2px solid #00d97e' : '2px solid transparent',
            }}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'goals' && (
        <div className="rounded-2xl border border-border overflow-hidden"
          style={{ background:'linear-gradient(135deg, #0d1526, #111e38)' }}>
          <div className="px-6 py-4 border-b border-border">
            <p className="text-xs text-muted uppercase tracking-widest font-bold">시즌 1 득점 순위</p>
          </div>
          <div className="divide-y divide-border/50">
            {PLAYER_GOALS.map((s) => (
              <div key={s.rank} className="px-6 py-4 flex items-center gap-4 hover:bg-bg-elevated/40 transition-colors">
                <span className="w-7 text-center font-black text-lg" style={{ color: RANK_COLOR(s.rank) }}>{s.rank}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-text">{s.player}</span>
                    <span className="text-xs text-muted">({s.manager})</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-bg-elevated overflow-hidden">
                    <div className="h-full rounded-full transition-all"
                      style={{ width:`${(s.goals / BAR_MAX_GOALS) * 100}%`, background:'#00d97e' }} />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-2xl font-black text-accent">{s.goals}</span>
                  <span className="text-xs text-muted ml-1">골</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'assists' && (
        <div className="rounded-2xl border border-border overflow-hidden"
          style={{ background:'linear-gradient(135deg, #0d1526, #111e38)' }}>
          <div className="px-6 py-4 border-b border-border">
            <p className="text-xs text-muted uppercase tracking-widest font-bold">시즌 1 도움 순위</p>
          </div>
          <div className="divide-y divide-border/50">
            {PLAYER_ASSISTS.map((s) => (
              <div key={s.rank} className="px-6 py-4 flex items-center gap-4 hover:bg-bg-elevated/40 transition-colors">
                <span className="w-7 text-center font-black text-lg" style={{ color: RANK_COLOR(s.rank) }}>{s.rank}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-text">{s.player}</span>
                    <span className="text-xs text-muted">({s.manager})</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-bg-elevated overflow-hidden">
                    <div className="h-full rounded-full transition-all"
                      style={{ width:`${(s.assists / 8) * 100}%`, background:'#7c3aed' }} />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-2xl font-black" style={{ color:'#7c3aed' }}>{s.assists}</span>
                  <span className="text-xs text-muted ml-1">도움</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'team' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border overflow-hidden"
            style={{ background:'linear-gradient(135deg, #0d1526, #111e38)' }}>
            <div className="px-5 py-4 border-b border-border">
              <p className="text-xs text-muted uppercase tracking-widest font-bold">팀 득점 순위</p>
            </div>
            {[...TEAM_STATS].sort((a,b) => b.gf - a.gf).map((t, i) => (
              <div key={t.name} className="px-5 py-3 flex items-center gap-3 border-b border-border/40 hover:bg-bg-elevated/40">
                <span className="w-6 text-center font-black text-sm" style={{ color: RANK_COLOR(i+1) }}>{i+1}</span>
                <span className="flex-1 font-bold">{t.name}</span>
                <div className="w-24 h-1.5 rounded-full bg-bg-elevated overflow-hidden">
                  <div className="h-full rounded-full" style={{ width:`${(t.gf/34)*100}%`, background:'#00d97e' }} />
                </div>
                <span className="text-accent font-black w-8 text-right">{t.gf}</span>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border overflow-hidden"
            style={{ background:'linear-gradient(135deg, #0d1526, #111e38)' }}>
            <div className="px-5 py-4 border-b border-border">
              <p className="text-xs text-muted uppercase tracking-widest font-bold">팀 실점 순위 (적을수록 우수)</p>
            </div>
            {[...TEAM_STATS].sort((a,b) => a.ga - b.ga).map((t, i) => (
              <div key={t.name} className="px-5 py-3 flex items-center gap-3 border-b border-border/40 hover:bg-bg-elevated/40">
                <span className="w-6 text-center font-black text-sm" style={{ color: RANK_COLOR(i+1) }}>{i+1}</span>
                <span className="flex-1 font-bold">{t.name}</span>
                <div className="w-24 h-1.5 rounded-full bg-bg-elevated overflow-hidden">
                  <div className="h-full rounded-full" style={{ width:`${(t.ga/30)*100}%`, background:'#ef4444' }} />
                </div>
                <span className="text-red-400 font-black w-8 text-right">{t.ga}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
