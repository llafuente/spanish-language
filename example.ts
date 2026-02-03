import { assertEquals } from "jsr:@std/assert";
import { to_plural } from "./word/plural/to_plural.ts";

// single plural example
assertEquals(to_plural("casa"), ["casas"]);
// multiple plurals example
assertEquals(to_plural("bisturí"), ["bisturís", "bisturíes"]);

import { syllabify } from "./word/syllabify/syllabify.ts";
// syllabify a word gives detailed metadata to work
assertEquals(syllabify("ciudad"), {
  word: "ciudad",
  syllables: [
    {
      idx: 0,
      phonology: { type: "Diptongo Homogéneo", syllable: "iu" },
      text: "ciu"
    },
    { idx: 3, phonology: null, text: "dad" }
  ],
  stressedSyllableIdx: 2,
  accentedLetterIdx: -1,
  accentuation: "AGUDA"
});

import {
  SPANISH_STANDARD,
  to_ipa as word_to_ipa,
} from "./word/phonetic/to_ipa.ts";
// to_ipa support custom dialecs
assertEquals(word_to_ipa(`ninguno`, SPANISH_STANDARD), `nin.ˈɣu.no`);


import { to_ipa } from "./text/phonetic/to_ipa.ts";
// to_ipa can be used at text level.
assertEquals(
  to_ipa(`Un ejemplo y ninguno más.`),
  `ˈun.e.ˈxem.plo.ˈi.nin.ˈɣu.no.ˈmas‖`,
);


import { parse_text, get_errors, fix_text } from "./text/text.ts";
// there is an error in this text
const text = `—Cierra la puerta. —Las palabras eran una súplica, no una orden.
—Cierra la puerta. —Dijo pepe.`;

const paragraphs = parse_text(text);
// text is fixed!, remember that not all errors can be "autofix"
assertEquals(fix_text(text), `—Cierra la puerta. —Las palabras eran una súplica, no una orden.
—Cierra la puerta. —dijo pepe.`);