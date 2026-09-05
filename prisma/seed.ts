import { Prisma, PrismaClient } from "@prisma/client";
import {
  LOCAL_CURATED_LISTS,
  LOCAL_RESTAURANTS,
  getLocalReviews,
} from "../src/data/schema";
import { LOCAL_ACTIVITIES, LOCAL_BANNERS, LOCAL_PLACES } from "../src/data/content";

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

  for (const a of LOCAL_ACTIVITIES) {
    await prisma.activity.upsert({
      where: { id: a.id },
      update: {},
      create: {
        id: a.id,
        name: a.name,
        description: a.description,
        category: a.category,
        region: a.region,
        schedule: a.schedule,
        price: a.price,
        thumbnail: a.thumbnail,
        images: a.images,
        link: a.link,
        latitude: a.latitude,
        longitude: a.longitude,
      },
    });
  }

  for (const p of LOCAL_PLACES) {
    await prisma.place.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category,
        region: p.region,
        address: p.address,
        bestTime: p.bestTime,
        thumbnail: p.thumbnail,
        images: p.images,
        latitude: p.latitude,
        longitude: p.longitude,
      },
    });
  }

  if ((await prisma.banner.count()) === 0) {
    await prisma.banner.createMany({
      data: LOCAL_BANNERS.map((b, order) => ({
        image: b.image,
        href: b.href,
        title: b.title,
        subtitle: b.subtitle,
        order,
      })),
    });
  }

  console.log(
    `✅ Done — ${LOCAL_RESTAURANTS.length} restaurants, ${LOCAL_CURATED_LISTS.length} curated lists, ` +
      `${LOCAL_ACTIVITIES.length} activities, ${LOCAL_PLACES.length} places, ${LOCAL_BANNERS.length} banners`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
