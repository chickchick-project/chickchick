const PERFUME_PREFIXES = [
  "플로럴",
  "머스키",
  "시트러스",
  "우디",
  "스파이시",
  "프레시",
  "오리엔탈",
  "아쿠아",
  "그린",
  "파우더리",
  "스위트",
  "발사믹",
  "프루티",
  "허브",
  "바닐라",
];

const CUTE_ANIMALS = [
  "토끼",
  "고양이",
  "강아지",
  "판다",
  "코알라",
  "햄스터",
  "다람쥐",
  "수달",
  "펭귄",
  "고슴도치",
  "미어캣",
  "알파카",
  "카피바라",
  "너구리",
  "비버",
];

export function generateNicknameCandidate(): string {
  const prefix =
    PERFUME_PREFIXES[Math.floor(Math.random() * PERFUME_PREFIXES.length)];
  const animal = CUTE_ANIMALS[Math.floor(Math.random() * CUTE_ANIMALS.length)];
  const suffix = Math.floor(1000 + Math.random() * 9000).toString();
  return `${prefix} ${animal} ${suffix}`;
}
