export type TemplateLanguage = "en" | "bn";

export type TemplateCategory = "thank-you" | "apology" | "love" | "resignation" | "complaint";

export interface LetterTemplate {
  id: string;
  category: TemplateCategory;
  language: TemplateLanguage;
  title: string;
  summary: string;
  content: string;
  /** Font swap suggested when the template is applied (e.g. Bangla script). */
  suggestedFontId?: string;
}

export const TEMPLATE_CATEGORY_LABEL: Record<TemplateCategory, string> = {
  "thank-you": "Thank you",
  apology: "Apology",
  love: "Love letter",
  resignation: "Resignation",
  complaint: "Formal complaint",
};

export const LANGUAGE_LABEL: Record<TemplateLanguage, string> = {
  en: "English",
  bn: "Bangla",
};

export const TEMPLATES: LetterTemplate[] = [
  {
    id: "en-thank-you",
    category: "thank-you",
    language: "en",
    title: "A quiet thank-you",
    summary: "For a kindness that meant more than you let on.",
    content:
      "Dear [Name],\n\nI wanted to take a quiet moment to thank you — properly, not in passing. What you did meant more than I have the words for, and it has stayed with me.\n\nYou have a rare kindness, and I feel lucky to have been on the receiving end of it.\n\nWith warmth and gratitude,\n[Your name]\n",
  },
  {
    id: "en-apology",
    category: "apology",
    language: "en",
    title: "An honest apology",
    summary: "The kind that comes after you've actually understood.",
    content:
      "Dear [Name],\n\nI've been thinking about what happened, and I owe you a proper apology. I was wrong, and I'm sorry — not the quick kind of sorry, but the kind that comes after actually understanding what I did.\n\nYou deserved better from me. I hope, in time, you'll let me make it right.\n\nYours, with regret,\n[Your name]\n",
  },
  {
    id: "en-love",
    category: "love",
    language: "en",
    title: "A midnight love letter",
    summary: "For the person you keep walking toward.",
    content:
      "My dearest,\n\nThere are letters one writes at midnight because the day couldn't hold everything one felt. This is one of those.\n\nYou are, quite simply, my favourite thing — the best thought I get to think, the person I want to walk toward every time the world gets loud.\n\nYours, always,\n[Your name]\n",
  },
  {
    id: "en-resignation",
    category: "resignation",
    language: "en",
    title: "Resignation, kindly given",
    summary: "Two weeks' notice with grace intact.",
    content:
      "Dear [Manager's name],\n\nPlease accept this letter as formal notice of my resignation from the position of [Role] at [Company]. My last day will be [Date].\n\nI'm grateful for the opportunities I've had here and for the people I've worked alongside. I'll do everything I can to make the handover as smooth as possible.\n\nKind regards,\n[Your name]\n",
  },
  {
    id: "en-complaint",
    category: "complaint",
    language: "en",
    title: "A firm, formal complaint",
    summary: "Polite in tone, unambiguous in expectation.",
    content:
      "Dear Sir or Madam,\n\nI am writing to formally raise a complaint regarding [issue] which occurred on [date]. Despite my previous attempts to resolve the matter, it remains unaddressed.\n\nI would appreciate a written response within fourteen days outlining what action will be taken.\n\nYours faithfully,\n[Your name]\n",
  },
  {
    id: "bn-thank-you",
    category: "thank-you",
    language: "bn",
    title: "A quiet thank-you",
    summary: "For a kindness that meant more than you let on.",
    content:
      "প্রিয় [নাম],\n\nতোমাকে ধন্যবাদ জানানোর জন্য এই কয়েকটি লাইন লিখছি — চলতি কথায় নয়, মন থেকে। তুমি যা করেছ, তা আমার কাছে ভাষায় প্রকাশ করার মতো নয়। কথাটি এখনো মনে গেঁথে আছে।\n\nতোমার মতো একজনকে পাশে পাওয়া সত্যিই সৌভাগ্যের।\n\nকৃতজ্ঞতা ভরে,\n[তোমার নাম]\n",
    suggestedFontId: "galada",
  },
  {
    id: "bn-apology",
    category: "apology",
    language: "bn",
    title: "An honest apology",
    summary: "The kind that comes after you've actually understood.",
    content:
      "প্রিয় [নাম],\n\nসেদিনকার ঘটনার জন্য আমি সত্যিকারের ক্ষমা চাইছি। আমি ভুল করেছিলাম, এবং তা এখন স্পষ্ট বুঝতে পারছি।\n\nতুমি এর চেয়ে অনেক ভালো ব্যবহার প্রাপ্য ছিলে। আশা করি একদিন আমাকে ঠিক করার সুযোগ দেবে।\n\nঅনুতপ্ত হয়ে,\n[তোমার নাম]\n",
    suggestedFontId: "galada",
  },
  {
    id: "bn-love",
    category: "love",
    language: "bn",
    title: "A midnight love letter",
    summary: "For the person you keep walking toward.",
    content:
      "প্রিয়তম,\n\nকিছু চিঠি মাঝরাতে লেখা হয়, কারণ সারাদিন হৃদয়ের সব কথা ধরে রাখা যায় না। এটি সেই ধরনের একটি চিঠি।\n\nতুমি আমার সবচেয়ে প্রিয় ভাবনা, সবচেয়ে শান্ত মুহূর্ত। যখনই পৃথিবী কোলাহলে ভরে যায়, আমি তোমার দিকেই হাঁটি।\n\nচিরকাল তোমার,\n[তোমার নাম]\n",
    suggestedFontId: "galada",
  },
  {
    id: "bn-resignation",
    category: "resignation",
    language: "bn",
    title: "Resignation, kindly given",
    summary: "Two weeks' notice with grace intact.",
    content:
      "প্রিয় [ম্যানেজারের নাম],\n\nঅনুগ্রহ করে এই চিঠিটিকে [প্রতিষ্ঠানের নাম]-এ [পদ] পদ থেকে আমার আনুষ্ঠানিক পদত্যাগ হিসেবে গ্রহণ করুন। আমার শেষ কর্মদিবস হবে [তারিখ]।\n\nএখানে কাজ করার সুযোগ এবং সহকর্মীদের জন্য আমি কৃতজ্ঞ। দায়িত্ব হস্তান্তরের সময় সম্পূর্ণ সহযোগিতা করব।\n\nশ্রদ্ধান্তে,\n[আপনার নাম]\n",
    suggestedFontId: "hind-siliguri",
  },
  {
    id: "bn-complaint",
    category: "complaint",
    language: "bn",
    title: "A firm, formal complaint",
    summary: "Polite in tone, unambiguous in expectation.",
    content:
      "মহোদয়/মহোদয়া,\n\n[তারিখ]-এ [বিষয়] সংক্রান্ত একটি আনুষ্ঠানিক অভিযোগ জানাতে আমি এই পত্র লিখছি। পূর্ববর্তী যোগাযোগ সত্ত্বেও বিষয়টি এখনো অমীমাংসিত রয়েছে।\n\nচৌদ্দ দিনের মধ্যে গৃহীত পদক্ষেপ সম্পর্কে লিখিত জবাব প্রত্যাশা করছি।\n\nশ্রদ্ধান্তে,\n[আপনার নাম]\n",
    suggestedFontId: "hind-siliguri",
  },
];
