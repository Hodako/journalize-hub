
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArticleCard } from "@/components/ArticleCard";
import { supabase } from "@/integrations/supabase/client";

interface Article {
  id: string;
  title: string;
  abstract: string;
  thumbnail_url: string;
  category: string;
  author_id: string;
}

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      searchArticles(query);
    }
  }, [query]);

  const searchArticles = async (searchQuery: string) => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .or(`title.ilike.%${searchQuery}%,abstract.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error("Error searching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-8">
        <h1 className="text-2xl font-bold mb-6">
          Search Results for "{query}"
        </h1>
        {loading ? (
          <p>Loading results...</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                id={article.id}
                title={article.title}
                abstract={article.abstract}
                thumbnail={article.thumbnail_url}
                category={article.category}
                author={article.author_id}
              />
            ))}
            {articles.length === 0 && (
              <p>No articles found matching your search.</p>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Search;
