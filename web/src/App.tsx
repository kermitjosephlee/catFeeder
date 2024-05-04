import { Suspense } from "react";
import { Footer, TopNav, Main } from "@components";

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col w-full text-red-800">
        <TopNav />
        <Main />
        <Footer />
      </div>
    </Suspense>
  );
}

export default App;
