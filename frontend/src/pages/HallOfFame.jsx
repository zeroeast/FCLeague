const categories = [
  { icon: '🏆', label: '우승팀' },
  { icon: '⚽', label: '득점왕' },
  { icon: '🎯', label: '도움왕' },
  { icon: '🌟', label: 'MVP' },
];

export default function HallOfFame() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">🎖️ 명예의 전당</h1>
      <p className="text-muted">역대 시즌 수상자 기록</p>

      <div className="flex gap-2">
        <button className="px-4 py-1.5 bg-accent text-bg-base text-sm font-semibold rounded-full">
          시즌 1
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map(({ icon, label }) => (
          <div key={label} className="bg-bg-surface border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">{icon}</span>
              <h2 className="font-semibold">{label}</h2>
            </div>
            <div className="text-muted text-sm text-center py-6">
              시즌 종료 후 기록됩니다.
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
