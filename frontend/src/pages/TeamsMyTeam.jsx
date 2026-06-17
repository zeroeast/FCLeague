import TeamDetailPanel from '../components/TeamDetailPanel.jsx';
import { CURRENT_MANAGER_NAME, findManager } from '../constants/teamsData.js';

export default function TeamsMyTeam() {
  const manager = findManager(CURRENT_MANAGER_NAME);

  if (!manager) {
    return (
      <p className="text-muted text-sm">로그인 후 내 팀 정보를 확인할 수 있습니다.</p>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className="rounded-xl px-4 py-3 border text-sm"
        style={{ background: 'rgba(0,217,126,0.06)', borderColor: 'rgba(0,217,126,0.2)' }}
      >
        <span className="text-muted">현재 감독: </span>
        <span className="font-black text-accent">{CURRENT_MANAGER_NAME}</span>
        <span className="text-muted ml-2">(로그인 연동 전 샘플)</span>
      </div>

      <TeamDetailPanel manager={manager} showClose={false} />

      <div
        className="rounded-xl border border-dashed border-border/60 p-6 text-center"
        style={{ background: 'rgba(255,255,255,0.02)' }}
      >
        <p className="text-sm font-bold text-muted">팀 편집 (예정)</p>
        <p className="text-xs text-muted mt-2">
          포메이션 선택 · 선수 배치 · 케미 설정 · 구단가치/OVR 자동 계산
        </p>
      </div>
    </div>
  );
}
