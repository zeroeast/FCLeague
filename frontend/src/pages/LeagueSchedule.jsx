import { useState } from 'react';
import { MATCHES } from '../constants/leagueData.js';

function MatchResultForm({ match, onCancel }) {
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');

  return (
    <div
      className="mt-3 p-4 rounded-xl border space-y-3"
      style={{ background: 'rgba(0,217,126,0.05)', borderColor: 'rgba(0,217,126,0.25)' }}
    >
      <p className="text-xs font-bold text-accent">경기 #{match.id} 결과 입력</p>
      <div className="flex items-center gap-3 justify-center">
        <span className="font-bold w-20 text-right">{match.home}</span>
        <input
          type="number"
          min="0"
          value={homeScore}
          onChange={(e) => setHomeScore(e.target.value)}
          className="w-14 text-center rounded-lg bg-bg-elevated border border-border px-2 py-1.5 font-black"
          placeholder="0"
        />
        <span className="text-muted">:</span>
        <input
          type="number"
          min="0"
          value={awayScore}
          onChange={(e) => setAwayScore(e.target.value)}
          className="w-14 text-center rounded-lg bg-bg-elevated border border-border px-2 py-1.5 font-black"
          placeholder="0"
        />
        <span className="font-bold w-20 text-left">{match.away}</span>
      </div>
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-xs font-bold text-muted hover:text-text rounded-lg"
        >
          취소
        </button>
        <button
          type="button"
          onClick={() => alert('API 연동 후 저장됩니다. (수기 입력 또는 넥슨 API 자동 조회)')}
          className="px-4 py-1.5 text-xs font-black rounded-lg bg-accent text-bg-base"
        >
          저장
        </button>
      </div>
      <p className="text-[10px] text-muted leading-relaxed">
        넥슨 경기결과 API로 자동 조회가 가능하면 우선 적용합니다.
        불가 시 참여 감독이 직접 스코어를 입력합니다.
      </p>
    </div>
  );
}

export default function LeagueSchedule() {
  const [editingId, setEditingId] = useState(null);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        각 감독(팀)이 경기 결과를 입력합니다. 경기 고유 번호 <span className="text-text font-bold">#ID</span>로 식별합니다.
      </p>

      <div className="space-y-2">
        {MATCHES.map((m) => (
          <div
            key={m.id}
            className="rounded-xl px-5 py-4 border transition-colors hover:border-accent/30"
            style={{ background: 'linear-gradient(135deg, #0d1526, #111e38)', border: '1px solid #1e2d45' }}
          >
            <div className="flex items-center gap-4">
              <span className="text-muted text-xs w-8 shrink-0 font-mono">#{m.id}</span>
              <span className="text-muted text-xs w-24 shrink-0">{m.date}</span>
              <div className="flex-1 grid grid-cols-3 items-center text-center">
                <span className="font-bold text-right pr-4">{m.home}</span>
                {m.done
                  ? <span className="font-black text-xl" style={{ color: '#00d97e' }}>{m.hs} - {m.as}</span>
                  : <span className="text-muted text-sm">vs</span>
                }
                <span className="font-bold text-left pl-4">{m.away}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs w-12 text-right" style={{ color: m.done ? '#00d97e' : '#5a7490' }}>
                  {m.done ? '완료' : '예정'}
                </span>
                {!m.done && (
                  <button
                    type="button"
                    onClick={() => setEditingId(editingId === m.id ? null : m.id)}
                    className="px-3 py-1 text-[11px] font-bold rounded-lg border border-accent/40 text-accent hover:bg-accent/10"
                  >
                    {editingId === m.id ? '닫기' : '결과 입력'}
                  </button>
                )}
              </div>
            </div>

            {editingId === m.id && (
              <MatchResultForm match={m} onCancel={() => setEditingId(null)} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
