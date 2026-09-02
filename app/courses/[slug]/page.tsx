import type { Metadata } from "next";
import CourseLearningPortal from "../../components/CourseLearningPortal";

export const metadata: Metadata = {
  title: "الدورة التعليمية | Dev Nexus Academy",
  description: "تفاصيل الدورة والدروس وتتبع التقدم في Dev Nexus Academy.",
};

type CourseLearningPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CourseLearningPage({
  params,
}: CourseLearningPageProps) {
  const { slug } = await params;

  return <CourseLearningPortal slug={slug} />;
}
