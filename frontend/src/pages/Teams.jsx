export default function Teams() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">👥 팀</h1>
        <button className="px-4 py-2 bg-green hover:bg-green-hover text-white text-sm font-semibold rounded-md transition">
          + 팀 등록
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="col-span-full bg-bg-surface border border-border rounded-xl p-12 text-center text-muted">
          <p className="text-4xl mb-4">👥</p>
          <p className="font-semibold">아직 등록된 팀이 없습니다.</p>
          <p className="text-sm mt-1">팀 등록 버튼으로 첫 번째 팀을 만들어보세요!</p>
        </div>
      </div>
    </div>
  );
}
