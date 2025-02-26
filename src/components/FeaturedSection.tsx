
import React, { useEffect, useState } from "react";
import { ArticleCard } from "./ArticleCard";
import { supabase } from "@/integrations/supabase/client";

interface Article {
  id: string;
  title: string;
  abstract: string;
  thumbnail_url: string;
  category: string;
  author_id: string;
}

export const FeaturedSection = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20">
      <div className="container">
        <div className="flex flex-col gap-8">
          <h2 className="text-3xl font-bold animate-fade-down">
            Featured Articles
          </h2>
          {loading ? (
            <p>Loading articles...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-up">
              {articles.map((article, index) => (
                <div
                  key={article.id}
                  className="transition-all duration-300"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <ArticleCard
                    id={article.id}
                    title={article.title}
                    abstract={article.abstract || ""}
                    thumbnail={article.thumbnail_url}
                    category={article.category}
                    author={article.author_id}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
