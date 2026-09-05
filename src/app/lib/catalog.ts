import { bikes, type Bike } from "../data/catalog";

export function getAllBikes(): Bike[] {
  return bikes.filter((bike) => bike.status !== "hidden");
}

export function getBikeBySlug(slug: string): Bike | undefined {
  return getAllBikes().find((bike) => bike.slug === slug);
}

export function getFeaturedBikes(): Bike[] {
  return getAllBikes()
    .filter((bike) => bike.featuredOrder !== undefined)
    .sort((first, second) => first.featuredOrder! - second.featuredOrder!)
    .slice(0, 4);
}

export function getRelatedBikes(slug: string): Bike[] {
  const bike = getBikeBySlug(slug);
  if (!bike) return [];

  return getAllBikes()
    .filter((item) => item.slug !== slug)
    .map((item) => ({ item, sharedUses: item.uses.filter((use) => bike.uses.includes(use)).length }))
    .sort((first, second) => second.sharedUses - first.sharedUses || first.item.name.localeCompare(second.item.name, "pt-BR"))
    .slice(0, 3)
    .map(({ item }) => item);
}
