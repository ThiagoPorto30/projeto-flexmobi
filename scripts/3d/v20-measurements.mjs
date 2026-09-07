// Metres throughout. Evidence about a component is not a measurement of the bike.
export const measurementSources = {
  inow: {
    url: 'https://inowbrasil.com.br/produto/inow-v20-brake-pro',
    title: 'INOW V20 Brake Pro',
    evidence: 'FAT 20 × 4 inches; no complete dimensional drawing found on this page.',
    scope: 'Current Brake Pro; the photographed production version is not confirmed.',
  },
  kenda: {
    url: 'https://bicycle.kendatire.com/en-us/find-a-tire/bicycle/fat-plus-tires/krusade-sport/',
    title: 'Kenda Krusade Sport K1188',
    evidence: 'Part 01204118801: 20 × 4.00, ETRTO 98-406.',
    scope: 'Nominal component specification. Kenda/Krusade markings match the photos; exact fitment remains conditional.',
  },
  manual: {
    url: 'https://drive.google.com/file/d/1yBA1T0UR3Ymb1rClpbrby5TpjSSxvSw7/view',
    distributorUrl: 'https://www.neonmobilidade.com.br/pagina/blog-manual-do-usuario-bicicleta-eletrica-v20-pro-download-em-pdf.html',
    title: 'V20 PRO - MANUAL DE INSTRUÇÕES - PT_BR X.pdf',
    page: 7,
    evidence: 'BK-V20 Pro, 750 W. Vehicle: 164 × 68 × 115 cm. Packaging: 142.5 × 27 × 86.5 cm.',
    scope: 'Manual distributed by a reseller, not retrieved from INOW. Exact model/year equivalence unverified.',
  },
  etrto: {
    url: 'https://www.schwalbe.com/en/technology-faq/tire-sizes/',
    title: 'Schwalbe — Tire sizes',
    evidence: 'ETRTO identifies nominal section width and bead/inner diameter, not inflated outside diameter.',
  },
};

// The old authoring rim centreline had radius .214. Use the documented bead
// diameter as a scale anchor; then rebuild the rim/flanges, instead of stretching
// X/Y/Z to match the dimensions of an unconfirmed bike variant.
export const modelScale = .406 / (.214 * 2);
export const wheelDimensions = Object.freeze({
  beadSeatDiameter: .406,
  nominalSectionWidth: .098,
  // The following values are modelling assumptions, NOT manufacturer dimensions.
  beadHalfSpacing: .032,
  flangeRadius: .209,
  carcassRadius: .307 * modelScale,
  shoulderRadius: .252 * modelScale,
  treadHeight: .005 * modelScale,
});

export const measurementEvidence = {
  units: 'metres',
  sourceCheckedOn: '2026-09-05',
  scaleMethod: 'Uniform rim-anchored reconstruction. No non-uniform fit to another variant.',
  authoringToMetres: modelScale,
  nominal: {
    tireSize: { value: '20 × 4', source: 'inow', status: 'documented-model-specification' },
    beadSeatDiameter: { value: .406, source: 'kenda', status: 'documented-component-nominal', fitment: 'conditional' },
    tireSectionWidth: { value: .098, source: 'kenda', status: 'documented-component-nominal', fitment: 'conditional' },
  },
  comparisonOnly: {
    vehicle: { length: 1.64, width: .68, height: 1.15 },
    source: 'manual',
    status: 'different-or-unconfirmed-variant',
    applied: false,
    reason: 'BK-V20 Pro 750 W manual; exact Brake Pro production version not established.',
  },
  estimated: [
    'Inflated tire outside diameter, pressure, rim width and flange profile',
    'Wheelbase, overall dimensions and saddle height',
    'Battery enclosure, frame tubes, fork, brake rotors and hidden surfaces',
  ],
  sources: measurementSources,
};
