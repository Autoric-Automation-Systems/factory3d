import Link from "next/link";
import { currentUser } from "@/lib/session";
import { overallPercent } from "@/lib/progress";
import { playableModules } from "@/content/catalog";
import { brandAssets } from "@/lib/brand";
import BrandName from "./brand/BrandName";
import SiteNav from "./SiteNav";

const FIRST_MODULE = playableModules[0]?.slug ?? "agua";

export default async function SiteHeader() {
  const user = await currentUser();
  const percent = user ? overallPercent(playableModules, user.progress) : 0;
  const brand = brandAssets();

  return (
    <header className="site-header">
      <div className="container inner">
        <Link href={user ? "/hub" : "/"} className="brand" aria-label="Fábrica 3D">
          <BrandName src={brand.logoName} />
        </Link>

        <SiteNav
          user={user ? { name: user.name, image: user.image } : null}
          percent={percent}
          firstModule={FIRST_MODULE}
        />
      </div>
    </header>
  );
}
