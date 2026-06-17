import { useState } from 'react';

const SEASONS = [
  {
    id: 0,
    label: '시즌 0 (테스트)',
    champion:  { name:'준현', desc:'압도적인 득점력으로 초대 챔피언 등극', goals:31 },
    topScorer: { player:'음바페', manager:'준현', goals:18 },
    topAssist: { player:'사카',   manager:'준현', assists:12 },
    mvp:       { player:'음바페', manager:'준현', desc:'전 시즌 최다 득점·도움 동시 달성' },
    matches:   56, totalGoals: 187,
  },
];

const STAR = ({ filled }) => (
  <span style={{ color: filled ? '#FFD700' : '#1e2d45', fontSize:18 }}>★</span>
);

export default function HallOfFame() {
  const [season, setSeason] = useState(SEASONS[0]);

  return (
    <>
      <style>{`
        @keyframes hof-glow {
          0%, 100% { box-shadow: 0 0 40px rgba(255,215,0,0.3), 0 0 80px rgba(255,215,0,0.1); }
          50%       { box-shadow: 0 0 60px rgba(255,215,0,0.5), 0 0 120px rgba(255,215,0,0.2); }
        }
        @keyframes trophy-float {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50%       { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes star-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .hof-champion { animation: hof-glow 3s ease-in-out infinite; }
        .trophy-anim  { animation: trophy-float 4s ease-in-out infinite; display:inline-block; }
      `}</style>

      <div className="space-y-8">
        <div className="text-center space-y-2 py-6">
          <p className="text-xs text-muted uppercase tracking-widest font-bold">Hall of Fame</p>
          <h1 className="text-4xl font-black text-gradient-green">명예의 전당</h1>
          <p className="text-muted text-sm">역대 시즌 우승자와 주요 기록</p>
        </div>

        <div className="flex gap-2 justify-center">
          {SEASONS.map((s) => (
            <button key={s.id} onClick={() => setSeason(s)}
              className="px-5 py-2 rounded-full text-sm font-bold transition-all"
              style={{
                background: season.id === s.id ? '#FFD700' : 'rgba(255,215,0,0.1)',
                color:      season.id === s.id ? '#080c16' : '#FFD700',
                border:     '1px solid rgba(255,215,0,0.3)',
              }}>
              {s.label}
            </button>
          ))}
        </div>

        <div className="relative rounded-3xl overflow-hidden p-10 text-center hof-champion"
          style={{ background:'linear-gradient(135deg, #0d1008 0%, #1a1400 50%, #0d1008 100%)', border:'1px solid rgba(255,215,0,0.3)' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background:'radial-gradient(ellipse at 50% 0%, rgba(255,215,0,0.15) 0%, transparent 60%)' }} />

          <div className="relative space-y-4">
            <div className="trophy-anim text-7xl">T</div>

            <div className="inline-flex flex-col items-center gap-2">
              <div className="text-xs uppercase tracking-widest font-bold" style={{ color:'rgba(255,215,0,0.6)' }}>
                {season.label} 챔피언
              </div>
              <div className="text-5xl font-black" style={{ color:'#FFD700', textShadow:'0 0 40px rgba(255,215,0,0.5)' }}>
                {season.champion.name}
              </div>
              <div className="flex gap-1 mt-1">
                {Array.from({ length: season.champion.goals > 25 ? 3 : season.champion.goals > 15 ? 2 : 1 }).map((_, i) => (
                  <STAR key={i} filled />
                ))}
              </div>
              <p className="text-sm mt-2 max-w-xs" style={{ color:'rgba(255,215,0,0.7)' }}>
                {season.champion.desc}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AwardCard
            icon="G"
            iconColor="#FFD700"
            title="득점왕"
            name={season.topScorer.player}
            sub={`(${season.topScorer.manager})`}
            stat={`${season.topScorer.goals}골`}
            statColor="#FFD700"
          />
          <AwardCard
            icon="A"
            iconColor="#7c3aed"
            title="도움왕"
            name={season.topAssist.player}
            sub={`(${season.topAssist.manager})`}
            stat={`${season.topAssist.assists}도움`}
            statColor="#7c3aed"
          />
          <AwardCard
            icon="M"
            iconColor="#00d97e"
            title="MVP"
            name={season.mvp.player}
            sub={`(${season.mvp.manager})`}
            stat={season.mvp.desc}
            statColor="#00d97e"
            small
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl p-5 text-center border" style={{ background:'#0d1526', border:'1px solid #1e2d45' }}>
            <p className="text-xs text-muted uppercase tracking-widest mb-1">총 경기 수</p>
            <p className="text-4xl font-black text-accent">{season.matches}</p>
          </div>
          <div className="rounded-2xl p-5 text-center border" style={{ background:'#0d1526', border:'1px solid #1e2d45' }}>
            <p className="text-xs text-muted uppercase tracking-widest mb-1">총 득점 수</p>
            <p className="text-4xl font-black" style={{ color:'#FFD700' }}>{season.totalGoals}</p>
          </div>
        </div>
      </div>
    </>
  );
}

function AwardCard({ icon, iconColor, title, name, sub, stat, statColor, small }) {
  return (
    <div className="rounded-2xl p-5 border space-y-3"
      style={{ background:'linear-gradient(135deg, #0d1526, #111e38)', border:'1px solid #1e2d45' }}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black"
          style={{ background:`${iconColor}22`, color: iconColor }}>
          {icon}
        </div>
        <p className="text-xs text-muted uppercase tracking-widest font-bold">{title}</p>
      </div>
      <div>
        <p className="text-xl font-black text-text">{name}</p>
        <p className="text-xs text-muted">{sub}</p>
      </div>
      <p className={`font-black ${small ? 'text-sm leading-snug' : 'text-2xl'}`} style={{ color: statColor }}>{stat}</p>
    </div>
  );
}
