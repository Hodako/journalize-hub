import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Bookmark, Share } from "lucide-react";
import { toast } from "sonner";

interface Article {
  id: string;
  title: string;
  content: string;
  abstract: string;
  category: string;
  thumbnail_url: string;
  author_id: string;
  created_at: string;
  slug: string; // Add slug here
  author?: {
    username: string;
  };
}

const AuthorArticle = () => {
  const { author, slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (author && slug) {
      fetchArticleBySlug(author, slug);
      document.title = `${slug} - BanguJournal`;
    }
  }, [author, slug]);

  const fetchArticleBySlug = async (authorId: string, articleSlug: string) => {
    try {
      console.log(`Fetching article by author: ${authorId} and slug: ${articleSlug}`);

      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          author:profiles(username)
        `)
        .eq("author_id", authorId)
        .eq("slug", articleSlug)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          navigate("/404");
          return;
        }
        throw error;
      }

      if (!data) {
        console.error("Article not found");
        navigate("/404");
        return;
      }

      console.log("Article found:", data.title);
      setArticle(data);
      checkBookmarkStatus(data.id);
    } catch (error) {
      console.error("Error fetching article:", error);
      toast.error("Error loading article.");
    } finally {
      setLoading(false);
    }
  };

  // ... (rest of your component remains the same)
};

export default AuthorArticle;
