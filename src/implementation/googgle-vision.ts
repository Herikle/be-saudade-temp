import vision from "@google-cloud/vision";

const client = new vision.ImageAnnotatorClient();

type AnimalAnalysisResult = {
  hasAnimal: boolean;
  possibleSpeciesRaw: string[];
  possibleSpecies: string[];
  sceneLabels: string[];
};

export async function analyzeImage(
  image: Buffer,
): Promise<AnimalAnalysisResult> {
  const request = { image: { content: image } };

  const [result] = await client.annotateImage({
    ...request,
    features: [{ type: "LABEL_DETECTION", maxResults: 20 }],
  });

  const labels = result.labelAnnotations ?? [];

  // 2) Possível espécie (heurística, não ciência)
  const animalKeywords = [
    "dog",
    "cat",
    "horse",
    "cow",
    "bird",
    "fish",
    "reptile",
    "snake",
    "lizard",
    "rabbit",
  ];

  const possibleSpeciesRaw = labels
    .filter((label) =>
      animalKeywords.some((k) => label.description?.toLowerCase().includes(k)),
    )
    .map((label) => label.description!)
    .filter(Boolean);

  const possibleSpecies = labels.flatMap((label) => {
    const desc = label.description?.toLowerCase();
    if (!desc) return [];
    return animalKeywords.filter((k) => desc.includes(k));
  });

  const hasAnimal = possibleSpecies.length > 0 || possibleSpeciesRaw.length > 0;

  const sceneLabels = labels
    .filter((label) => (label.score ?? 0) > 0.6)
    .map((label) => label.description!)
    .filter(Boolean);

  return {
    hasAnimal,
    possibleSpeciesRaw: Array.from(new Set(possibleSpeciesRaw)),
    possibleSpecies: Array.from(new Set(possibleSpecies)),
    sceneLabels: Array.from(new Set(sceneLabels)),
  };
}
