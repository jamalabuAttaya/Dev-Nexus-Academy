import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found-page" id="main-content">
      <span>404</span>
      <h1>هذه الصفحة خارج المسار</h1>
      <p>The page you requested could not be found.</p>
      <div>
        <Link href="/">العودة للرئيسية</Link>
        <Link href="/roadmaps">استكشف خرائط الطريق</Link>
      </div>
    </main>
  );
}
