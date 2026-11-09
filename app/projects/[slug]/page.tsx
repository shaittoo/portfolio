import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllProjects, getProject } from "@/lib/projects";

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/projects/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.meta.title} | Shaina Talisay`,
    description: project.meta.summary,
  };
}

// The page itself stays synchronous so Next can render its shell instantly.
// Reading `params` happens inside <ProjectContent>, behind a Suspense boundary.
export default function ProjectPage(props: PageProps<"/projects/[slug]">) {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-16">
      <Suspense fallback={<ProjectSkeleton />}>
        <ProjectContent params={props.params} />
      </Suspense>
    </article>
  );
}

type Params = PageProps<"/projects/[slug]">["params"];

async function ProjectContent({ params }: { params: Params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const { meta, content } = project;

  return (
    <>
      <h1 className="text-4xl font-bold">{meta.title}</h1>
      <p className="mt-2 text-lg opacity-70">{meta.summary}</p>
      {/* TODO (yours): show role, team, timeline, and stack tags here */}
      <div className="prose prose-lg mt-10 max-w-none dark:prose-invert">
        <MDXRemote source={content} />
      </div>
    </>
  );
}

function ProjectSkeleton() {
  return (
    <div aria-hidden className="animate-pulse">
      <div className="h-10 w-1/2 rounded bg-current opacity-10" />
      <div className="mt-4 h-5 w-3/4 rounded bg-current opacity-10" />
      <div className="mt-10 h-64 rounded bg-current opacity-10" />
    </div>
  );
}
