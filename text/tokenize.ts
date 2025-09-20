export const TOKEN_PUNCTUATION = "punctuation";
export const TOKEN_TEXT = "text";

interface TokenPunctuation {
  type: typeof TOKEN_PUNCTUATION;
  punctuation: string;
}

interface TokenText {
  type: typeof TOKEN_TEXT;
  text: string;
  sentenceStart?: boolean;
}
type TextTokens = TokenText | TokenPunctuation;

export function tokenize(text: string): TextTokens[] {
  const out: TextTokens[] = [];
  let acc = "";
  let sentenceStart = true;

  for (let i = 0; i < text.length; ++i) {
    switch (text[i]) {
      // https://www.rae.es/ortograf%C3%ADa/signos-de-puntuaci%C3%B3n
      case " ":
        // remove spaces after other punctuation
        if (!acc.length && out[out.length - 1]?.type == TOKEN_PUNCTUATION) {
          continue;
        }
        /* falls through */
      case ".":
        case "!":
          case "?":
      case ",":
      case ";":
      case ":":
      case "¡":
      case "¿":
      case "«":
      case "»":
      case "—":
      case "…":
        if (acc.length) {
          out.push({text: acc, sentenceStart, type: TOKEN_TEXT});
          sentenceStart = false;
        }

        if (text[i + 1] == "." && text[i + 2] == ".") {
          out.push({punctuation: "…", type: TOKEN_PUNCTUATION});
          i+=2
        } else {
          out.push({punctuation: text[i], type: TOKEN_PUNCTUATION});
        }
        acc = "";
    
        switch (text[i]) {
      case ".":
        case ":":
        case "!":
          case "?":
            sentenceStart = true;
    }
        break;
      default:
        acc += text[i];
    }
  }

  return out;
}
