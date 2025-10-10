// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding review attributes...");

  // 1. ReviewAttribute (카테고리) 생성
  const feeling = await prisma.reviewAttribute.upsert({
    where: { key: "feeling" },
    update: {},
    create: { key: "feeling", name: "느낌" },
  });
  // ... 나머지 모든 카테고리 생성
  const longevity = await prisma.reviewAttribute.upsert({
    where: { key: "longevity" },
    update: {},
    create: { key: "longevity", name: "지속력" },
  });
  const sillage = await prisma.reviewAttribute.upsert({
    where: { key: "sillage" },
    update: {},
    create: { key: "sillage", name: "잔향" },
  });
  const genderTone = await prisma.reviewAttribute.upsert({
    where: { key: "genderTone" },
    update: {},
    create: { key: "genderTone", name: "성별" },
  });
  const season = await prisma.reviewAttribute.upsert({
    where: { key: "season" },
    update: {},
    create: { key: "season", name: "계절감" },
  });
  const timeOfDay = await prisma.reviewAttribute.upsert({
    where: { key: "timeOfDay" },
    update: {},
    create: { key: "timeOfDay", name: "시간대" },
  });
  const pricePerception = await prisma.reviewAttribute.upsert({
    where: { key: "pricePerception" },
    update: {},
    create: { key: "pricePerception", name: "가격" },
  });

  console.log("ReviewAttributes seeded.");

  // 2. AttributeOption (선택지) 생성
  const optionsToCreate = [
    // Feeling
    { attributeId: feeling.id, value: "DISLIKE", name: "싫어요" },
    { attributeId: feeling.id, value: "BAD", name: "별로에요" },
    { attributeId: feeling.id, value: "NEUTRAL", name: "괜찮아요" },
    { attributeId: feeling.id, value: "GOOD", name: "좋아요" },
    { attributeId: feeling.id, value: "BEST", name: "최고에요" },
    // Longevity
    {
      attributeId: longevity.id,
      value: "VERY_WEAK",
      name: "매우 짧음 (1시간 미만)",
    },
    { attributeId: longevity.id, value: "WEAK", name: "짧음 (1-3시간)" },
    { attributeId: longevity.id, value: "MODERATE", name: "중간 (3-6시간)" },
    {
      attributeId: longevity.id,
      value: "LONG_LASTING",
      name: "긴 지속력 (6시간 이상)",
    },
    // Sillage
    {
      attributeId: sillage.id,
      value: "INTIMATE",
      name: "자신만 느낄 수 있는 정도",
    },
    {
      attributeId: sillage.id,
      value: "MODERATE",
      name: "가까이 있는 사람이 느낄 수 있는 정도",
    },
    {
      attributeId: sillage.id,
      value: "STRONG",
      name: "주변 사람들이 쉽게 느낄 수 있는 정도",
    },
    // GenderTone
    { attributeId: genderTone.id, value: "FEMININE", name: "여성적인" },
    { attributeId: genderTone.id, value: "UNISEX", name: "중성적인" },
    { attributeId: genderTone.id, value: "MASCULINE", name: "남성적인" },
    // Season
    { attributeId: season.id, value: "SPRING", name: "봄" },
    { attributeId: season.id, value: "SUMMER", name: "여름" },
    { attributeId: season.id, value: "AUTUMN", name: "가을" },
    { attributeId: season.id, value: "WINTER", name: "겨울" },
    // TimeOfDay
    { attributeId: timeOfDay.id, value: "DAY", name: "낮" },
    { attributeId: timeOfDay.id, value: "NIGHT", name: "밤" },
    // PricePerception
    { attributeId: pricePerception.id, value: "EXPENSIVE", name: "비싸요" },
    { attributeId: pricePerception.id, value: "REASONABLE", name: "적당해요" },
    {
      attributeId: pricePerception.id,
      value: "GOOD_VALUE",
      name: "가성비가 좋아요",
    },
  ];

  for (const option of optionsToCreate) {
    await prisma.attributeOption.upsert({
      where: {
        attribute_options_attribute_id_value_key: {
          attributeId: option.attributeId,
          value: option.value,
        },
      },
      update: {},
      create: option,
    });
  }

  console.log("AttributeOptions seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
