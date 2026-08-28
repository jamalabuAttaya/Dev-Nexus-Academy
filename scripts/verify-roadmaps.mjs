import fs from "node:fs/promises";
import path from "node:path";

const source = await fs.readFile(
  path.resolve("app/components/RoadmapExplorer.tsx"),
  "utf8",
);

function extractValue(name, opener, closer) {
  const declaration = new RegExp(`const ${name}(?::[^=]+)? = \\${opener}`);
  const match = declaration.exec(source);
  if (!match || match.index === undefined) {
    throw new Error(`Missing value: ${name}`);
  }

  const start = match.index + match[0].lastIndexOf(opener);
  let depth = 0;
  let quote = "";

  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    const previous = source[index - 1];

    if (quote) {
      if (character === quote && previous !== "\\") quote = "";
      continue;
    }

    if (character === '"' || character === "'" || character === "`") {
      quote = character;
      continue;
    }

    if (character === opener) depth += 1;
    if (character === closer) {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }

  throw new Error(`Unclosed value: ${name}`);
}

const roadmaps = Function(`return (${extractValue("roadmaps", "[", "]")});`)();
const englishRoadmaps = Function(
  `return (${extractValue("englishRoadmaps", "{", "}")});`,
)();
const groupDefinitions = Function(
  `return (${extractValue("groupDefinitions", "[", "]")});`,
)();
const problems = [];

if (roadmaps.length !== 16)
  problems.push(`Expected 16 roadmaps, found ${roadmaps.length}`);

const ids = new Set();
for (const roadmap of roadmaps) {
  if (ids.has(roadmap.id)) problems.push(`Duplicate roadmap id: ${roadmap.id}`);
  ids.add(roadmap.id);

  if (roadmap.steps.length !== 6) {
    problems.push(
      `${roadmap.id}: expected 6 steps, found ${roadmap.steps.length}`,
    );
  }

  try {
    const reference = new URL(roadmap.roadmapUrl);
    if (
      reference.protocol !== "https:" ||
      reference.hostname !== "roadmap.sh"
    ) {
      problems.push(`${roadmap.id}: invalid roadmap.sh reference`);
    }
  } catch {
    problems.push(`${roadmap.id}: malformed reference URL`);
  }

  const english = englishRoadmaps[roadmap.id];
  if (!english) problems.push(`${roadmap.id}: missing English content`);
  else if (english.steps.length !== roadmap.steps.length) {
    problems.push(`${roadmap.id}: Arabic and English step counts differ`);
  }
}

for (const id of Object.keys(englishRoadmaps)) {
  if (!ids.has(id)) problems.push(`Unused English roadmap: ${id}`);
}

const groupIds = new Set(groupDefinitions.map((group) => group.id));
for (const category of new Set(roadmaps.map((roadmap) => roadmap.category))) {
  if (!groupIds.has(category))
    problems.push(`Missing category filter: ${category}`);
}

const summary = {
  roadmaps: roadmaps.length,
  stages: roadmaps.reduce((total, roadmap) => total + roadmap.steps.length, 0),
  bilingualRecords: Object.keys(englishRoadmaps).length,
  categoryFilters: groupDefinitions.length,
};

if (problems.length) {
  console.error(JSON.stringify({ ok: false, summary, problems }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, summary }, null, 2));
