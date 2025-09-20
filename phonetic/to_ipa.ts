import {
  DIPHTHONG_CRESCENT,
  DIPHTHONG_DESCENDING,
  DIPHTHONG_HOMOGENEOUS,
  PHONOLOGY_TYPE,
  syllabify,
} from "../syllabify/syllabify.ts";

import { remove_accents } from "../letter.ts";
import { TOKEN_PUNCTUATION, TOKEN_TEXT, tokenize } from "../text/tokenize.ts";

const es_to_ipa = {
  "([mn])[bv]": "$1b",
  "^[bv]": "b",
  "[bv]": "β",
  "c([ei])": "s$1",
  "ch": "tʃ",
  "c": "k",
  "^d": "d",
  "d([ln])": "d",
  "d": "ð",
  // 'f': 'f',
  "(^|n)gu([ao])": "$1ɡw$2",
  "gu([ao])": "ɣw$2",
  "(^|n)gu([ei])?": "$1ɡ$2",
  "gu([ei])": "ɣ$1",
  "(^|n)gü([ei])?": "$1ɡw$2",
  "gü([ei])": "ɣw$1",
  "g([ei])": "x$1",
  "(^|n)g([^ei])?": "$1ɡ$2",
  "g([^ei])?": "ɣ$1",
  "sh": "ʃ",
  "hu([aeoiuy])": "w$1",
  "hi([aeoiuy])": "j$1",
  "h": "",
  "j": "x",
  // 'k': 'k',
  "ll": "ʎ",
  // 'l': 'l',
  "m$": "n",
  // 'm': 'm',
  "n([^aeoiuy])": "ŋ$1",
  // 'n': 'n',
  "ñ": "ɲ",
  // 'p': 'p',
  "qu([ei])": "k$1",
  "([aeoiuy])rr([aeoiuy])": "$1r$2",
  "^r": "r",
  "r([lns])": "r$1",
  "rr": "r",
  "r": "ɾ",
  "s([^aeoiuy])": "z",
  // 's': 's',
  "t[xz]": "tʃ",
  // 't': 't',
  // 'w': 'w',
  "([aeoiuy])x([aeoiuy])": "$1ks$2",
  "([^aeoiuy])x([^aeoiuy])": "$1s$2",
  "x": "ks",
  "y": "i",
  "z": "s",
  // 'a': 'a',
  // 'e': 'e',
  // 'i': 'i',
  // 'o': 'o',
  // 'u': 'u'
};

interface Replacement {
  id: string;
  search: RegExp;
  replace: string;
  atIndex: number;
  previousLetter: null | string;
  phonologyType?: PHONOLOGY_TYPE;
  once?: boolean;
  round: number;
}

interface Dialect {
  // replace all
  allOf: Replacement[];
  // replace each group until one match
  firstOf: Replacement[][];
}

const SPANISH_STANDARD: Dialect = {
  allOf: [
    //  ch
    {
      id: "ch",
      search: /ch/,
      replace: "ʧ",
      atIndex: -1,
      previousLetter: null,
      round: 0,
    },
    // h
    {
      id: "h-muted",
      search: /h/,
      replace: "",
      atIndex: -1,
      previousLetter: null,
      round: 0,
    },
    // 'j': 'x',

    // ð, θ, s
    {
      id: "z-at-start",
      search: /z$/,
      replace: "ð",
      atIndex: -1,
      previousLetter: null,
      round: 0,
    },
    {
      id: "z-in-middle",
      search: /z/,
      replace: "θ",
      atIndex: -1,
      previousLetter: null,
      round: 0,
    },
    {
      id: "ce-ci",
      search: /c([ei])/,
      replace: "θ$1",
      atIndex: -1,
      previousLetter: null,
      round: 0,
    },
    {
      id: "c",
      search: /c/,
      replace: "k",
      atIndex: -1,
      previousLetter: null,
      round: 0,
    },
    {
      id: "que",
      search: /que/,
      replace: "ke",
      atIndex: -1,
      previousLetter: null,
      round: 0,
    },
    {
      id: "qui",
      search: /qui/,
      replace: "kj", // quien -> ji
      atIndex: -1,
      previousLetter: null,
      round: 0,
    },
    // ñ
    {
      id: "ñ",
      search: /ñ/,
      replace: "ɲ",
      atIndex: -1,
      previousLetter: null,
      round: 0,
    },
    // r - single r
    {
      id: "r",
      search: /r/,
      replace: "ɾ", // spain
      atIndex: -1,
      previousLetter: null,
      round: 0,
    },
    // (ɾɾ) rr digraph
    {
      id: "rr",
      search: /ɾɾ/,
      replace: "r", // "ɾ̄",
      atIndex: -1,
      previousLetter: null,
      round: 0,
    },
    {
      id: "r-after-n",
      search: /^ɾ/,
      replace: "r", // spain
      atIndex: -1,
      previousLetter: "n",
      round: 0,
    },
    {
      id: "r-after-l",
      search: /^ɾ/,
      replace: "r", // spain
      atIndex: -1,
      previousLetter: "l",
      round: 0,
    },
    {
      id: "r-after-s",
      search: /^ɾ/,
      replace: "r", // spain
      atIndex: -1,
      previousLetter: "s",
      round: 0,
    },
    // r - at start
    {
      id: "r-at-start",
      search: /ɾ([aeoiuy])/,
      replace: "r$1", // spain
      atIndex: 0,
      previousLetter: null,
      round: 0,
    },

    // y as last letter
    {
      id: "y-last",
      search: /y$/,
      replace: "i", // spain
      atIndex: -1,
      previousLetter: null,
      round: 0,
    },

    // b at start
    // β in the middle
    {
      id: "b-in-middle",
      search: /b/,
      replace: "β",
      atIndex: -1,
      previousLetter: null,
      round: 0,
    },
    {
      id: "v-in-middle",
      search: /v/,
      replace: "β",
      atIndex: -1,
      previousLetter: null,
      round: 0,
    },
    {
      id: "bv-at-start",
      search: /β/,
      replace: "b",
      atIndex: 0,
      previousLetter: null,
      round: 0,
    },

    // https://api.pageplace.de/preview/DT0400.9781107595446_A23761744/preview-9781107595446_A23761744.pdf
    // distribución complementaria alófono d
    // d después de pausa, /l/ y /n/
    // ð en los demás contextos

    /*
  // d
  {
    id: "d-relaxed",
    search: /d/,
    replace: "ð",
    atIndex: -1,
    previousLetter: null,
  },
    */

    // ll, y
    {
      id: "y",
      search: /y/,
      replace: "ʝ",
      atIndex: -1,
      previousLetter: null,
      round: 0,
    },
    {
      id: "ll",
      search: /ll/,
      replace: "ʝ",
      atIndex: -1,
      previousLetter: null,
      round: 0,
    },
  ],
  firstOf: [[
    // j / g / gu
    {
      id: "güe-güi",
      search: /gü([ei])/,
      replace: "gu$1",
      atIndex: -1,
      previousLetter: null,
      round: 0,
    },
    {
      id: "w",
      search: /w/,
      replace: "gu",
      atIndex: -1,
      previousLetter: null,
      round: 0,
    },
    {
      id: "gue-gui",
      search: /gu([ei])/,
      replace: "g$1",
      atIndex: -1,
      previousLetter: null,
      round: 0,
    },
    {
      id: "j",
      search: /j/,
      replace: "x", // χ spain
      atIndex: -1,
      previousLetter: null,
      round: 0,
    },
    {
      id: "ge-gi",
      search: /g([ei])/,
      replace: "x$1",
      atIndex: -1,
      previousLetter: null,
      round: 0,
    },
    {
      id: "g",
      search: /g/,
      replace: "ɣ",
      atIndex: -1,
      previousLetter: null,
      round: 0,
    },
  ], [
    // diphthongs
    {
      id: "ia-diphthong",
      search: /ia/,
      replace: "ja", // "i̯a"
      atIndex: -1,
      previousLetter: null,
      phonologyType: DIPHTHONG_CRESCENT,
      once: true,
      round: 1,
    },
    {
      id: "ie-diphthong",
      search: /ie/,
      replace: "je", // "i̯e"
      atIndex: -1,
      previousLetter: null,
      phonologyType: DIPHTHONG_CRESCENT,
      once: true,
      round: 1,
    },
    {
      id: "io-diphthong",
      search: /io/,
      replace: "jo", // "i̯o",
      atIndex: -1,
      previousLetter: null,
      phonologyType: DIPHTHONG_CRESCENT,
      once: true,
      round: 1,
    },
    {
      id: "ue-diphthong",
      search: /ue/,
      replace: "we", // "u̯e",
      atIndex: -1,
      previousLetter: null,
      phonologyType: DIPHTHONG_CRESCENT,
      once: true,
      round: 1,
    },
    {
      id: "ua-diphthong",
      search: /ua/,
      replace: "wa", // "u̯a",
      atIndex: -1,
      previousLetter: null,
      phonologyType: DIPHTHONG_CRESCENT,
      once: true,
      round: 1,
    },
    {
      id: "uo-diphthong",
      search: /uo/,
      replace: "wo", // "u̯o",
      atIndex: -1,
      previousLetter: null,
      phonologyType: DIPHTHONG_CRESCENT,
      once: true,
      round: 1,
    },

    // diptongos decrecientes
    {
      id: "ei-ey-diphthong",
      search: /(ei|ey)/,
      replace: "ej", // "ei̯",
      atIndex: -1,
      previousLetter: null,
      phonologyType: DIPHTHONG_DESCENDING,
      once: true,
      round: 1,
    },
    {
      id: "ai-ay-diphthong",
      search: /(ai|ay)/,
      replace: "aj", // "ai̯",
      atIndex: -1,
      previousLetter: null,
      phonologyType: DIPHTHONG_DESCENDING,
      once: true,
      round: 1,
    },
    {
      id: "oi-oy-diphthong",
      search: /(oi|oy)/,
      replace: "oj", // "oi̯",
      atIndex: -1,
      previousLetter: null,
      phonologyType: DIPHTHONG_DESCENDING,
      once: true,
      round: 1,
    },
    {
      id: "eu-au-ou-diphthong",
      search: /(e|a|o)u/,
      replace: "$1w", //  "$1u̯",
      atIndex: -1,
      previousLetter: null,
      phonologyType: DIPHTHONG_DESCENDING,
      once: true,
      round: 1,
    },
    // diptongos acrecientes
    {
      id: "iu-diphthong",
      search: /iu/,
      replace: "ju", // "i̯u",
      atIndex: -1,
      previousLetter: null,
      phonologyType: DIPHTHONG_HOMOGENEOUS,
      once: true,
      round: 1,
    },
    {
      id: "ui-diphthong",
      search: /(ui|uy)/,
      replace: "wi", //  "u̯i",
      atIndex: -1,
      previousLetter: null,
      phonologyType: DIPHTHONG_HOMOGENEOUS,
      once: true,
      round: 1,
    },
  ]],
};

const SPANISH = {
  "es-ES": SPANISH_STANDARD,
};

function apply_replacement(
  text: string,
  replacement: Replacement,
): [string, boolean] {
  let done = false;
  let m;
  do {
    // console.log(text, replacement.search);
    m = text.match(replacement.search);
    if (m != null && m.input) {
      // console.debug(m, replacement);
      text = m.input.replace(
        m[0],
        replacement.replace.replace("$1", m[1]),
      );
      // console.debug("modified: ", text);
      done = true;
      if (replacement.once) {
        break;
      }
    }
  } while (m != null);

  return [text, done];
}

// TODO
// zheísmo: ll -> [ʒ] o [dʒ]
// sheísmo: ll -> ʃ
// ceceo c -> c
// seseo c -> s

// yeismo zheísmo
// ceceo seseo
// Rehilamiento 
const TARGETS = {
  // españa
  "es-ES": ["yeismo", "ceceo"],
  // argentina
  "es-AR": ["yeismo", "seseo"],
  // https://es.wikipedia.org/wiki/Espa%C3%B1ol_rioplatense
  // argentina 2 - voseo - elisión
  // La aspiración de la sibilante ([s]) medial. erre asibilada [ʐ] (escrita ‹r› en posición inicial, ‹rr› entre vocales), que en la emisión se percibe como una suerte de silbido.
  "rioplatense": ["zheísmo", "seseo"],
  // uruguay
  "es-UY": [],
}


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


export function word_to_ipa(
  word: string,
  dialect: Dialect,
): string {  
  const syllables = syllabify(word);
  // console.debug(syllables);

  const ipa: string[] = [];
  let lastLetter: string | null = null;
  for (let i = 0; i < syllables.syllables.length; ++i) {
    const syllable = syllables.syllables[i];
    // console.log(syllable)

    let t = syllable.text;
    t = remove_accents(t);

    // x, replacement need to operate over the previous text, so do it manually without a regex
    // and before "stress"
    const c = t.indexOf("x");
    // console.debug("  x!", c, i);
    if (c == 0) {
      if (i > 0) {
        // console.debug("  ???", ipa)
        ipa[ipa.length - 2] += "k";
        t = t.replace(/x/, "s");
      } else {
        t = t.replace(/x/, "ks");
      }
    } else if (c > 0) {
      t = t.replace(/x/, "ks");
    }

    if (syllables.stressedSyllableIdx - 1 == i) {
      ipa.push("ˈ");
    }

    for(let round = 0; round < 2; ++round) {
      // console.log(`  round ${round}`)
      for (let j = 0; j < dialect.firstOf.length; ++j) {
        const group = dialect.firstOf[j];
        for (let z = 0; z < group.length; ++z) {
          const r = group[z];
          
          const appyRule = r.round == round && (r.atIndex === i || r.atIndex === -1) &&
          (r.previousLetter === lastLetter || r.previousLetter === null) &&
          (!r.phonologyType || r.phonologyType === syllable.phonology?.type);
          
          // console.log(`  rule[${r.id}] ${i} ${r.previousLetter} ${appyRule}`)

          if (appyRule) {
            let done;
            [t, done] = apply_replacement(t, r);
            if (done) {
              // console.log("  exclusive break!");
              break;
            }
          }
        }
      }
  
      for (let j = 0; j < dialect.allOf.length; ++j) {
        const r = dialect.allOf[j];
        const appyRule = r.round == round && (r.atIndex === i || r.atIndex === -1) &&
          (r.previousLetter === lastLetter || r.previousLetter === null) &&
          (!r.phonologyType || r.phonologyType === syllable.phonology?.type);

        // console.log(`  rule[${r.id}] ${i} ${lastLetter} ${appyRule}`)

        if (appyRule) {
          let done;
          [t, done] = apply_replacement(t, r);
        }
      }

    }


    ipa.push(t);
    lastLetter = t[t.length - 1];
    ipa.push(".");
  }
  ipa.pop();

  return ipa.join("");
}
