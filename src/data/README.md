# Restaurant data guide

The JSON files in this folder are the app's **data source** (while `DATABASE_URL` is unset).
Save a file and the dev server picks it up automatically.

| File | Contents | Edit |
| --- | --- | --- |
| `restaurants.json` | Restaurant list | ✅ write here |
| `reviews.json` | Reviews per restaurant | ✅ optional |
| `curated.json` | Themed collections | ✅ optional |
| `*.example.json` | Samples (not used by the app, reference only) | ❌ |
| `schema.ts` | Validation + normalization logic | ⚠️ only when changing the format |

If the format is wrong, the server tells you which file and which entry is invalid on startup.

---

## 1. `restaurants.json`

An array of objects. Add `{ ... }` entries separated by commas inside `[]`.

### Fields

| Field | Type | Required | Description |
| --- | --- | :---: | --- |
| `id` | string | ✅ | Unique id. Letters, digits, hyphens. Becomes the URL: `/restaurants/<id>` |
| `name` | string | ✅ | Restaurant name |
| `description` | string | ✅ | One-line summary (shown on cards and detail) |
| `category` | enum | ✅ | One of the "Category values" below |
| `priceRange` | enum | ✅ | One of the "Price band values" below |
| `address` | string | ✅ | Full address |
| `region` | string | ✅ | Area string used for filtering/display. e.g. `"Yeoksam-dong, Gangnam-gu, Seoul"` |
| `latitude` | number | ✅ | Latitude (WGS84). e.g. `37.4979` |
| `longitude` | number | ✅ | Longitude (WGS84). e.g. `127.0276` |
| `phone` | string | ⬜ | Phone number. Omit or `null` if none |
| `thumbnail` | string(URL) | ⬜ | Main image URL |
| `images` | string(URL)[] | ⬜ | Extra image URLs. Default `[]` |
| `hasParking` | boolean | ⬜ | Parking available. Default `false` |
| `hasBreakTime` | boolean | ⬜ | Has a mid-day break. Default `false` |
| `openingHours` | object | ⬜ | Free-form `{ "key": "value" }`. e.g. `{ "Weekday": "11:00-22:00", "Monday": "Closed" }` |
| `nearestStation` | object | ⬜ | Nearest subway station. See "Station format" below |
| `ratingAvg` | number | ⬜ | **Rating** (average, 0–5). Default `0`. e.g. `4.5` |
| `ratingCount` | number | ⬜ | Number of ratings. Default `0`. e.g. `128` |
| `createdAt` | string(ISO) | ⬜ | Date added. Used for the "Newest" sort. e.g. `"2025-03-01T00:00:00.000Z"` |

### Station format (`nearestStation`)

| Sub-field | Type | Required | Description |
| --- | --- | :---: | --- |
| `name` | string | ✅ | Station name. e.g. `"Gangnam"` |
| `line` | string | ⬜ | Line. e.g. `"Line 2"` |
| `exit` | string | ⬜ | Exit. e.g. `"Exit 5"` |
| `walkMinutes` | number | ⬜ | Walking time in minutes. e.g. `5` |

```json
"nearestStation": { "name": "Gangnam", "line": "Line 2", "exit": "Exit 5", "walkMinutes": 5 }
```

Displayed on cards and detail as `Line 2 Gangnam · Exit 5 · 5 min walk`.

### Category values (`category`)

| Value | Label |
| --- | --- |
| `KOREAN` | Korean |
| `JAPANESE` | Japanese |
| `CHINESE` | Chinese |
| `WESTERN` | Western |
| `ASIAN` | Asian |
| `CAFE` | Cafe |
| `BAR` | Bar |
| `DESSERT` | Dessert |
| `ETC` | Other |

### Price band values (`priceRange`)

Per person, in USD.

| Value | Label |
| --- | --- |
| `UNDER_10` | Under $10 |
| `USD_10_20` | $10–20 |
| `USD_20_30` | $20–30 |
| `USD_30_50` | $30–50 |
| `USD_50_70` | $50–70 |
| `USD_70_100` | $70–100 |
| `OVER_100` | $100+ |

### Minimal example

```json
[
  {
    "id": "gangnam-gukbap",
    "name": "Gangnam Sundae Gukbap",
    "description": "24-hour pork-and-rice soup house.",
    "category": "KOREAN",
    "priceRange": "UNDER_10",
    "address": "1 Teheran-ro, Gangnam-gu, Seoul",
    "region": "Yeoksam-dong, Gangnam-gu, Seoul",
    "latitude": 37.5006,
    "longitude": 127.0366
  }
]
```

A fully populated example is in `restaurants.example.json`.

> **Finding coordinates**: right-click a place in Kakao Map / Google Maps → copy coordinates.
> Latitude 37–38 and longitude 126–128 puts you in Korea.

> **Image URLs**: external image hosts must be registered in `images.remotePatterns` in
> `next.config.ts`. Currently `picsum.photos`, `images.unsplash.com`, `k.kakaocdn.net` and a
> few others are registered. Add any new host there.

---

## 2. `reviews.json` (optional)

| Field | Type | Required | Description |
| --- | --- | :---: | --- |
| `id` | string | ✅ | Unique id |
| `restaurantId` | string | ✅ | Must match an `id` in `restaurants.json` |
| `rating` | number | ✅ | Integer 1–5 |
| `content` | string | ✅ | Review body |
| `authorName` | string | ⬜ | Display name. Default `"Anonymous"` |
| `images` | string(URL)[] | ⬜ | Attached images. Default `[]` |
| `createdAt` | string(ISO) | ⬜ | Date written |

```json
[
  {
    "id": "rev-1",
    "restaurantId": "gangnam-gukbap",
    "rating": 5,
    "content": "Rich broth even at 3am.",
    "authorName": "FoodieK"
  }
]
```

---

## 3. `curated.json` (optional)

Themed groups of restaurants. Shown on the home page and `/curated`.

| Field | Type | Required | Description |
| --- | --- | :---: | --- |
| `id` | string | ✅ | Unique id |
| `slug` | string | ✅ | Becomes the URL: `/curated/<slug>` |
| `title` | string | ✅ | Title |
| `description` | string | ✅ | Description |
| `theme` | string | ✅ | Theme label. e.g. `"Rainy day"`, `"Solo dinner"` |
| `coverImage` | string(URL) | ⬜ | Cover image |
| `createdAt` | string(ISO) | ⬜ | Date created |
| `items` | array | ✅ | See below (may be empty) |
| `items[].restaurantId` | string | ✅ | Must match an `id` in `restaurants.json` |
| `items[].comment` | string | ⬜ | One-line note about this restaurant |

> Unknown `restaurantId` values are skipped with a console warning.

```json
[
  {
    "id": "list-rainy",
    "slug": "rainy-day",
    "title": "For a rainy day",
    "description": "When you're craving a warm broth.",
    "theme": "Rainy day",
    "items": [
      { "restaurantId": "gangnam-gukbap", "comment": "Open 24 hours" }
    ]
  }
]
```

---

## 4. Moving to a real database (PostgreSQL) later

Once the JSON is filled in, you can load it straight into a database.

```bash
# fill DATABASE_URL in .env
pnpm prisma:migrate     # create tables
pnpm db:seed            # src/data/*.json → database
```

When `DATABASE_URL` is set the app reads the database instead of the JSON. The schema lives in
`prisma/schema.prisma` and maps 1:1 to the JSON format.
