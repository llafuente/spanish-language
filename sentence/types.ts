export interface Sentence {
  text: string;
  location: {
    column: number;
  };
}

export interface SentenceError {
  where: Sentence;
  type: "warning" | "error";
  rule: string;
  fix: string | null;
}