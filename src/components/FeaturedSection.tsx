
import React, { useEffect, useState } from "react";
import { ArticleCard } from "./ArticleCard";
import { ArticleCardSkeleton } from "./ArticleCardSkeleton";
import { supabase } from "@/integrations/supabase/client";
import { shuffle } from "@/lib/utils";

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
      setArticles(shuffle(data || []));
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-8">
      <div className="container">
        <div className="article-grid animate-fade-up">
          {loading ? (
            Array(8).fill(null).map((_, index) => (
              <ArticleCardSkeleton key={index} />
            ))
          ) : (
            articles.map((article, index) => (
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
            ))
          )}
        </div>
      </div>
    </section>
  );
};
