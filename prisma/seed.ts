import { Prisma, PrismaClient } from "@prisma/client";
import {
  LOCAL_CURATED_LISTS,
  LOCAL_RESTAURANTS,
  getLocalReviews,
} from "../src/data/schema";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding from src/data/*.json ...");

  for (const r of LOCAL_RESTAURANTS) {
    await prisma.restaurant.upsert({
      where: { id: r.id },
      update: {},
      create: {
        id: r.id,
        name: r.name,
        description: r.description,
        category: r.category,
        priceRange: r.priceRange,
        address: r.address,
        region: r.region,
        latitude: r.latitude,
        longitude: r.longitude,
        phone: r.phone,
        thumbnail: r.thumbnail,
        images: r.images,
        hasParking: r.hasParking,
        hasBreakTime: r.hasBreakTime,
        openingHours: r.openingHours ?? undefined,
        nearestStation: (r.nearestStation ?? undefined) as
          | Prisma.InputJsonValue
          | undefined,
        ratingAvg: r.ratingAvg,
        ratingCount: r.ratingCount,
      },
    });

    for (const review of getLocalReviews(r.id)) {
      const author = await prisma.user.upsert({
        where: { email: `${review.author.id}@local.seed` },
        update: {},
        create: { email: `${review.author.id}@local.seed`, name: review.author.name },
      });
      await prisma.review.upsert({
        where: { restaurantId_authorId: { restaurantId: r.id, authorId: author.id } },
        update: {},
        create: {
          id: review.id,
          rating: review.rating,
          content: review.content,
          images: review.images,
          restaurantId: r.id,
          authorId: author.id,
        },
      });
    }
  }

  for (const list of LOCAL_CURATED_LISTS) {
    await prisma.curatedList.upsert({
      where: { slug: list.slug },
      update: {},
      create: {
        id: list.id,
        slug: list.slug,
        title: list.title,
        description: list.description,
        coverImage: list.coverImage,
        theme: list.theme,
        items: {
          create: list.items.map((item, index) => ({
            order: index,
            comment: item.comment,
            restaurantId: item.restaurant.id,
          })),
        },
      },
    });
  }

  console.log(
    `✅ Done — ${LOCAL_RESTAURANTS.length} restaurants, ${LOCAL_CURATED_LISTS.length} curated lists`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
