import type { CategorySlug } from "@/lib/catalog";
import { unsplash } from "@/lib/unsplash";

// Editorial photography from Unsplash (free to use under the Unsplash License).
// Credits are kept here for attribution. Product photos live in the database
// (seeded from src/db/seed-data.ts).

export type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  credit: string;
};

export const photos = {
  hero: {
    src: unsplash("1603189343302-e603f7add05a"),
    alt: "Model in an oversized black coat, arms outstretched, against a white backdrop",
    width: 5000,
    height: 3750,
    credit: "Malicki M Beser",
  },
  bags: {
    src: unsplash("1624687943971-e86af76d57de"),
    alt: "Tan leather tote hanging against a white wardrobe door",
    width: 4000,
    height: 6000,
    credit: "Ugluk Potroshitel",
  },
  shoes: {
    src: unsplash("1675947258177-aa8120ddefa3"),
    alt: "Burgundy pebble-grain penny loafers on a white surface",
    width: 5908,
    height: 3939,
    credit: "Lily Johnson",
  },
  readyToWear: {
    src: unsplash("1574201635302-388dd92a4c3f"),
    alt: "Model pulling on a chunky ivory knit sweater",
    width: 3284,
    height: 4104,
    credit: "Valna Studio",
  },
  jewelry: {
    src: unsplash("1616837874254-8d5aaa63e273"),
    alt: "Gold snake chain necklace worn with a black blazer",
    width: 2960,
    height: 3089,
    credit: "Cat Han",
  },
  camelCoat: {
    src: unsplash("1653875842174-429c1b467548"),
    alt: "Woman in a camel coat and felt hat beneath stone arches",
    width: 2077,
    height: 3000,
    credit: "Renata K. Needham",
  },
  tailoring: {
    src: unsplash("1768595583026-01106c88aa10"),
    alt: "Figure in a taupe suit holding a newspaper against a clear sky",
    width: 4914,
    height: 7371,
    credit: "Becky Sherburn",
  },
  story: {
    src: unsplash("1574015974293-817f0ebebb74"),
    alt: "Black and white portrait of a woman in a dark shirt, hair in motion",
    width: 2080,
    height: 3241,
    credit: "Ayo Ogunseinde",
  },
  atelier: {
    src: unsplash("1517502166878-35c93a0072f0"),
    alt: "White hangers on an empty clothing rail",
    width: 2462,
    height: 3689,
    credit: "Andrej Lišakov",
  },
} satisfies Record<string, Photo>;

export const featuredCollections: {
  category: CategorySlug;
  title: string;
  photo: Photo;
}[] = [
  { category: "bags", title: "Bags", photo: photos.bags },
  { category: "shoes", title: "Shoes", photo: photos.shoes },
  { category: "ready-to-wear", title: "Knitwear", photo: photos.readyToWear },
  { category: "jewelry", title: "Jewelry", photo: photos.jewelry },
];
