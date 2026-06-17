import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// 넥슨 Open API 클라이언트
const nexonClient = axios.create({
  baseURL: process.env.NEXON_API_BASE || 'https://open.api.nexon.com',
  headers: {
    'x-nxopen-api-key': process.env.NEXON_API_KEY,
  },
});

// ───────────────────────────────────────────────
// 메타데이터 API (선수 정보, 시즌 등)
// ───────────────────────────────────────────────

/** 전체 선수 ID 목록 */
export const getSpidList = () =>
  nexonClient.get('/fconline/v1.0/metadata/spid').then((r) => r.data);

/** 시즌 ID 목록 */
export const getSeasonList = () =>
  nexonClient.get('/fconline/v1.0/metadata/seasonid').then((r) => r.data);

/** 선수 포지션 목록 */
export const getSpPositionList = () =>
  nexonClient.get('/fconline/v1.0/metadata/spposition').then((r) => r.data);

/** 선수 이미지 URL 생성 */
export const getPlayerImageUrl = (spid) =>
  `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/players/small/${spid}.png`;

// ───────────────────────────────────────────────
// 계정 API
// ───────────────────────────────────────────────

/** 닉네임으로 계정 조회 */
export const getAccountByNickname = (nickname) =>
  nexonClient
    .get('/fconline/v1.0/id', { params: { nickname } })
    .then((r) => r.data);

/** 최고 등급 조회 */
export const getMaxDivision = (ouid) =>
  nexonClient
    .get('/fconline/v1.0/user/maxdivision', { params: { ouid } })
    .then((r) => r.data);

export default nexonClient;
