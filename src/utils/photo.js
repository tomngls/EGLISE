const BASE_URL = "https://pub-200f1f739589461eb0b246a78be8b7ef.r2.dev/images";

export function genererPhotos(dossier, nbPhotos) {
  return Array.from(
    { length: nbPhotos },
    (_, i) =>
      `${BASE_URL}/${dossier}/${String(i + 1).padStart(2, "0")}.avif`
  );
}