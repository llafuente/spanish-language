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
  DIPTONGO_CREDIENTE,
  DIPTONGO_DECREDIENTE,
  DIPTONGO_HOMOGENEO,
  HIATO_ACENTUAL,
  HIATO_SIMPLE_TYPE_1,
  HIATO_SIMPLE_TYPE_2,
  syllabify,
} from "../syllabify/syllabify.ts";

import { remove_accents } from "../letter.ts";

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
  search: RegExp;
  replace: string;
  atIndex: number;
  previousLetter: null | string;
}

const REPLACEMENTS: Replacement[] = [
	//  ch
	{
	  search: /ch/,
	  replace: "ʧ",
	  atIndex: -1,
	  previousLetter: null,
	},
	// h
	{
	  search: /h/,
	  replace: "",
	  atIndex: -1,
	  previousLetter: null,
	},
  // 'j': 'x',

  // ð, θ, s
  {
    search: /z$/,
    replace: "ð",
    atIndex: -1,
    previousLetter: null,
  },
  {
    search: /z/,
    replace: "θ",
    atIndex: -1,
    previousLetter: null,
  },
  {
    search: /c([ei])/,
    replace: "θ$1",
    atIndex: -1,
    previousLetter: null,
  },
  // NOTE! replacement is in order
  {
    search: /c/,
    replace: "k",
    atIndex: -1,
    previousLetter: null,
  },
  // 
  {
    search: /qu([ei])/,
    replace: "k$1",
    atIndex: -1,
    previousLetter: null,
  },
  // ñ
  {
    search: /ñ/,
    replace: "ɲ",
    atIndex: -1,
    previousLetter: null,
  },

  // rr digraph
  {
    search: /rr/,
    replace: "ɾ̄",
    atIndex: -1,
    previousLetter: null,
  },
  // r after n
  {
    //search: /j([^aeoiuy])/,
    search: /^r/,
    replace: "ɾ̄", // spain
    atIndex: -1,
    previousLetter: "n",
  },
  // r after l
  {
    //search: /j([^aeoiuy])/,
    search: /^r/,
    replace: "ɾ̄", // spain
    atIndex: -1,
    previousLetter: "l",
  },
  // r after s
  {
    search: /^r/,
    replace: "ɾ̄", // spain
    atIndex: -1,
    previousLetter: "s",
  },
  // r - at start
  {
    search: /r([aeoiuy])/,
    replace: "ɾ̄$1", // spain
    atIndex: 0,
    previousLetter: null,
  },
  // r - single r
  {
    search: /r/,
    replace: "ɾ", // spain
    atIndex: -1,
    previousLetter: null,
  },

  // y as last letter
  {
    search: /y$/,
    replace: "i", // spain
    atIndex: -1,
    previousLetter: null,
  },

  // b at start
  // β in the middle
  {
    search: /b/,
    replace: "β",
    atIndex: -1,
    previousLetter: null,
  },
  {
    search: /v/,
    replace: "β",
    atIndex: -1,
    previousLetter: null,
  },
  {
    search: /β/,
    replace: "b",
    atIndex: 0,
    previousLetter: null,
  },
  {
    search: /β/,
    replace: "b",
    atIndex: 0,
    previousLetter: null,
  },  
  
  
/*
  // d
  {
    search: /d/,
    replace: "ð",
    atIndex: -1,
    previousLetter: null,
  },
*/

  // ll, y
  {
    search: /y/,
    replace: "ʝ",
    atIndex: -1,
    previousLetter: null,
  },
  {
    search: /ll/,
    replace: "ʝ",
    atIndex: -1,
    previousLetter: null,
  },
];

// once one it's applied we stop!
const EXCLUSIVE_REPLACEMENTS: Replacement[] = [
  // j / g / gu
  {
    search: /gü([ei])/,
    replace: "gu$1",
    atIndex: -1,
    previousLetter: null,
  },
  {
    search: /w/,
    replace: "gu",
    atIndex: -1,
    previousLetter: null,
  },
  {
    // search: /gu([ei])/,
    search: /gu([ei])/,
    replace: "g$1",
    atIndex: -1,
    previousLetter: null,
  },
  {
    //search: /j([^aeoiuy])/,
    search: /j/,
    replace: "x", // χ spain
    atIndex: -1,
    previousLetter: null,
  },
  {
    search: /g([ei])/,
    replace: "x$1",
    atIndex: -1,
    previousLetter: null,
  },
  {
    search: /g/,
    replace: "ɣ",
    atIndex: -1,
    previousLetter: null,
  },
  
];

function apply_replacement(
  text: string,
  replacement: Replacement,
): [string, boolean] {
  let done = false;
  let m;
  do {
    m = text.match(replacement.search);
    if (m != null && m.input) {
      console.log(m, replacement);
      text = m.input.replace(
        m[0],
        replacement.replace.replace("$1", m[1]),
      );
      console.log("modified: ", text);
      done = true;
      //break
    }
  } while (m != null);

  return [text, done];
}

const DIPHTHONGS: { [key: string]: string } = {
  /*
  "ia": "ja",
  "ie": "je",
  "ii": "ji",
  "io": "jo",
  "iu": "ju",
  */

  // diptongos crecientes
  "ia": "i̯a", // ja
  "ie": "i̯e", // je
  "io": "i̯o", // jo
  "ue": "u̯e",
  "ua": "u̯a",
  "uo": "u̯o",

  // diptongos decrecientes
  "ei": "ei̯",
  "ey": "ei̯",
  "ai": "ai̯",
  "ay": "ai̯",
  "oi": "oi̯",
  "oy": "oi̯",
  "eu": "eu̯",
  "au": "au̯",
  "ou": "ou̯",
  // diptongos acrecientes
  "iu": "i̯u", // ju
  "ui": "u̯i", // wi
  "uy": "ui̯",
};

export function get_ipa(sentence: string, options: {target: string} = {target: "spain"}): string {
  const syllables = syllabify(sentence);
  console.log(syllables);

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

    console.debug("REPLACEMENTS");
    for (let j = 0; j < REPLACEMENTS.length; ++j) {
      const r = REPLACEMENTS[j];
      const appyRule = (r.atIndex === i || r.atIndex === -1) &&
        (r.previousLetter === lastLetter || r.previousLetter === null);
      // console.log(t, lastLetter, j, r, appyRule);
      if (appyRule) {
        // deprecated, do not handle multiple ocurrences, and do not log replacements :D
        // t = t.replace(REPLACEMENTS[j].search, REPLACEMENTS[j].replace);
        /*
        let m;
        do {
          m = t.match(REPLACEMENTS[j].search);
          if (m != null && m.input) {
            console.log(t, lastLetter, j, r);
            console.log(m);
            t = m.input.replace(
              m[0],
              REPLACEMENTS[j].replace.replace("$1", m[1]),
            );
            console.log("modified: ", t);
            //break
          }
        } while (m != null);
		*/
        let done;
        [t, done] = apply_replacement(t, REPLACEMENTS[j]);
      }
    }
    console.log("EXCLUSIVE_REPLACEMENTS");
    for (let j = 0; j < EXCLUSIVE_REPLACEMENTS.length; ++j) {
      const r = EXCLUSIVE_REPLACEMENTS[j];
      const appyRule = (r.atIndex === i || r.atIndex === -1) &&
        (r.previousLetter === lastLetter || r.previousLetter === null);
      if (appyRule) {
        let done;
        [t, done] = apply_replacement(t, r);
        if (done) {
          console.log("exclusive break!");
          break;
        }
      }
    }

    switch (syllable.phonology?.type) {
      case DIPTONGO_DECREDIENTE:
      case DIPTONGO_CREDIENTE:
      case DIPTONGO_HOMOGENEO:
        if (!DIPHTHONGS[syllable.phonology.syllable]) {
          throw new Error(
            "missing diphthong: " + syllable.phonology.syllable,
          );
        }
        t = t.replace(
          syllable.phonology.syllable,
          DIPHTHONGS[syllable.phonology.syllable],
        );
        console.log("replacement: ", DIPHTHONGS[syllable.phonology.syllable]);
    }

    ipa.push(t);
    lastLetter = t[t.length - 1];
    /*
	switch (syllable.phonology?.type) {
	case HIATO_SIMPLE_TYPE_1:
	case HIATO_SIMPLE_TYPE_2:
	case HIATO_ACENTUAL:
	}
	*/
    ipa.push(".");
  }
  ipa.pop();

  return ipa.join("");
}
