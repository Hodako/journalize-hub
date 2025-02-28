
import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">About BanguJournal</h1>
        
        <section className="mb-8 prose dark:prose-invert max-w-none">
          <p className="text-xl">
            BanguJournal is a premier digital publication dedicated to delivering insightful, 
            accurate, and engaging content about Bangladesh and beyond.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p>
            At BanguJournal, we believe in the power of quality journalism to inform, educate, 
            and inspire. Our mission is to provide readers with well-researched articles that 
            offer deep insights into important topics affecting Bangladesh and the global community.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Values</h2>
          <ul className="space-y-2">
            <li><strong>Integrity:</strong> We uphold the highest standards of journalistic integrity and ethics.</li>
            <li><strong>Accuracy:</strong> We are committed to factual reporting and thorough fact-checking.</li>
            <li><strong>Independence:</strong> Our editorial decisions are independent and free from external influence.</li>
            <li><strong>Innovation:</strong> We embrace technology to enhance storytelling and reader experience.</li>
            <li><strong>Inclusivity:</strong> We represent diverse perspectives and voices in our coverage.</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Team</h2>
          <p>
            BanguJournal brings together a team of passionate writers, editors, and subject matter 
            experts who are dedicated to producing content of the highest quality. Our contributors 
            come from diverse backgrounds but share a common commitment to excellence in journalism.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
          <p>
            We value your feedback and are always open to suggestions, story ideas, or collaborations. 
            Please feel free to reach out to us at:
          </p>
          <p>
            <strong>Email:</strong> info@bangujournal.buzz<br />
            <strong>Address:</strong> Dhaka, Bangladesh
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Join Our Community</h2>
          <p>
            Stay connected with BanguJournal by following us on social media platforms and subscribing 
            to our newsletter for the latest updates.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
