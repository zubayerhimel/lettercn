export type FontCategory = "Casual" | "Elegant" | "Playful" | "Formal" | "Vintage";

export interface HandFont {
  id: string;
  name: string;
  family: string;
  category: FontCategory;
}

export const FONTS: HandFont[] = [
  { id: "caveat", name: "Caveat", family: "'Caveat', cursive", category: "Casual" },
  { id: "patrick-hand", name: "Patrick Hand", family: "'Patrick Hand', cursive", category: "Casual" },
  { id: "indie-flower", name: "Indie Flower", family: "'Indie Flower', cursive", category: "Playful" },
  { id: "kalam", name: "Kalam", family: "'Kalam', cursive", category: "Casual" },
  { id: "shadows", name: "Shadows Into Light", family: "'Shadows Into Light', cursive", category: "Casual" },
  { id: "architects", name: "Architects Daughter", family: "'Architects Daughter', cursive", category: "Playful" },
  { id: "reenie", name: "Reenie Beanie", family: "'Reenie Beanie', cursive", category: "Playful" },
  { id: "dancing", name: "Dancing Script", family: "'Dancing Script', cursive", category: "Elegant" },
  { id: "sacramento", name: "Sacramento", family: "'Sacramento', cursive", category: "Elegant" },
  { id: "parisienne", name: "Parisienne", family: "'Parisienne', cursive", category: "Elegant" },
  { id: "homemade-apple", name: "Homemade Apple", family: "'Homemade Apple', cursive", category: "Vintage" },
  { id: "la-belle", name: "La Belle Aurore", family: "'La Belle Aurore', cursive", category: "Vintage" },
  { id: "cedarville", name: "Cedarville Cursive", family: "'Cedarville Cursive', cursive", category: "Vintage" },
  { id: "nothing-you", name: "Nothing You Could Do", family: "'Nothing You Could Do', cursive", category: "Formal" },
  { id: "petit-formal", name: "Petit Formal Script", family: "'Petit Formal Script', cursive", category: "Formal" },
];

export const FONT_CATEGORIES: FontCategory[] = ["Casual", "Elegant", "Playful", "Formal", "Vintage"];

export const getFont = (id: string) => FONTS.find((f) => f.id === id) ?? FONTS[0];

export const GOOGLE_FONTS_HREF =
  "https://fonts.googleapis.com/css2?" +
  [
    "family=Caveat:wght@400;600",
    "family=Patrick+Hand",
    "family=Indie+Flower",
    "family=Kalam:wght@300;400",
    "family=Shadows+Into+Light",
    "family=Architects+Daughter",
    "family=Reenie+Beanie",
    "family=Dancing+Script:wght@400;600",
    "family=Sacramento",
    "family=Parisienne",
    "family=Homemade+Apple",
    "family=La+Belle+Aurore",
    "family=Cedarville+Cursive",
    "family=Nothing+You+Could+Do",
    "family=Petit+Formal+Script",
    "family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700",
    "family=Karla:wght@400;500;600",
  ].join("&") +
  "&display=swap";
