const statCategories = [
  { icon: '⚽', label: '득점 순위', desc: '시즌 총 득점' },
  { icon: '🎯', label: '도움 순위', desc: '시즌 총 도움' },
  { icon: '🏅', label: 'MOM 순위',  desc: '경기 최우수 선수 횟수' },
  { icon: '📊', label: '팀 기록',   desc: '팀별 승패 및 득실점' },
];

export default function Stats() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">📊 통계</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {statCategories.map(({ icon, label, desc }) => (
          <div key={label} className="bg-bg-surface border border-border rounded-xl p-6 space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{icon}</span>
              <div>
                <p className="font-semibold">{label}</p>
                <p className="text-muted text-sm">{desc}</p>
              </div>
            </div>
            <div className="pt-4 text-center text-muted text-sm py-6 border-t border-border">
              경기 결과가 쌓이면 표시됩니다.
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
