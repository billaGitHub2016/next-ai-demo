import BackToTop from "./backToTop";
import HomePage from "./home/page";

export const metadata = {
  // title: "Home - || ChatenAI - AI SaaS Website NEXTJS14 UI Kit",
  title: "H.S. 智汇",
  description: "H.S. 智汇 ChatAI",
};

export default function Home() {
  return (
    <main>
      <HomePage />

      <BackToTop />
    </main>
  );
}
