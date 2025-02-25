
import React from "react";
import { ArticleCard } from "./ArticleCard";

const FEATURED_ARTICLES = [
  {
    id: 1,
    title: "The Future of Web Development: AI and Machine Learning Integration",
    abstract: "Explore how artificial intelligence is reshaping modern web development practices and improving user experiences.",
    thumbnail: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    category: "Technology",
    author: "Alex Johnson"
  },
  {
    id: 2,
    title: "Mastering the Art of Technical Writing",
    abstract: "Learn effective strategies for creating clear, concise, and engaging technical documentation.",
    thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    category: "Writing",
    author: "Sarah Chen"
  },
  {
    id: 3,
    title: "The Rise of Remote Work Culture",
    abstract: "Discover how companies are adapting to the new normal of remote work and virtual collaboration.",
    thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    category: "Business",
    author: "Michael Park"
  },
  {
    id: 4,
    title: "Essential Tools for Modern Developers",
    abstract: "A comprehensive guide to the most useful tools and technologies for today's software developers.",
    thumbnail: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    category: "Development",
    author: "Emily Rodriguez"
  }
];

export const FeaturedSection = () => {
  return (
    <section className="py-12">
      <div className="container">
        <h2 className="text-3xl font-bold mb-8 animate-fade-down">Featured Articles</h2>
        <div className="article-grid">
          {FEATURED_ARTICLES.map((article) => (
            <ArticleCard key={article.id} {...article} />
          ))}
        </div>
      </div>
    </section>
  );
};
