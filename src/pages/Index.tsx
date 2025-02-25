
import React from "react";
import { Header } from "@/components/Header";
import { FeaturedSection } from "@/components/FeaturedSection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <FeaturedSection />
      </main>
    </div>
  );
};

export default Index;
