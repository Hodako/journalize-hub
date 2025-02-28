
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Bold,
  Italic,
  Underline,
  Link,
  Image,
  Type,
  ListOrdered,
  ListMinus,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";

const categories = [
  "Technology",
  "Science",
  "Health",
  "Business",
  "Entertainment",
  "Sports",
  "Politics",
  "Arts",
  "Travel",
  "Education"
];

const EditArticle = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchArticle();
    }
  }, [id]);

  const fetchArticle = async () => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      // Check if current user is the author
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id !== data.author_id) {
        toast.error("You don't have permission to edit this article");
        navigate("/");
        return;
      }

      setTitle(data.title);
      setAbstract(data.abstract || "");
      setContent(data.content || "");
      setCategory(data.category || categories[0]);
      setThumbnailUrl(data.thumbnail_url || "");
    } catch (error) {
      console.error("Error fetching article:", error);
      toast.error("Failed to fetch article");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from("articles")
        .update({
          title,
          abstract,
          content,
          category,
          thumbnail_url: thumbnailUrl,
        })
        .eq("id", id);

      if (error) throw error;

      toast.success("Article updated successfully!");
      navigate("/profile");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const formatSelection = (tag: string) => {
    const textarea = document.getElementById("content") as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const beforeText = content.substring(0, start);
    const afterText = content.substring(end);

    setContent(`${beforeText}<${tag}>${selectedText}</${tag}>${afterText}`);
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      const textarea = document.getElementById("content") as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      const beforeText = content.substring(0, start);
      const afterText = content.substring(end);

      setContent(
        `${beforeText}<a href="${url}">${selectedText || url}</a>${afterText}`
      );
    }
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      const textarea = document.getElementById("content") as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const beforeText = content.substring(0, start);
      const afterText = content.substring(start);

      setContent(`${beforeText}<img src="${url}" alt="Image" />${afterText}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container max-w-4xl py-8">
          <Skeleton className="h-10 w-60 mb-8" />
          <Skeleton className="h-12 w-full mb-6" />
          <Skeleton className="h-8 w-40 mb-6" />
          <Skeleton className="h-24 w-full mb-6" />
          <Skeleton className="h-64 w-full mb-6" />
          <Skeleton className="h-12 w-full mb-6" />
          <Skeleton className="h-10 w-32" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container max-w-4xl py-8">
        <h1 className="text-3xl font-bold mb-8">Edit Article</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="text-xl font-bold"
            />
          </div>
          <div className="space-y-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="Abstract"
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              required
            />
          </div>
          <div className="border rounded-lg p-2 space-y-2">
            <div className="flex gap-2 border-b pb-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => formatSelection("b")}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => formatSelection("i")}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => formatSelection("u")}
              >
                <Underline className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={insertLink}
              >
                <Link className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={insertImage}
              >
                <Image className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => formatSelection("h2")}
              >
                <Type className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => formatSelection("ol")}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => formatSelection("ul")}
              >
                <ListMinus className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              id="content"
              placeholder="Write your article content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="min-h-[400px]"
            />
          </div>
          <div className="space-y-2">
            <Input
              placeholder="Thumbnail URL"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-4">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/profile")}>
              Cancel
            </Button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default EditArticle;
