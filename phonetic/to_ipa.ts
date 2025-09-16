// https://www.spanphon.jvcasillas.com/slides/02_silaba_diptongos_hiatos/index.html#63
// https://es.wikipedia.org/wiki/Transcripci%C3%B3n_fon%C3%A9tica_del_espa%C3%B1ol_con_el_Alfabeto_Fon%C3%A9tico_Internacional
// https://www.rae.es/dpd/ayuda/representacion-de-sonidos
// https://www.cambridge.org/core/services/aop-cambridge-core/content/view/39B1C556856D62AF8FC53D3F22435750/S0025100303001373a.pdf/castilian_spanish.pdf
// https://api.pageplace.de/preview/DT0400.9781107595446_A23761744/preview-9781107595446_A23761744.pdf

// utils

// text to ipa
// https://translatormind.com/translator-tool/spanish-ipa-translator/

// ipa to speech
// miss some letters mr google-amazon!
// https://www.capyschool.com/en/reader

import {
  DIPHTHONG_CRESCENT,
  DIPHTHONG_DESCENDING,
  DIPHTHONG_HOMOGENEOUS,
  PHONOLOGY_TYPE,
  syllabify,
} from "../syllabify/syllabify.ts";

import { remove_accents } from "../letter.ts";
import { first } from "https://esm.sh/cheerio@1.0.0/dist/esm/api/traversing.d.ts";

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
  phonologyType?: PHONOLOGY_TYPE,
  once?: boolean
}

interface Dialect {
  // replace all
  allOf: Replacement[];
  // replace each group until one match
  firstOf: Replacement[][];
}

const SPANISH_BASE: Dialect = {
  allOf: [
    //  ch
    {
      id: "ch",
      search: /ch/,
      replace: "ʧ",
      atIndex: -1,
      previousLetter: null,
    },
    // h
    {
      id: "h-muted",
      search: /h/,
      replace: "",
      atIndex: -1,
      previousLetter: null,
    },
    // 'j': 'x',

    // ð, θ, s
    {
      id: "z-at-start",
      search: /z$/,
      replace: "ð",
      atIndex: -1,
      previousLetter: null,
    },
    {
      id: "z-in-middle",
      search: /z/,
      replace: "θ",
      atIndex: -1,
      previousLetter: null,
    },
    {
      id: "ce-ci",
      search: /c([ei])/,
      replace: "θ$1",
      atIndex: -1,
      previousLetter: null,
    },
    {
      id: "c",
      search: /c/,
      replace: "k",
      atIndex: -1,
      previousLetter: null,
    },
    {
      id: "que-qui",
      search: /qu([ei])/,
      replace: "k$1",
      atIndex: -1,
      previousLetter: null,
    },
    // ñ
    {
      id: "ñ",
      search: /ñ/,
      replace: "ɲ",
      atIndex: -1,
      previousLetter: null,
    },
    // rr digraph
    {
      id: "rr",
      search: /rr/,
      replace: "ɾ̄",
      atIndex: -1,
      previousLetter: null,
    },
    {
      id: "r-after-n",
      search: /^r/,
      replace: "ɾ̄", // spain
      atIndex: -1,
      previousLetter: "n",
    },
    {
      id: "r-after-l",
      search: /^r/,
      replace: "ɾ̄", // spain
      atIndex: -1,
      previousLetter: "l",
    },
    {
      id: "r-after-s",
      search: /^r/,
      replace: "ɾ̄", // spain
      atIndex: -1,
      previousLetter: "s",
    },
    // r - at start
    {
      id: "r-at-start",
      search: /r([aeoiuy])/,
      replace: "ɾ̄$1", // spain
      atIndex: 0,
      previousLetter: null,
    },
    // r - single r
    {
      id: "r",
      search: /r/,
      replace: "ɾ", // spain
      atIndex: -1,
      previousLetter: null,
    },

    // y as last letter
    {
      id: "y-last",
      search: /y$/,
      replace: "i", // spain
      atIndex: -1,
      previousLetter: null,
    },

    // b at start
    // β in the middle
    {
      id: "b-in-middle",
      search: /b/,
      replace: "β",
      atIndex: -1,
      previousLetter: null,
    },
    {
      id: "v-in-middle",
      search: /v/,
      replace: "β",
      atIndex: -1,
      previousLetter: null,
    },
    {
      id: "bv-at-start",
      search: /β/,
      replace: "b",
      atIndex: 0,
      previousLetter: null,
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
    },
    {
      id: "ll",
      search: /ll/,
      replace: "ʝ",
      atIndex: -1,
      previousLetter: null,
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
    },
    {
      id: "w",
      search: /w/,
      replace: "gu",
      atIndex: -1,
      previousLetter: null,
    },
    {
      id: "gue-gui",
      search: /gu([ei])/,
      replace: "g$1",
      atIndex: -1,
      previousLetter: null,
    },
    {
      id: "j",
      search: /j/,
      replace: "x", // χ spain
      atIndex: -1,
      previousLetter: null,
    },
    {
      id: "ge-gi",
      search: /g([ei])/,
      replace: "x$1",
      atIndex: -1,
      previousLetter: null,
    },
    {
      id: "g",
      search: /g/,
      replace: "ɣ",
      atIndex: -1,
      previousLetter: null,
    },
  ],[
    // diphthongs
    {
      id: "ia-diphthong",
      search: /ia/,
      replace: "i̯a", // ja
      atIndex: -1,
      previousLetter: null,
      phonologyType: DIPHTHONG_CRESCENT,
      once: true,
    },

    {
      id: "ia-diphthong",
      search: /ia/,
      replace: "i̯a", // ja
      atIndex: -1,
      previousLetter: null,
      phonologyType: DIPHTHONG_CRESCENT,
      once: true,
    },
    {
      id: "ie-diphthong",
      search: /ie/,
      replace: "i̯e", // je
      atIndex: -1,
      previousLetter: null,
      phonologyType: DIPHTHONG_CRESCENT,
      once: true,
    },
    {
      id: "io-diphthong",
      search: /io/,
      replace: "i̯o", // jo
      atIndex: -1,
      previousLetter: null,
      phonologyType: DIPHTHONG_CRESCENT,
      once: true,
    },
    {
      id: "ue-diphthong",
      search: /ue/,
      replace: "u̯e",
      atIndex: -1,
      previousLetter: null,
      phonologyType: DIPHTHONG_CRESCENT,
      once: true,
    },
    {
      id: "ua-diphthong",
      search: /ua/,
      replace: "u̯a",
      atIndex: -1,
      previousLetter: null,
      phonologyType: DIPHTHONG_CRESCENT,
      once: true,
    },
    {
      id: "uo-diphthong",
      search: /uo/,
      replace: "u̯o",
      atIndex: -1,
      previousLetter: null,
      phonologyType: DIPHTHONG_CRESCENT,
      once: true,
    },

    // diptongos decrecientes
    {
      id: "ei-diphthong",
      search: /ei/,
      replace: "ei̯",
      atIndex: -1,
      previousLetter: null,
      phonologyType: DIPHTHONG_DESCENDING,
      once: true,
    },
    {
      id: "ey-diphthong",
      search: /ey/,
      replace: "ei̯",
      atIndex: -1,
      previousLetter: null,
      phonologyType: DIPHTHONG_DESCENDING,
      once: true,
    },
    {
      id: "ai-diphthong",
      search: /ai/,
      replace: "ai̯",
      atIndex: -1,
      previousLetter: null,
      phonologyType: DIPHTHONG_DESCENDING,
      once: true,
    },
    {
      id: "ay-diphthong",
      search: /ay/,
      replace: "ai̯",
      atIndex: -1,
      previousLetter: null,
      phonologyType: DIPHTHONG_DESCENDING,
      once: true,
    },
    {
      id: "oi-diphthong",
      search: /oi/,
      replace: "oi̯",
      atIndex: -1,
      previousLetter: null,
      phonologyType: DIPHTHONG_DESCENDING,
      once: true,
    },
    {
      id: "oy-diphthong",
      search: /oy/,
      replace: "oi̯",
      atIndex: -1,
      previousLetter: null,
      phonologyType: DIPHTHONG_DESCENDING,
      once: true,
    },
    {
      id: "eu-diphthong",
      search: /eu/,
      replace: "eu̯",
      atIndex: -1,
      previousLetter: null,
      phonologyType: DIPHTHONG_DESCENDING,
      once: true,
    },
    {
      id: "au-diphthong",
      search: /au/,
      replace: "au̯",
      atIndex: -1,
      previousLetter: null,
      phonologyType: DIPHTHONG_DESCENDING,
      once: true,
    },
    {
      id: "ou-diphthong",
      search: /ou/,
      replace: "ou̯",
      atIndex: -1,
      previousLetter: null,
      phonologyType: DIPHTHONG_DESCENDING,
      once: true,
    },
    // diptongos acrecientes
    {
      id: "iu-diphthong",
      search: /iu/,
      replace: "i̯u", // ju
      atIndex: -1,
      previousLetter: null,
      phonologyType: DIPHTHONG_HOMOGENEOUS,
      once: true,
    },
    {
      id: "ui-diphthong",
      search: /ui/,
      replace: "u̯i", // wi
      atIndex: -1,
      previousLetter: null,
      phonologyType: DIPHTHONG_HOMOGENEOUS,
      once: true,
    },
    {
      id: "uy-diphthong",
      search: /uy/,
      replace: "ui̯",
      atIndex: -1,
      previousLetter: null,
      phonologyType: DIPHTHONG_HOMOGENEOUS,
      once: true,
    },
  ]],
};

const SPANISH = {
  "es-ES": SPANISH_BASE,
};

function apply_replacement(
  text: string,
  replacement: Replacement,
): [string, boolean] {
  let done = false;
  let m;
  do {
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
        break
      }
    }
  } while (m != null);

  return [text, done];
}

export function to_ipa(
  sentence: string,
  options: { target: string } = { target: "es-ES" },
): string {
  const syllables = syllabify(sentence);
  // console.debug(syllables);

  const dialect: Dialect = (SPANISH as any)[options.target];

  const ipa: string[] = [];
  let lastLetter: string | null = null;
  for (let i = 0; i < syllables.syllables.length; ++i) {
    const syllable = syllables.syllables[i];

    let t = syllable.text;
    t = remove_accents(t);

    // x, replacement need to operate over the previous text, so do it manually without a regex
    // and before "stress"
    const c = t.indexOf("x");
    // console.debug("x!", c, i);
    if (c == 0) {
      if (i > 0) {
        // console.debug("???", ipa)
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

    for (let j = 0; j < dialect.firstOf.length; ++j) {
      const group = dialect.firstOf[j];
      for (let z = 0; z < group.length; ++z) {
        const r = group[z];

        const appyRule = (r.atIndex === i || r.atIndex === -1) &&
          (r.previousLetter === lastLetter || r.previousLetter === null) &&
          (!r.phonologyType || r.phonologyType === syllable.phonology?.type);
        if (appyRule) {
          let done;
          [t, done] = apply_replacement(t, r);
          if (done) {
            // console.log("exclusive break!");
            break;
          }
        }
      }
    }

    for (let j = 0; j < dialect.allOf.length; ++j) {
      const r = dialect.allOf[j];
        const appyRule = (r.atIndex === i || r.atIndex === -1) &&
          (r.previousLetter === lastLetter || r.previousLetter === null) &&
          (!r.phonologyType || r.phonologyType === syllable.phonology?.type);
      if (appyRule) {
        let done;
        [t, done] = apply_replacement(t, r);
      }
    }

    ipa.push(t);
    lastLetter = t[t.length - 1];
    ipa.push(".");
  }
  ipa.pop();

  return ipa.join("");
}
