
import React, { useEffect, useState } from "react";
import { ArticleCard } from "./ArticleCard";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      let query = supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchArticles();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <section className="py-12">
      <div className="container">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold animate-fade-down">
              Featured Articles
            </h2>
            <div className="w-full max-w-xs">
              <Input
                type="search"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          {loading ? (
            <p>Loading articles...</p>
          ) : (
            <div className="article-grid">
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  title={article.title}
                  abstract={article.abstract || ""}
                  thumbnail={article.thumbnail_url}
                  category={article.category}
                  author={article.author_id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
