// Main entry point
export { NexonClient } from './NexonClient.js';
export type { NexonClientOptions } from './NexonClient.js';

// Game clients (also available via sub-path imports)
export { MapleStoryClient } from './games/maplestory/MapleStoryClient.js';

// Errors
export {
  NexonError,
  NexonRateLimitError,
  NexonAuthError,
  NexonNotFoundError,
  NexonBadRequestError,
  NexonDataNotReadyError,
  NexonServerError,
  NEXON_ERROR_CODES,
  classifyError,
} from './core/errors/index.js';
export type { NexonErrorCode, NexonErrorPayload } from './core/errors/index.js';

// Types
export type { OCID, GuildId, NexonDate } from './core/types/branded.js';
export { toNexonDate } from './core/types/date.js';
export type { DateRange, CursorPage, CursorPageRequest, AutoPaginationOptions } from './core/types/index.js';

// MapleStory types
export type { Achievement, AccountAchievement, AchievementInfo } from './games/maplestory/user-types.js';
export type {
  CharacterList,
  AccountCharacterList,
  CharacterSummary,
  CharacterBasic,
  CharacterPopularity,
  CharacterStat,
  FinalStat,
  CharacterHyperStat,
  HyperStatPreset,
  CharacterPropensity,
  CharacterAbility,
  AbilityInfo,
  AbilityPreset,
  CharacterItemEquipment,
  ItemEquipment,
  PresetItemEquipment,
  ItemTotalOption,
  ItemBaseOption,
  ItemExceptionalOption,
  ItemAddOption,
  ItemEtcOption,
  TitleInfo,
  MedalShape,
  CharacterCashItemEquipment,
  CashItemEquipmentItem,
  CashItemOption,
  CashItemColoringPrism,
  CharacterSymbolEquipment,
  SymbolInfo,
  CharacterSetEffect,
  SetEffectInfo,
  SetEffectOption,
  CharacterBeautyEquipment,
  HairInfo,
  FaceInfo,
  SkinInfo,
  CharacterAndroidEquipment,
  AndroidCashItem,
  AndroidPresetInfo,
  CharacterPetEquipment,
  PetEquipmentItem,
  PetAutoSkill,
  PetItemOption,
  CharacterSkill,
  SkillInfo,
  SkillGrade,
  SkillRequest,
  CharacterLinkSkill,
  LinkSkillInfo,
  CharacterVMatrix,
  VCoreEquipment,
  CharacterHexaMatrix,
  HexaCoreEquipment,
  HexaLinkedSkill,
  CharacterHexaMatrixStat,
  HexaStatCore,
  CharacterDojang,
  CharacterOtherStat,
  OtherStatEntry,
  OtherStatInfo,
  CharacterRingExchangeSkillEquipment,
} from './games/maplestory/character/types.js';

// MapleStory union types
export type {
  Union,
  UnionInnerStat,
  UnionBlockPosition,
  UnionBlock,
  UnionRaiderPreset,
  UnionRaider,
  UnionArtifactEffect,
  UnionArtifactCrystal,
  UnionArtifact,
  UnionChampionBadgeInfo,
  UnionChampionInfo,
  UnionChampion,
} from './games/maplestory/union/types.js';

// MapleStory guild types
export type {
  GuildIdResponse,
  WorldName,
  GuildSkill,
  GuildBasic,
} from './games/maplestory/guild/types.js';

// MapleStory history types
export type {
  HistoryRequest,
  StarforceEvent,
  StarforceHistoryItem,
  StarforceHistory,
  PotentialOption,
  PotentialHistoryItem,
  PotentialHistory,
  CubeHistoryItem,
  CubeHistory,
} from './games/maplestory/history/types.js';

// MapleStory ranking types
export type {
  RankingBaseRequest,
  OverallRankingRequest,
  UnionRankingRequest,
  GuildRankingRequest,
  DojangRankingRequest,
  TheSeedRankingRequest,
  OverallRankingItem,
  OverallRanking,
  UnionRankingItem,
  UnionRanking,
  GuildRankingItem,
  GuildRanking,
  DojangRankingItem,
  DojangRanking,
  TheSeedRankingItem,
  TheSeedRanking,
  AchievementRankingItem,
  AchievementRanking,
} from './games/maplestory/ranking/types.js';

// MapleStory notice types
export type {
  NoticeItem,
  NoticeDetail,
  NoticeList,
  UpdateNoticeList,
  EventNoticeItem,
  EventNoticeList,
  EventNoticeDetail,
  CashshopNoticeItem,
  CashshopNoticeList,
  CashshopNoticeDetail,
} from './games/maplestory/notice/types.js';

// HttpClient (for advanced usage)
export { HttpClient } from './core/http/HttpClient.js';
export type {
  HttpClientConfig,
  RequestInterceptor,
  ResponseInterceptor,
  RetryInterceptor,
  HttpLogger,
} from './core/http/http-types.js';
