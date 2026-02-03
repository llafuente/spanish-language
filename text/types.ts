/**
 * Location in a text
 */
export interface TextLocation {
  line: number;
  column: number;
}

// parlamento
/**
 * Dialog text
 */
export interface DialogText {
  type: "DialogText";
  text: string;
  location: TextLocation;
}
// acotación | inciso | Comentario del narrador
/**
 * Narrator comment
 */
export interface NarratorComment {
  type: "NarratorComment";
  text: string;
  location: TextLocation;
}
/**
 * Valid parts of a Dialog
 */
export type DialogPart = DialogText | NarratorComment;

/**
 * Dialog Paragraph
 */
export interface DialogParagraph {
  type: "Dialog";
  parts: DialogPart[];
  location: TextLocation;
}

export interface NarrativeParagraph {
  type: "Narrative";
  text: string;
  location: TextLocation;
}

export interface QuoteParagraph {
  type: "Quote";
  text: string;
  location: TextLocation;
}
export interface EmptyParagraph {
  type: "EmptyParagraph";
  location: TextLocation;
}

export type Parragraphs = DialogParagraph | NarrativeParagraph | QuoteParagraph | EmptyParagraph;
export type TextPart = DialogParagraph | NarrativeParagraph | QuoteParagraph | DialogText | NarratorComment;

export interface TextErrors {
  part: TextPart;
  rule: string;
  fixedText: string | null;
}