import { expect } from "jsr:@std/expect";
import { assertEquals, assertThrows } from "jsr:@std/assert";
import {
  ACUTE,
  HIATO_ACENTUAL,
  HIATO_SIMPLE_TYPE_1,
  HIATO_SIMPLE_TYPE_2,
  PLAIN,
  syllabify,
  WordSyllables,
} from "./syllabify.ts";

// Hiato acentual / adiptongado
// raíz, laúd, reír, transeúnte, oír

const t: WordSyllables[] = [
  {
    word: "raíz",
    syllables: [
      {
        idx: 0,
        phonology: { type: HIATO_ACENTUAL, syllable: "a-í" },
        text: "ra",
      },
      { idx: 2, phonology: null, text: "íz" },
    ],
    stressedSyllableIdx: 2,
    accentedLetterIdx: 2,
    accentuation: ACUTE,
  },
  {
    word: "cae",
    syllables: [
      {
        idx: 0,
        phonology: { type: HIATO_SIMPLE_TYPE_1, syllable: "a-e" },
        text: "ca",
      },
      { idx: 2, phonology: null, text: "e" },
    ],
    stressedSyllableIdx: 1,
    accentedLetterIdx: -1,
    accentuation: PLAIN,
  },
  {
    word: "reo",
    syllables: [
      {
        idx: 0,
        phonology: { type: "Hiato simple tipo 1", syllable: "e-o" },
        text: "re",
      },
      { idx: 2, phonology: null, text: "o" },
    ],
    stressedSyllableIdx: 1,
    accentedLetterIdx: -1,
    accentuation: "GRAVE",
  },
  {
    word: "noé",
    syllables: [
      {
        idx: 0,
        phonology: { type: "Hiato acentual", syllable: "o-é" },
        text: "no",
      },
      { idx: 2, phonology: null, text: "é" },
    ],
    stressedSyllableIdx: 2,
    accentedLetterIdx: 2,
    accentuation: "AGUDA",
  },
  {
    word: "paseé",
    syllables: [
      { idx: 0, phonology: null, text: "pa" },
      {
        idx: 2,
        phonology: { type: "Hiato acentual", syllable: "e-é" },
        text: "se",
      },
      { idx: 4, phonology: null, text: "é" },
    ],
    stressedSyllableIdx: 3,
    accentedLetterIdx: 4,
    accentuation: "AGUDA",
  },
  {
    word: "teatro",
    syllables: [
      {
        idx: 0,
        phonology: { type: "Hiato simple tipo 1", syllable: "e-a" },
        text: "te",
      },
      { idx: 2, phonology: null, text: "a" },
      { idx: 3, phonology: null, text: "tro" },
    ],
    stressedSyllableIdx: 2,
    accentedLetterIdx: -1,
    accentuation: "GRAVE",
  },
  {
    word: "azahar",
    syllables: [
      { idx: 0, phonology: null, text: "a" },
      {
        idx: 1,
        phonology: { type: "Hiato simple tipo 1", syllable: "a-ha" },
        text: "za",
      },
      { idx: 3, phonology: null, text: "har" },
    ],
    stressedSyllableIdx: 3,
    accentedLetterIdx: -1,
    accentuation: "AGUDA",
  },
  {
    word: "cuautitlán",
    syllables: [
      {
        idx: 0,
        phonology: { type: "Triptongo", syllable: "uau" },
        text: "cuau",
      },
      { idx: 4, phonology: null, text: "ti" },
      { idx: 6, phonology: null, text: "tlán" },
    ],
    stressedSyllableIdx: 3,
    accentedLetterIdx: 8,
    accentuation: "AGUDA",
  },
  {
    word: "apreciáis",
    syllables: [
      { idx: 0, phonology: null, text: "a" },
      { idx: 1, phonology: null, text: "pre" },
      {
        idx: 4,
        phonology: { type: "Triptongo", syllable: "iái" },
        text: "ciáis",
      },
    ],
    stressedSyllableIdx: 3,
    accentedLetterIdx: 6,
    accentuation: "AGUDA",
  },
  {
    word: "bioinformática",
    syllables: [
      {
        idx: 0,
        phonology: { type: "Triptongo", syllable: "ioi" },
        text: "bioin",
      },
      { idx: 5, phonology: null, text: "for" },
      { idx: 8, phonology: null, text: "má" },
      { idx: 10, phonology: null, text: "ti" },
      { idx: 12, phonology: null, text: "ca" },
    ],
    stressedSyllableIdx: 3,
    accentedLetterIdx: 9,
    accentuation: "Esdrújula",
  },
  {
    word: "zanahoria",
    syllables: [
      { idx: 0, phonology: null, text: "za" },
      {
        idx: 2,
        phonology: { type: "Hiato simple tipo 1", syllable: "a-ho" },
        text: "na",
      },
      { idx: 4, phonology: null, text: "ho" },
      {
        idx: 6,
        phonology: { type: "Diptongo Creciente", syllable: "ia" },
        text: "ria",
      },
    ],
    stressedSyllableIdx: 3,
    accentedLetterIdx: -1,
    accentuation: "GRAVE",
  },
  {
    word: "electrodoméstico",
    syllables: [
      { idx: 0, phonology: null, text: "e" },
      { idx: 1, phonology: null, text: "lec" },
      { idx: 4, phonology: null, text: "tro" },
      { idx: 7, phonology: null, text: "do" },
      { idx: 9, phonology: null, text: "més" },
      { idx: 12, phonology: null, text: "ti" },
      { idx: 14, phonology: null, text: "co" },
    ],
    stressedSyllableIdx: 5,
    accentedLetterIdx: 10,
    accentuation: "Esdrújula",
  },
  {
    word: "loó",
    syllables: [
      {
        idx: 0,
        phonology: { type: "Hiato acentual", syllable: "o-ó" },
        text: "lo",
      },
      { idx: 2, phonology: null, text: "ó" },
    ],
    stressedSyllableIdx: 2,
    accentedLetterIdx: 2,
    accentuation: "AGUDA",
  },
  {
    word: "güey",
    syllables: [
      {
        idx: 0,
        phonology: { type: "Triptongo", syllable: "üey" },
        text: "güey",
      },
    ],
    stressedSyllableIdx: 1,
    accentedLetterIdx: -1,
    accentuation: "AGUDA",
  },
  {
    word: "riais",
    syllables: [
      {
        idx: 0,
        phonology: { type: "Triptongo", syllable: "iai" },
        text: "riais",
      },
    ],
    stressedSyllableIdx: 1,
    accentedLetterIdx: -1,
    accentuation: "AGUDA",
  },
  {
    word: "samoa",
    syllables: [
      { idx: 0, phonology: null, text: "sa" },
      {
        idx: 2,
        phonology: { type: "Hiato simple tipo 1", syllable: "o-a" },
        text: "mo",
      },
      { idx: 4, phonology: null, text: "a" },
    ],
    stressedSyllableIdx: 2,
    accentedLetterIdx: -1,
    accentuation: "GRAVE",
  },
  {
    word: "canoa",
    syllables: [
      { idx: 0, phonology: null, text: "ca" },
      {
        idx: 2,
        phonology: { type: "Hiato simple tipo 1", syllable: "o-a" },
        text: "no",
      },
      { idx: 4, phonology: null, text: "a" },
    ],
    stressedSyllableIdx: 2,
    accentedLetterIdx: -1,
    accentuation: "GRAVE",
  },
  {
    word: "feo",
    syllables: [
      {
        idx: 0,
        phonology: { type: "Hiato simple tipo 1", syllable: "e-o" },
        text: "fe",
      },
      { idx: 2, phonology: null, text: "o" },
    ],
    stressedSyllableIdx: 1,
    accentedLetterIdx: -1,
    accentuation: "GRAVE",
  },
  {
    word: "caoba",
    syllables: [
      {
        idx: 0,
        phonology: { type: "Hiato simple tipo 1", syllable: "a-o" },
        text: "ca",
      },
      { idx: 2, phonology: null, text: "o" },
      { idx: 3, phonology: null, text: "ba" },
    ],
    stressedSyllableIdx: 2,
    accentedLetterIdx: -1,
    accentuation: "GRAVE",
  },
  {
    word: "zoo",
    syllables: [
      {
        idx: 0,
        phonology: { type: "Hiato simple tipo 1", syllable: "o-o" },
        text: "zo",
      },
      { idx: 2, phonology: null, text: "o" },
    ],
    stressedSyllableIdx: 1,
    accentedLetterIdx: -1,
    accentuation: "GRAVE",
  },
  {
    word: "noúmeno",
    syllables: [
      {
        idx: 0,
        phonology: { type: "Hiato acentual", syllable: "o-ú" },
        text: "no",
      },
      { idx: 2, phonology: null, text: "ú" },
      { idx: 3, phonology: null, text: "me" },
      { idx: 5, phonology: null, text: "no" },
    ],
    stressedSyllableIdx: 2,
    accentedLetterIdx: 2,
    accentuation: "Esdrújula",
  },
  {
    word: "licúe",
    syllables: [
      { idx: 0, phonology: null, text: "li" },
      {
        idx: 2,
        phonology: { type: "Hiato acentual", syllable: "ú-e" },
        text: "cú",
      },
      { idx: 4, phonology: null, text: "e" },
    ],
    stressedSyllableIdx: 2,
    accentedLetterIdx: 3,
    accentuation: "GRAVE",
  },
  {
    word: "chiita",
    syllables: [
      {
        idx: 0,
        phonology: { type: "Hiato simple tipo 2", syllable: "i-i" },
        text: "chi",
      },
      { idx: 3, phonology: null, text: "i" },
      { idx: 4, phonology: null, text: "ta" },
    ],
    stressedSyllableIdx: 2,
    accentedLetterIdx: -1,
    accentuation: "GRAVE",
  },
  {
    word: "duunviro",
    syllables: [
      {
        idx: 0,
        phonology: { type: "Hiato simple tipo 2", syllable: "u-u" },
        text: "du",
      },
      { idx: 2, phonology: null, text: "un" },
      { idx: 4, phonology: null, text: "vi" },
      { idx: 6, phonology: null, text: "ro" },
    ],
    stressedSyllableIdx: 3,
    accentedLetterIdx: -1,
    accentuation: "GRAVE",
  },
  {
    word: "consensuéis",
    syllables: [
      { idx: 0, phonology: null, text: "con" },
      { idx: 3, phonology: null, text: "sen" },
      {
        idx: 6,
        phonology: { type: "Triptongo", syllable: "uéi" },
        text: "suéis",
      },
    ],
    stressedSyllableIdx: 3,
    accentedLetterIdx: 8,
    accentuation: "AGUDA",
  },
  {
    word: "paella",
    syllables: [
      {
        idx: 0,
        phonology: { type: "Hiato simple tipo 1", syllable: "a-e" },
        text: "pa",
      },
      { idx: 2, phonology: null, text: "e" },
      { idx: 3, phonology: null, text: "lla" },
    ],
    stressedSyllableIdx: 2,
    accentedLetterIdx: -1,
    accentuation: "GRAVE",
  },
  {
    word: "baúl",
    syllables: [
      {
        idx: 0,
        phonology: { type: "Hiato acentual", syllable: "a-ú" },
        text: "ba",
      },
      { idx: 2, phonology: null, text: "úl" },
    ],
    stressedSyllableIdx: 2,
    accentedLetterIdx: 2,
    accentuation: "AGUDA",
  },
  {
    word: "sioux",
    syllables: [
      {
        idx: 0,
        phonology: { type: "Triptongo", syllable: "iou" },
        text: "sioux",
      },
    ],
    stressedSyllableIdx: 1,
    accentedLetterIdx: -1,
    accentuation: "AGUDA",
  },
  {
    word: "despreciéis",
    syllables: [
      { idx: 0, phonology: null, text: "des" },
      { idx: 3, phonology: null, text: "pre" },
      {
        idx: 6,
        phonology: { type: "Triptongo", syllable: "iéi" },
        text: "ciéis",
      },
    ],
    stressedSyllableIdx: 3,
    accentedLetterIdx: 8,
    accentuation: "AGUDA",
  },
  {
    word: "biaural",
    syllables: [
      {
        idx: 0,
        phonology: { type: "Triptongo", syllable: "iau" },
        text: "biau",
      },
      { idx: 4, phonology: null, text: "ral" },
    ],
    stressedSyllableIdx: 2,
    accentedLetterIdx: -1,
    accentuation: "AGUDA",
  },
  {
    word: "despreciéis",
    syllables: [
      { idx: 0, phonology: null, text: "des" },
      { idx: 3, phonology: null, text: "pre" },
      {
        idx: 6,
        phonology: { type: "Triptongo", syllable: "iéi" },
        text: "ciéis",
      },
    ],
    stressedSyllableIdx: 3,
    accentedLetterIdx: 8,
    accentuation: "AGUDA",
  },
  {
    word: "lieis",
    syllables: [
      {
        idx: 0,
        phonology: { type: "Triptongo", syllable: "iei" },
        text: "lieis",
      },
    ],
    stressedSyllableIdx: 1,
    accentedLetterIdx: -1,
    accentuation: "AGUDA",
  },
  {
    word: "ruido",
    syllables: [
      {
        idx: 0,
        phonology: { type: "Diptongo Homogéneo", syllable: "ui" },
        text: "rui",
      },
      { idx: 3, phonology: null, text: "do" },
    ],
    stressedSyllableIdx: 1,
    accentedLetterIdx: -1,
    accentuation: "GRAVE",
  },
  {
    word: "europa",
    syllables: [
      {
        idx: 0,
        phonology: { type: "Diptongo Decreciente", syllable: "eu" },
        text: "eu",
      },
      { idx: 2, phonology: null, text: "ro" },
      { idx: 4, phonology: null, text: "pa" },
    ],
    stressedSyllableIdx: 2,
    accentedLetterIdx: -1,
    accentuation: "GRAVE",
  },
  {
    word: "matzah",
    syllables: [
      { idx: 0, phonology: null, text: "mat" },
      { idx: 3, phonology: null, text: "zah" },
    ],
    stressedSyllableIdx: 2,
    accentedLetterIdx: -1,
    accentuation: "AGUDA",
  },
  {
    word: "ciudad",
    syllables: [
      {
        idx: 0,
        phonology: { type: "Diptongo Homogéneo", syllable: "iu" },
        text: "ciu",
      },
      { idx: 3, phonology: null, text: "dad" },
    ],
    stressedSyllableIdx: 2,
    accentedLetterIdx: -1,
    accentuation: "AGUDA",
  },
  {
    word: "orquesta",
    syllables: [
      { idx: 0, phonology: null, text: "or" },
      { idx: 2, phonology: null, text: "ques" },
      { idx: 6, phonology: null, text: "ta" },
    ],
    stressedSyllableIdx: 2,
    accentedLetterIdx: -1,
    accentuation: "GRAVE",
  },
  {
    word: "queso",
    syllables: [
      { idx: 0, phonology: null, text: "que" },
      { idx: 3, phonology: null, text: "so" },
    ],
    stressedSyllableIdx: 1,
    accentedLetterIdx: -1,
    accentuation: "GRAVE",
  },
  {
    word: "habladuría",
    syllables: [
      { idx: 0, phonology: null, text: "ha" },
      { idx: 2, phonology: null, text: "bla" },
      { idx: 5, phonology: null, text: "du" },
      {
        idx: 7,
        phonology: { type: "Hiato acentual", syllable: "í-a" },
        text: "rí",
      },
      { idx: 9, phonology: null, text: "a" },
    ],
    stressedSyllableIdx: 4,
    accentedLetterIdx: 8,
    accentuation: "GRAVE",
  },
  {
    word: "jaén",
    syllables: [
      {
        idx: 0,
        phonology: { type: "Hiato acentual", syllable: "a-é" },
        text: "ja",
      },
      { idx: 2, phonology: null, text: "én" },
    ],
    stressedSyllableIdx: 2,
    accentedLetterIdx: 2,
    accentuation: "AGUDA",
  },
  {
    word: "himno",
    syllables: [
      { idx: 0, phonology: null, text: "him" },
      { idx: 3, phonology: null, text: "no" },
    ],
    stressedSyllableIdx: 1,
    accentedLetterIdx: -1,
    accentuation: "GRAVE",
  },

  // extrangerismos, just for testing purposes, don't expect english syllabify
  {
    word: "dirham",
    syllables: [
      { idx: 0, phonology: null, text: "dir" },
      { idx: 3, phonology: null, text: "ham" },
    ],
    stressedSyllableIdx: 2,
    accentedLetterIdx: -1,
    accentuation: "AGUDA",
  },
  {
    word: "apartheid",
    syllables: [
      { idx: 0, phonology: null, text: "a" },
      { idx: 1, phonology: null, text: "part" },
      {
        idx: 5,
        phonology: { type: "Diptongo Decreciente", syllable: "ei" },
        text: "heid",
      },
    ],
    stressedSyllableIdx: 3,
    accentedLetterIdx: -1,
    accentuation: "AGUDA",
  },
  {
    word: "ashley",
    syllables: [
      { idx: 0, phonology: null, text: "as" },
      { idx: 2, phonology: null, text: "hley" },
    ],
    stressedSyllableIdx: 1,
    accentedLetterIdx: -1,
    accentuation: "GRAVE",
  },
  {
    word: "copyright",
    syllables: [
      { idx: 0, phonology: null, text: "cop" },
      { idx: 3, phonology: null, text: "y" },
      { idx: 4, phonology: null, text: "right" },
    ],
    stressedSyllableIdx: 3,
    accentedLetterIdx: -1,
    accentuation: "AGUDA",
  },
  {
    word: "triptongo",
    syllables: [
      { idx: 0, phonology: null, text: "trip" },
      { idx: 4, phonology: null, text: "ton" },
      { idx: 7, phonology: null, text: "go" },
    ],
    stressedSyllableIdx: 2,
    accentedLetterIdx: -1,

    accentuation: "GRAVE",
  },
];

for (const x of t) {
  Deno.test(`syllable: ${x.word}`, () => {
    const result = syllabify(x.word);
    console.log(result);
    assertEquals(result, x);
  });
}

Deno.test(`syllable errors`, () => {
  assertThrows(() => {
    const result = syllabify("a x c");
  }, "a word cannot contain spaces");
  /*
  assertThrows(() => {
    const result = syllabify("aeae");
  }, "a word cannot contain spaces");
  */
  assertThrows(() => {
    const result = syllabify("xsds");
  }, "invalid word, don't have nucleus");
});

/*
Deno.test(`syllable:`, () => {
  console.log(syllable("consensuéis")); //
});


// Comisaría, Dúo, Proveer, ahínco, apogeo

// Hiato acentual
// grúa, Caída, país, alegría


// Vocal + misma vocal
// creer (cre–er)

// diptongo
// Acierto (a-cier-to)

// https://www.ejemplos.co/100-ejemplos-de-triptongo/
console.log(syllable("lieis"));

*/
