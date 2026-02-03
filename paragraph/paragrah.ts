import { get_errors as get_sentece_errors } from "../sentence/sentence.ts";
import { Sentence, SentenceError } from "../sentence/types.ts";

interface Paragraph {
  sentences: Sentence[];
}

/**
 * Anything that do not contains new lines
 * @param paragraph
 * @returns
 */
export function is_paragraph(paragraph: string) {
  return paragraph.indexOf("\n") == -1;
}

/**
 * Splits a single paragraph into sentences
 * Has a limitation support for abbreviations. Push to ABBREVIATIONS if you need a specific one.
 * @param paragraph_text
 * @returns
 */
export function parse_paragraph(paragraph_text: string): Paragraph {
  // console.log("split", paragraph);

  if (paragraph_text.indexOf("\n") > 0) {
    throw Error("paragraph contains new lines ence is a text, use parse_text");
  }

  let size = 0;

  const matches = paragraph_text.split(
    /(?<!\b(Sr\.|Sra\.|Srta\.|Dr\.|Dra\.|Ud\.|Uds\.|etc\.|p\.ej\.|aprox\.))(?<=(?:\.|…|\?|\!))/gi,
  ).filter((x) => !!x);

  //console.log(matches)

  // first pass for three dots
  let dot_count = 0;
  for (let i = 0; i < matches.length; ++i) {
    // start!
    if (matches[i].length > 1 && matches[i][matches[i].length - 1] == ".") {
      dot_count = 1;
    }
    if (matches[i].length == 1 && matches[i] == ".") {
      dot_count += 1;
    }

    if (dot_count == 3) {
      matches[i - 2] += "..";
      matches.splice(i - 1, 2);
      i -= 2;
    }
  }
  //console.log(matches)

  return {
    sentences: matches.map((text) => {
      //console.log(text)
      const column = size + 1;
      size += text.length;
      return {
        text,
        location: {
          column,
        },
      };
    }),
  };
}

/**
 * Transforms a paragraph back to text
 * @param sentences
 * @returns
 */
export function to_paragraph_text(paragraph: Paragraph): string {
  const t: string[] = [];

  for (let i = 0; i < paragraph.sentences.length; ++i) {
    const sentence = paragraph.sentences[i];
    t.push(sentence.text);
  }

  return t.join("");
}

/**
 * Fix paragraph erros
 */
export function fix_paragraph_text(
  text: string,
  spelling: boolean = true,
  grammar: boolean = true,
): string {
  let can_fix_more = true;
  let MAX_ITERATIONS = 10;
  do {
    const paragraph = parse_paragraph(text);
    const errors = get_errors(paragraph, spelling, grammar);

    can_fix_more = false;
    for (let i = 0; i < errors.length; ++i) {
      const err = errors[i];
      if (err.fix != null) {
        can_fix_more = true;
        const p = err.where as any;
        p.text = err.fix;
      }
    }
    text = to_paragraph_text(paragraph);
    // deno-coverage-ignore-start it's just a precaution
    if (--MAX_ITERATIONS == 0) {
      console.warn("exit by max iterations");
      break;
    }
    // deno-coverage-ignore-stop
  } while (can_fix_more);

  return text;
}

/**
 * Fix paragraph erros
 */
export function fix_paragraph(
  paragraph: Paragraph,
  spelling: boolean = true,
  grammar: boolean = true,
): Paragraph {
  let can_fix_more = true;
  let MAX_ITERATIONS = 10;
  do {
    const errors = get_errors(paragraph, spelling, grammar);

    can_fix_more = false;
    for (let i = 0; i < errors.length; ++i) {
      const err = errors[i];
      if (err.fix != null) {
        can_fix_more = true;
        const p = err.where as any;
        p.text = err.fix;
      }
    }
    // this is necesary as we fix each sentence a new sentence can appear
    paragraph = parse_paragraph(to_paragraph_text(paragraph));
    // deno-coverage-ignore-start it's just a precaution
    if (--MAX_ITERATIONS == 0) {
      console.warn("exit by max iterations");
      break;
    }
    // deno-coverage-ignore-stop
  } while (can_fix_more);

  return paragraph;
}

/**
 * Analyzes a sentence and returns a list of errors
 * @param sentences
 * @param spelling boolean not used atm
 * @param grammar boolean not used atm
 * @returns
 */
export function get_errors(
  paragraph: Paragraph,
  spelling: boolean = true,
  grammar: boolean = true,
): SentenceError[] {
  const output: SentenceError[] = [];

  for (let i = 0; i < paragraph.sentences.length; ++i) {
    const sentence = paragraph.sentences[i];

    // concat sentence errors
    get_sentece_errors(sentence, spelling, grammar, i == 0).forEach((err) => {
      output.push(err);
    });
  }

  return output;
}
