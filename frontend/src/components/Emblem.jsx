
const SHIELD = "M 50 3 L 97 20 L 97 57 C 97 79 75 93 50 97 C 25 93 3 79 3 57 L 3 20 Z";

const CFG = {
  '영동': { top:'#0d1f4a', bot:'#1a3a7a', accent:'#FFD700', stripe:'#FFD70066', stars:1 },
  '준현': { top:'#6b0000', bot:'#a01010', accent:'#ffffff', stripe:'#ffffff55', stars:0 },
  '종성': { top:'#0a3d1f', bot:'#145c2e', accent:'#4ade80', stripe:'#4ade8055', stars:0 },
  '민혁': { top:'#3b0066', bot:'#6200aa', accent:'#d4af37', stripe:'#d4af3755', stars:0 },
  '삼주': { top:'#7c2d00', bot:'#b84400', accent:'#fde68a', stripe:'#fde68a55', stars:0 },
  '영모': { top:'#00394d', bot:'#005f7a', accent:'#22d3ee', stripe:'#22d3ee55', stars:0 },
  '진수': { top:'#500020', bot:'#80003a', accent:'#c0c0c0', stripe:'#c0c0c055', stars:0 },
  '기성': { top:'#003366', bot:'#1155aa', accent:'#93c5fd', stripe:'#93c5fd55', stars:0 },
};

export function Emblem({ name, size = 80 }) {
  const c = CFG[name] || CFG['기성'];
  const gid = `emg-${name}`;

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
      <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="60%" y2="100%">
            <stop offset="0%"   stopColor={c.top} />
            <stop offset="100%" stopColor={c.bot} />
          </linearGradient>
          <clipPath id={`clip-${name}`}>
            <path d={SHIELD} />
          </clipPath>
        </defs>

        {/* 방패 배경 */}
        <path d={SHIELD} fill={`url(#${gid})`} />

        {/* 가로 구분선 */}
        <rect x="3" y="52" width="94" height="1.5" fill={c.stripe} clipPath={`url(#clip-${name})`} />

        {/* 대각선 줄무늬 장식 */}
        <line x1="3" y1="36" x2="97" y2="36" stroke={c.stripe} strokeWidth="10" clipPath={`url(#clip-${name})`} />

        {/* 방패 테두리 */}
        <path d={SHIELD} fill="none" stroke={c.accent} strokeWidth="2.5" />

        {/* 이니셜 */}
        <text x="50" y="35" textAnchor="middle" dominantBaseline="middle"
          fill={c.accent} fontSize="26" fontWeight="900" fontFamily="'Noto Sans KR', sans-serif"
          style={{ letterSpacing: '-1px' }}>
          {name[0]}
        </text>

        {/* 이름 */}
        <text x="50" y="70" textAnchor="middle" dominantBaseline="middle"
          fill={c.accent} fontSize="10" fontWeight="700" fontFamily="'Noto Sans KR', sans-serif"
          opacity="0.85">
          {name}
        </text>
      </svg>

      {/* 별 (우승 횟수) */}
      {c.stars > 0 && (
        <div style={{ display:'flex', gap:2 }}>
          {Array.from({ length: c.stars }).map((_, i) => (
            <span key={i} style={{ color:'#FFD700', fontSize:13, lineHeight:1 }}>★</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default Emblem;
