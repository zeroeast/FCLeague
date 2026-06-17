import { useState } from 'react';

const MANAGERS = [
  {
    name:'영동', formation:'4-3-3', wins:9,
    best11:['홀란드','손흥민','비니시우스','살라','데브라이너','로드리','트렌트','반다이크','뤼디거','데이비드','알리송'],
    ovr:91, pts:28,
  },
  {
    name:'준현', formation:'4-2-3-1', wins:7,
    best11:['음바페','사카','벨링엄','브루노','카제미루','로드리고','아놀드','밀리탕','마르키뇨스','루카스','마이냥'],
    ovr:90, pts:23,
  },
  {
    name:'종성', formation:'4-4-2', wins:6,
    best11:['살라','홀란드','디아스','맥알리스터','그라베','소보슬라이','반다이크','마티프','알렉산더','코나테','알리송'],
    ovr:89, pts:20,
  },
  {
    name:'민혁', formation:'3-5-2', wins:5,
    best11:['비니시우스','발베르데','차메니','크로스','카르바할','밀리탕','나초','쿠르투아','홀란드','핀토','호드리구'],
    ovr:88, pts:17,
  },
  {
    name:'삼주', formation:'4-3-3', wins:4,
    best11:['홀란드','마르티네스','가나초','에릭센','카세미로','메이누','달로트','마과이어','리산드로','린달로프','드헤아'],
    ovr:87, pts:13,
  },
  {
    name:'영모', formation:'4-2-3-1', wins:3,
    best11:['이강인','음바페','파비안','하쿠미','김민재','파블로','우가르테','페레이라','누뇨','쿠아레스마','동나루마'],
    ovr:86, pts:11,
  },
  {
    name:'진수', formation:'5-3-2', wins:2,
    best11:['황희찬','루카쿠','코디','할란드','무이','손흥민','트리피어','막과이어','포포비치','살라흐','미뇨레'],
    ovr:85, pts:7,
  },
  {
    name:'기성', formation:'4-3-3', wins:1,
    best11:['김민재','이강인','황희찬','가비','페드리','파블로','아라우호','크리스텐센','발데','에릭가르시아','테어슈테겐'],
    ovr:84, pts:4,
  },
];

const POSITION_LABELS = ['ST','RW','LW','CAM','CM','CM','RB','CB','CB','LB','GK'];

export default function Teams() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">팀</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {MANAGERS.map((m) => (
          <button key={m.name} onClick={() => setSelected(m)}
            className="text-left rounded-2xl p-5 border transition-all hover:-translate-y-1"
            style={{
              background: 'linear-gradient(135deg, #0d1526, #111e38)',
              border: selected?.name === m.name ? '1px solid #00d97e' : '1px solid #1e2d45',
              boxShadow: selected?.name === m.name ? '0 0 20px rgba(0,217,126,0.2)' : 'none',
            }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-black mb-3"
              style={{ background:'rgba(0,217,126,0.1)', border:'2px solid #00d97e', color:'#00d97e' }}>
              {m.name[0]}
            </div>
            <p className="font-black text-base text-text">{m.name}</p>
            <p className="text-xs text-muted mt-0.5">{m.formation}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-muted">OVR</span>
              <span className="font-black text-accent">{m.ovr}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">승점</span>
              <span className="font-black text-text">{m.pts}pt</span>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div className="rounded-2xl border border-accent/30 p-6 space-y-5"
          style={{ background:'linear-gradient(135deg, #0d1526, #0d1f20)', boxShadow:'0 0 32px rgba(0,217,126,0.1)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-black"
                style={{ background:'rgba(0,217,126,0.1)', border:'2px solid #00d97e', color:'#00d97e' }}>
                {selected.name[0]}
              </div>
              <div>
                <p className="text-xl font-black">{selected.name} 감독</p>
                <p className="text-sm text-muted">{selected.formation} · OVR {selected.ovr}</p>
              </div>
            </div>
            <button onClick={() => setSelected(null)} className="text-muted hover:text-text text-xl px-2">x</button>
          </div>

          <div>
            <p className="text-xs text-muted uppercase tracking-widest mb-3 font-bold">Best 11</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {selected.best11.map((player, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg px-3 py-2"
                  style={{ background:'rgba(0,217,126,0.05)', border:'1px solid #1e2d45' }}>
                  <span className="text-xs font-bold w-10 shrink-0" style={{ color:'#5a7490' }}>
                    {POSITION_LABELS[i]}
                  </span>
                  <span className="text-sm font-medium text-text truncate">{player}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
