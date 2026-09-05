import type { Bike, BikeStatus, BikeUse } from "./catalog";
import type { ProductDetail } from "./product-details";

const validUses = new Set<BikeUse>(["cidade", "compacta", "passageiro", "distancia", "performance"]);
const validStatuses = new Set<BikeStatus>(["available", "coming_soon", "hidden"]);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function fail(message: string): never {
  throw new Error(`Catálogo inválido: ${message}`);
}

export function validateCatalogBase(bikes: readonly Bike[]) {
  const slugs = new Set<string>();

  for (const bike of bikes) {
    if (!slugPattern.test(bike.slug) || bike.id !== bike.slug) fail(`slug inválido para ${bike.name}.`);
    if (slugs.has(bike.slug)) fail(`slug duplicado: ${bike.slug}.`);
    slugs.add(bike.slug);

    const numbers = [bike.priceCents, bike.originalPriceCents, bike.rangeKm, bike.specs.motorWatts, bike.specs.motorCount, bike.specs.batteryVoltage, bike.specs.batteryAmpHours, bike.specs.batteryCount, bike.specs.capacityKg];
    if (numbers.some((value) => !Number.isFinite(value) || value < 0)) fail(`valor numérico inválido para ${bike.slug}.`);
    if (!Number.isInteger(bike.priceCents) || !Number.isInteger(bike.originalPriceCents)) fail(`preço em centavos inválido para ${bike.slug}.`);
    if (!validStatuses.has(bike.status)) fail(`status inválido para ${bike.slug}.`);
    if (bike.specs.secondaryMotorWatts !== undefined && (!Number.isFinite(bike.specs.secondaryMotorWatts) || bike.specs.secondaryMotorWatts < 0)) fail(`segundo motor inválido para ${bike.slug}.`);
    if (bike.specs.motorCount > 1 && !bike.specs.secondaryMotorWatts) fail(`segundo motor ausente para ${bike.slug}.`);
    if (!bike.uses.length || bike.uses.some((use) => !validUses.has(use))) fail(`uso inválido para ${bike.slug}.`);
    if (bike.available !== (bike.status === "available")) fail(`status e disponibilidade divergentes para ${bike.slug}.`);
  }
}

export function validateCatalog(bikes: readonly Bike[], details: Readonly<Record<string, ProductDetail>>) {
  validateCatalogBase(bikes);

  for (const bike of bikes) {
    const detail = details[bike.slug];
    if (!detail) fail(`detalhes ausentes para ${bike.slug}.`);
    if (!detail.gallery.length) fail(`galeria ausente para ${bike.slug}.`);
  }
}
