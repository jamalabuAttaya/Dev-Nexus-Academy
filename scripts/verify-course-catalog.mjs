import fs from "node:fs/promises";
import path from "node:path";

const source = await fs.readFile(
  path.resolve("app/data/courseCatalog.ts"),
  "utf8",
);

function extractArray(name) {
  const declaration = new RegExp(`export const ${name}(?::[^=]+)? = \\[`);
  const match = declaration.exec(source);
  if (!match || match.index === undefined) {
    throw new Error(`Missing array: ${name}`);
  }

  const start = match.index + match[0].lastIndexOf("[");
  let depth = 0;
  let open = -1;

  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    if (character === "[") {
      depth += 1;
      if (open === -1) open = index;
    } else if (character === "]") {
      depth -= 1;
      if (depth === 0 && open !== -1) return source.slice(open, index + 1);
    }
  }

  throw new Error(`Unclosed array: ${name}`);
}

const learningMedia = Function(`return (${extractArray("learningMedia")});`)();
const courseSections = Function(
  `return (${extractArray("courseSections")});`,
)();
const mediaIds = new Set(learningMedia.map((item) => item.id));
const problems = [];

if (learningMedia.length < 35) {
  problems.push(
    `Expected at least 35 curated resources, found ${learningMedia.length}`,
  );
}

if (courseSections.length < 20) {
  problems.push(
    `Expected at least 20 official sections, found ${courseSections.length}`,
  );
}

if (mediaIds.size !== learningMedia.length) {
  problems.push("The curated catalog contains duplicate media ids");
}

const sectionIds = new Set(courseSections.map((section) => section.id));
if (sectionIds.size !== courseSections.length) {
  problems.push("The official catalog contains duplicate section ids");
}

for (const media of learningMedia) {
  if (!/^[A-Za-z0-9_-]{6,}$/.test(media.id)) {
    problems.push(`${media.title}: invalid YouTube media id`);
  }

  if (
    !media.title.trim() ||
    !media.description.trim() ||
    !media.source.trim()
  ) {
    problems.push(`${media.id}: missing required catalog metadata`);
  }
}

for (const section of courseSections) {
  if (section.courseIds.length < 7) {
    problems.push(
      `${section.officialName}: has only ${section.courseIds.length} courses`,
    );
  }

  const uniqueIds = new Set(section.courseIds);
  if (uniqueIds.size !== section.courseIds.length) {
    problems.push(`${section.officialName}: contains duplicate course ids`);
  }

  for (const id of section.courseIds) {
    if (!mediaIds.has(id)) {
      problems.push(
        `${section.officialName}: missing referenced course id ${id}`,
      );
    }
  }
}

const summary = {
  sections: courseSections.length,
  media: learningMedia.length,
  minimumCoursesPerSection: Math.min(
    ...courseSections.map((section) => section.courseIds.length),
  ),
  officialSections: courseSections.map((section) => section.officialName),
};

if (problems.length) {
  console.error(JSON.stringify({ ok: false, summary, problems }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, summary }, null, 2));
