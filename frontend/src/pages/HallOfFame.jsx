import { useState } from 'react';
import { Emblem } from '../components/Emblem.jsx';

const SEASONS = [
  {
    id: 0,
    label: '시즌 0',
    champion:  { name:'영동', desc:'압도적인 득점력과 철벽 수비로 초대 챔피언 등극', goals:34 },
    topScorer: { player:'홀란드',  manager:'영동', goals:18 },
    topAssist: { player:'손흥민', manager:'영동', assists:10 },
    mvp:       { player:'홀란드',  manager:'영동', desc:'전 시즌 최다 득점·팀 공헌도 압도' },
    matches: 56, totalGoals: 187,
  },
];

export default function HallOfFame() {
  const [season, setSeason] = useState(SEASONS[0]);
  const c = season.champion;

  return (
    <>
      <style>{`
        @keyframes hof-glow {
          0%, 100% { box-shadow: 0 0 40px rgba(255,215,0,0.25), 0 0 80px rgba(255,215,0,0.08); }
          50%       { box-shadow: 0 0 70px rgba(255,215,0,0.45), 0 0 130px rgba(255,215,0,0.18); }
        }
        @keyframes trophy-float {
          0%, 100% { transform: translateY(0px)   scale(1); }
          50%       { transform: translateY(-10px) scale(1.05); }
        }
        .hof-card    { animation: hof-glow      3s ease-in-out infinite; }
        .trophy-anim { animation: trophy-float  4s ease-in-out infinite; display:inline-block; }
      `}</style>

      <div className="space-y-8">

        <div className="text-center space-y-2 py-4">
          <p className="text-xs text-muted uppercase tracking-widest font-bold">Hall of Fame</p>
          <h1 className="text-4xl font-black text-gradient-green">명예의 전당</h1>
          <p className="text-muted text-sm">역대 시즌 우승자와 주요 기록</p>
        </div>

        {/* 시즌 탭 */}
        <div className="flex gap-2 justify-center">
          {SEASONS.map((s) => (
            <button key={s.id} onClick={() => setSeason(s)}
              className="px-5 py-2 rounded-full text-sm font-bold transition-all"
              style={{
                background: season.id === s.id ? '#FFD700' : 'rgba(255,215,0,0.08)',
                color:      season.id === s.id ? '#080c16' : '#FFD700',
                border:     '1px solid rgba(255,215,0,0.3)',
              }}>
              {s.label}
            </button>
          ))}
        </div>

        {/* 챔피언 카드 */}
        <div className="relative rounded-3xl overflow-hidden p-10 text-center hof-card"
          style={{ background:'linear-gradient(135deg, #0d1008 0%, #1a1600 50%, #0d1008 100%)', border:'1px solid rgba(255,215,0,0.35)' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background:'radial-gradient(ellipse at 50% 0%, rgba(255,215,0,0.18) 0%, transparent 65%)' }} />

          <div className="relative flex flex-col items-center gap-4">
            <span className="trophy-anim text-6xl">T</span>

            <div className="flex flex-col items-center gap-3">
              <p className="text-xs uppercase tracking-widest font-bold" style={{ color:'rgba(255,215,0,0.6)' }}>
                {season.label} 챔피언
              </p>

              <Emblem name={c.name} size={100} />

              <p className="text-5xl font-black" style={{ color:'#FFD700', textShadow:'0 0 40px rgba(255,215,0,0.6)' }}>
                {c.name}
              </p>
              <p className="text-sm max-w-xs" style={{ color:'rgba(255,215,0,0.7)' }}>{c.desc}</p>
            </div>
          </div>
        </div>

        {/* 개인 수상 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AwardCard color="#FFD700" title="득점왕"
            player={season.topScorer.player} manager={season.topScorer.manager}
            stat={`${season.topScorer.goals}골`} />
          <AwardCard color="#7c3aed" title="도움왕"
            player={season.topAssist.player} manager={season.topAssist.manager}
            stat={`${season.topAssist.assists}도움`} />
          <AwardCard color="#00d97e" title="MVP"
            player={season.mvp.player} manager={season.mvp.manager}
            stat={season.mvp.desc} small />
        </div>

        {/* 시즌 통계 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl p-5 text-center border"
            style={{ background:'#0d1526', border:'1px solid #1e2d45' }}>
            <p className="text-xs text-muted uppercase tracking-widest mb-1">총 경기 수</p>
            <p className="text-4xl font-black text-accent">{season.matches}</p>
          </div>
          <div className="rounded-2xl p-5 text-center border"
            style={{ background:'#0d1526', border:'1px solid #1e2d45' }}>
            <p className="text-xs text-muted uppercase tracking-widest mb-1">총 득점 수</p>
            <p className="text-4xl font-black" style={{ color:'#FFD700' }}>{season.totalGoals}</p>
          </div>
        </div>
      </div>
    </>
  );
}

function AwardCard({ color, title, player, manager, stat, small }) {
  return (
    <div className="rounded-2xl p-5 border space-y-3"
      style={{ background:'linear-gradient(135deg, #0d1526, #111e38)', border:'1px solid #1e2d45' }}>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
          style={{ background:`${color}22`, color }}>
          {title[0]}
        </div>
        <p className="text-xs text-muted uppercase tracking-widest font-bold">{title}</p>
      </div>
      <div>
        <p className="text-xl font-black text-text">{player}</p>
        <p className="text-xs text-muted">({manager})</p>
      </div>
      <p className={`font-black ${small ? 'text-sm leading-snug' : 'text-2xl'}`} style={{ color }}>{stat}</p>
    </div>
  );
}
