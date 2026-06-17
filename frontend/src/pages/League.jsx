const MOCK_SCHEDULE = [
  { id: 1, home: '팀 A', away: '팀 B', date: '2025-07-05', status: 'scheduled' },
  { id: 2, home: '팀 C', away: '팀 D', date: '2025-07-05', status: 'scheduled' },
  { id: 3, home: '팀 A', away: '팀 C', date: '2025-07-12', status: 'scheduled' },
];

const statusLabel = {
  scheduled: { text: '예정', cls: 'text-muted' },
  played:    { text: '완료', cls: 'text-accent' },
  cancelled: { text: '취소', cls: 'text-red-400' },
};

export default function League() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">🏆 리그 일정</h1>
        <span className="text-sm text-muted">시즌 1</span>
      </div>

      {/* 순위표 */}
      <section>
        <h2 className="text-base font-semibold mb-3 text-muted uppercase tracking-wide">순위표</h2>
        <div className="bg-bg-surface border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted">
                <th className="text-left px-4 py-3 w-8">#</th>
                <th className="text-left px-4 py-3">팀</th>
                <th className="text-center px-4 py-3">승</th>
                <th className="text-center px-4 py-3">무</th>
                <th className="text-center px-4 py-3">패</th>
                <th className="text-center px-4 py-3">승점</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} className="text-center py-10 text-muted">
                  팀이 등록되면 순위표가 표시됩니다.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 경기 일정 */}
      <section>
        <h2 className="text-base font-semibold mb-3 text-muted uppercase tracking-wide">경기 일정</h2>
        <div className="space-y-3">
          {MOCK_SCHEDULE.map((match) => {
            const { text, cls } = statusLabel[match.status];
            return (
              <div
                key={match.id}
                className="bg-bg-surface border border-border rounded-xl px-6 py-4 flex items-center"
              >
                <span className="text-muted text-sm w-24">{match.date}</span>
                <div className="flex-1 flex items-center justify-center gap-6 text-base font-semibold">
                  <span>{match.home}</span>
                  <span className="text-muted text-sm">vs</span>
                  <span>{match.away}</span>
                </div>
                <span className={`text-sm w-12 text-right ${cls}`}>{text}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
