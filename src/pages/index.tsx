
import GlobeWithMakers from "@/components/globe-markers";
import { useNavigationEvent } from "@/components/component/use-nav";
import LoaderUI from "@/components/component/loader";
import { lazy, Suspense, useEffect, useState } from "react";

const LazyLoad = lazy(() => import('../components/globe-markers'))

export default function Home() {
//   const [loading, setLoading] = useState(true);
//  useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 500);

//     return () => clearTimeout(timer);
//   }, []);

//   if (loading) {
//     return <LoaderUI />;
//   }
  // useNavigationEvent(() => setLoading(false));
  return (
    <div>
      {/* {loading && <LoaderUI /> } */}
      <Suspense fallback={<LoaderUI />}>
        <LazyLoad />
      </Suspense>

      {/* <LoaderUI /> */}
    </div>
  );
}
