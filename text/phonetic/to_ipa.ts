import { tokenize } from "../tokenize.ts";
import { TOKEN_PUNCTUATION, TOKEN_TEXT } from "../tokenize.ts";
import { to_ipa as word_to_ipa, SPANISH_STANDARD } from "../../word/phonetic/to_ipa.ts"

export function to_ipa(
  sentence: string,
  options: { target: string } = { target: "es-ES" },
): string {
  // console.log(`\n${sentence}\n`);
  
  const tokens = tokenize(sentence)

  let text = ""
  for (let i = 0; i < tokens.length; ++i) {
    const token = tokens[i];
    switch (token.type) {
      case TOKEN_PUNCTUATION:
        switch (token.punctuation) {
          case ".":
            text += "‖";
            break;
          case " ":
          case ",":
          case ";":
          case ":":
            text += ".";
          default:
            console.warn(`ignore punctuation: ${token.punctuation}`)
        }

        break;
        case TOKEN_TEXT:
          text += word_to_ipa(token.text, SPANISH_STANDARD)
          break;
          default:
            throw new Error("unreacheable")
    }
  }

  return text;
}