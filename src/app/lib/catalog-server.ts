import "server-only";

import { existsSync } from "node:fs";
import { resolve, sep } from "node:path";

import { bikes } from "../data/catalog";
import { productDetails, type ProductDetail } from "../data/product-details";

/** Server-only to keep galleries and editorial text out of client catalog bundles. */
export function getBikeDetails(slug: string): ProductDetail | undefined {
  return productDetails[slug];
}

/** Run only from a server build/request boundary, never from a client component. */
export function validateCatalogImages() {
  const publicDirectory = resolve(process.cwd(), "public");
  const imagePaths = [
    ...bikes.map((bike) => bike.image),
    ...Object.values(productDetails).flatMap((detail) => detail.gallery),
  ];

  for (const imagePath of imagePaths) {
    if (!imagePath.startsWith("/imagens/")) throw new Error(`Catálogo inválido: caminho de imagem não permitido: ${imagePath}.`);

    const filePath = resolve(publicDirectory, imagePath.slice(1));
    if (!filePath.startsWith(`${publicDirectory}${sep}`) || !existsSync(filePath)) {
      throw new Error(`Catálogo inválido: imagem ausente em public/${imagePath.slice(1)}.`);
    }
  }
}
