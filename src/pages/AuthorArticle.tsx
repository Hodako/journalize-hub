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

  const banglaToBanglish = (text) => {
    const mappings = {
      "অ": "o", "আ": "a", "ই": "i", "ঈ": "i", "উ": "u", "ঊ": "u", "ঋ": "ri",
      "এ": "e", "ঐ": "oi", "ও": "o", "ঔ": "ou",
      "ক": "k", "খ": "kh", "গ": "g", "ঘ": "gh", "ঙ": "ng",
      "চ": "ch", "ছ": "chh", "জ": "j", "ঝ": "jh", "ঞ": "ny",
      "ট": "t", "ঠ": "th", "ড": "d", "ঢ": "dh", "ণ": "n",
      "ত": "t", "থ": "th", "দ": "d", "ধ": "dh", "ন": "n",
      "প": "p", "ফ": "ph", "ব": "b", "ভ": "bh", "ম": "m",
      "য": "y", "র": "r", "ল": "l", "শ": "sh", "ষ": "sh", "স": "s",
      "হ": "h", "ড়": "r", "ঢ়": "rh", "য়": "y", "ৎ": "t", "ং": "ng",
      "ঃ": "h", "ঁ": "",
      "া": "a", "ি": "i", "ী": "i", "ু": "u", "ূ": "u", "ৃ": "ri",
      "ে": "e", "ৈ": "oi", "ো": "o", "ৌ": "ou", "্": "",
      " ": " ", ".": ".", ",": ",", "?":"?", "!":"!", ":":":", ";":";",
    };

    let banglishText = "";
    for (const char of text) {
      if (mappings[char]) {
        banglishText += mappings[char];
      } else {
        banglishText += char;
      }
    }

    banglishText = banglishText.replace(/\s+/g, " ").trim();
    return banglishText;
  };

  const fetchArticleBySlug = async (authorName: string, articleSlug: string) => {
    try {
      console.log(`Fetching article by author: ${authorName} and slug: ${articleSlug}`);

      const { data: articles, error } = await supabase
        .from("articles")
        .select(`*, author:profiles(username)`);

      if (error) throw error;
      if (!articles || articles.length === 0) {
        throw new Error("No articles found");
      }
      console.log(`Found ${articles.length} articles in total`);

      const matchingArticle = articles.find((a) => {
        const currentSlug = banglaToBanglish(a.title).toLowerCase().replace(/[^a-z0-9]+/g, "-");
        return currentSlug === articleSlug.toLowerCase();
      });

      if (!matchingArticle) {
        console.error("No article matches the slug:", articleSlug);
        throw new Error("Article not found");
      }

      const displayedAuthor = matchingArticle.author?.username || `user_${matchingArticle.author_id.substring(0, 8)}`;
      if (displayedAuthor !== authorName && authorName !== matchingArticle.author_id) {
        console.error("Author mismatch:", displayedAuthor, authorName);
        throw new Error("Author mismatch");
      }

      console.log("Article found:", matchingArticle.title);
      setArticle(matchingArticle);
      checkBookmarkStatus(matchingArticle.id);
    } catch (error) {
      console.error("Error fetching article:", error);
      navigate("/404");
    } finally {
      setLoading(false);
    }
  };

  const checkBookmarkStatus = async (articleId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("article_id", articleId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!error && data) {
      setIsBookmarked(true);
    }
  };

  const toggleBookmark = async () => {
    if (!article) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please sign in to bookmark articles");
      return;
    }

    try {
      if (isBookmarked) {
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .match({ article_id: article.id, user_id: user.id });
        if (error) throw error;
        setIsBookmarked(false);
        toast.success("Bookmark removed");
      } else {
        const { error } = await supabase
          .from("bookmarks")
          .insert({ article_id: article.id, user_id: user.id });
        if (error) throw error;
        setIsBookmarked(true);
        toast.success("Article bookmarked");
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Failed to update bookmark");
    }
  };

  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.abstract,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container max-w-4xl py-8">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/4 mb-8" />
          <Skeleton className="h-64 w-full mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Article not found</h1>
            <p>The article you're looking for doesn't exist or has been removed.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container max-w-4xl py-8">
        <article className="prose lg:prose-xl mx-auto">
          <div

