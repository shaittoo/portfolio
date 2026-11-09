import fs from "fs";
import path from "path";
import matter from "gray-matter";

const DIR = path.join(process.cwd(), "content/projects");

export type ProjectMeta = {
  slug: string;
  title: string;
  summary: string;
  role: string;
  team: string;
  timeline: string;
  stack: string[];
  order: number;
  featured: boolean;
  cover?: string;
  links?: { repo?: string; live?: string };
};

export function getAllProjects(): ProjectMeta[] {
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const { data } = matter(fs.readFileSync(path.join(DIR, file), "utf8"));
      return { slug: file.replace(/\.mdx$/, ""), ...data } as ProjectMeta;
    })
    .sort((a, b) => a.order - b.order);
}

export function getProject(slug: string) {
  const file = path.join(DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return { meta: { slug, ...data } as ProjectMeta, content };
}
