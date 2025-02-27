
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

const Category = () => {
  const { category } = useParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (category) {
      fetchCategoryArticles(category);
    }
  }, [category]);

  const fetchCategoryArticles = async (categoryName: string) => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("category", categoryName)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error("Error fetching category articles:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-8">
        <h1 className="text-2xl font-bold capitalize mb-6">
          {category} Articles
        </h1>
        {loading ? (
          <p>Loading articles...</p>
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
              <p>No articles found in this category.</p>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Category;
