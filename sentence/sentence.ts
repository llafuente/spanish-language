import { Sentence, SentenceError } from "./types.ts";
import { ABBREVIATIONS } from "./config.ts";

/**
 * Returns the expected close character, if not open exclamations or question, it will be dot.
 * Supports malformated sentence texts
 * @param sentence_text string
 * @returns string
 */
export function get_expected_close_character(
  sentence_text: string,
): string {
  const openQuestionMarks =
    (sentence_text.match(new RegExp("¿", "g")) || []).length;
  const closeQuestionMarks =
    (sentence_text.match(new RegExp("\\?", "g")) || []).length;
  const openExclamationMarks =
    (sentence_text.match(new RegExp("¡", "g")) || []).length;
  const closeExclamationMarks =
    (sentence_text.match(new RegExp("\\!", "g")) || []).length;
  let closeChar = ".";
  if (openQuestionMarks != closeQuestionMarks) {
    closeChar = "?";
  }
  if (openExclamationMarks != closeExclamationMarks) {
    closeChar = "!";
  }
  return closeChar;
}

/**
 * Analyzes a sentence and returns a list of errors
 * @param sentences
 * @param spelling boolean not used atm
 * @param grammar boolean not used atm
 * @returns
 */
export function get_errors(
  sentence: Sentence,
  spelling: boolean = true,
  grammar: boolean = true,
  isFirstSentence: boolean = true,
): SentenceError[] {
  const output: SentenceError[] = [];

  if (!sentence.text.length || sentence.text.length == 1) {
    output.push({
      where: sentence,
      rule: "empty/incomplete sentence",
      type: "error",
      fix: null,
    });
    return output;
  }

  const firstChar = sentence.text[0];
  const sencondChar = sentence.text[1];
  const lastChar = sentence.text[sentence.text.length - 1];

  if (isFirstSentence) {
    if (firstChar == "¡" || firstChar == "¿") {
      if (!sencondChar.match(/[A-Z0-9¿¡]/)) {
        output.push({
          where: sentence,
          rule:
            "sentence shall start with uppercased character, number, question or exclamations marks.",
          type: "error",
          fix: sentence.text[0] + sentence.text[1].toUpperCase() +
            sentence.text.substring(2),
        });
      }
    } else {
      if (!firstChar.match(/[A-Z0-9¿¡]/)) {
        output.push({
          where: sentence,
          rule:
            "sentence shall start with uppercased character, number, question or exclamations marks.",
          type: "error",
          fix: sentence.text[0].toUpperCase() + sentence.text.substring(1),
        });
      }
    }
  } else {
    if (firstChar != " ") {
      output.push({
        where: sentence,
        rule: "A sentence shall start with space",
        type: "error",
        fix: " " + sentence.text,
      });
      return output; // it could contains more, but recheck is costly
    }

    if (sencondChar == "¿" || sencondChar == "¡") {
      if (sentence.text.length == 2) {
        output.push({
          where: sentence,
          rule: "incomplete sentence.",
          type: "error",
          fix: null,
        });
        return output;
      }
      if (!sentence.text[2].match(/[A-Z0-9¿¡]/)) {
        output.push({
          where: sentence,
          rule:
            "sentence shall start with uppercased character, number, question or exclamations marks.",
          type: "error",
          fix: sentence.text[0] + sentence.text[1] +
            sentence.text[2].toUpperCase() +
            sentence.text.substring(3),
        });
      }
    } else {
      if (!sencondChar.match(/[A-Z0-9¿¡]/)) {
        output.push({
          where: sentence,
          rule:
            "sentence shall start with uppercased character, number, question or exclamations marks.",
          type: "error",
          fix: sentence.text[0] + sentence.text[1].toUpperCase() +
            sentence.text.substring(2),
        });
      }
    }
  }

  if (!lastChar.match(/[?!.…:]/)) {
    output.push({
      where: sentence,
      rule:
        "sentence shall end with dot, three dots, colon, question or exclamations marks.",
      type: "error",
      fix: sentence.text +
        get_expected_close_character(sentence.text),
    });
  }

  return output;
}
