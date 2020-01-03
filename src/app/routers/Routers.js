import React, { lazy, Suspense } from "react";
import { Route } from "react-router-dom";

const HomePage = lazy(() => import("./../features/HomePage/HomePage"));
const ListPage = lazy(() => import("./../features/ListPage/ListPage"));
const ProfilePage = lazy(() => import("./../features/ProfilePage/ProfilePage"));
const DashboardPage = lazy(() => import("./../features/Dashboard/Dashboard"));
const ProdctDetailsPage = lazy(() =>
  import("./../features/ProductDetailsPage/ProductDetailsPage")
);
const InfiniteLoadList = lazy(() =>
  import("./../features/InfiniteLoadList/InfiniteLoadList")
);
const Routers = () => {
  return (
    <Suspense fallback={() => <div>Loading...</div>}>
      <Route path="/" exact component={HomePage} />
      <Route path="/gift-lists/:categoryName" component={InfiniteLoadList} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/gift-card/:productId" component={ProdctDetailsPage} />
      {/* This is the test page. It won't render in the UI */}
      <Route path="/gift-lists-new/:categoryName" component={ListPage} />
    </Suspense>
  );
};

export default Routers;
