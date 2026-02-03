import { assertEquals, assertThrows } from "jsr:@std/assert";
import { get_errors } from "../paragraph/paragrah.ts";
import { Sentence, SentenceError } from "./types.ts";

import {
  fix_paragraph_text,
  is_paragraph,
  parse_paragraph,
  to_paragraph_text,
  fix_paragraph,
} from "../paragraph/paragrah.ts";

Deno.test("split error", () => {
  const paragraph = `xxx\nxxx\nxxx.`;
  assertEquals(is_paragraph(paragraph), false, "is not a paragraph");

  assertThrows(() => {
    const sentences = parse_paragraph(paragraph);
  }, "paragraph containes new lines ence is a text");
});

const fixture: {
  paragraph: string;
  fix_paragraph: string | null;
  split: Sentence[];
  errors: SentenceError[];
}[] = [
  {
    paragraph:
      `texto de prueba a lo lorem ipsum. una segunda.y una tercera. ¿y una pregunta? ¡y una examación!`,
    fix_paragraph:
      "Texto de prueba a lo lorem ipsum. Una segunda. Y una tercera. ¿Y una pregunta? ¡Y una examación!",
    split: [
      {
        "text": "texto de prueba a lo lorem ipsum.",
        "location": {
          "column": 1,
        },
      },
      {
        "text": " una segunda.",
        "location": {
          "column": 34,
        },
      },
      {
        "text": "y una tercera.",
        "location": {
          "column": 47,
        },
      },
      {
        "text": " ¿y una pregunta?",
        "location": {
          "column": 61,
        },
      },
      {
        "text": " ¡y una examación!",
        "location": {
          "column": 78,
        },
      },
    ],
    errors: [
      {
        "where": {
          "text": "texto de prueba a lo lorem ipsum.",
          "location": {
            "column": 1,
          },
        },
        "rule":
          "sentence shall start with uppercased character, number, question or exclamations marks.",
        "type": "error",
        "fix": "Texto de prueba a lo lorem ipsum.",
      },
      {
        "where": {
          "text": " una segunda.",
          "location": {
            "column": 34,
          },
        },
        "rule":
          "sentence shall start with uppercased character, number, question or exclamations marks.",
        "type": "error",
        "fix": " Una segunda.",
      },
      {
        "where": {
          "text": "y una tercera.",
          "location": {
            "column": 47,
          },
        },
        "rule": "A sentence shall start with space",
        "type": "error",
        "fix": " y una tercera.",
      },
      {
        "where": {
          "text": " ¿y una pregunta?",
          "location": {
            "column": 61,
          },
        },
        "rule":
          "sentence shall start with uppercased character, number, question or exclamations marks.",
        "type": "error",
        "fix": " ¿Y una pregunta?",
      },
      {
        "where": {
          "text": " ¡y una examación!",
          "location": {
            "column": 78,
          },
        },
        "rule":
          "sentence shall start with uppercased character, number, question or exclamations marks.",
        "type": "error",
        "fix": " ¡Y una examación!",
      },
    ],
  },
  {
    paragraph: `texto inicial y a mitad ¡otro que no termina`,
    fix_paragraph: "Texto inicial y a mitad ¡otro que no termina!",
    split: [
      {
        text: "texto inicial y a mitad ¡otro que no termina",
        location: { column: 1 },
      },
    ],
    errors: [
      {
        where: {
          text: "texto inicial y a mitad ¡otro que no termina",
          location: { column: 1 },
        },
        rule:
          "sentence shall start with uppercased character, number, question or exclamations marks.",
        type: "error",
        fix: "Texto inicial y a mitad ¡otro que no termina",
      },
      {
        where: {
          text: "texto inicial y a mitad ¡otro que no termina",
          location: { column: 1 },
        },
        rule:
          "sentence shall end with dot, three dots, question or exclamations marks.",
        type: "error",
        fix: "texto inicial y a mitad ¡otro que no termina!",
      },
    ],
  },
  {
    paragraph: `Texto de prueba a lo lorem ipsum. Una segunda. Y una tercera.`,
    fix_paragraph: null,
    split: [
      {
        text: "Texto de prueba a lo lorem ipsum.",
        location: { column: 1 },
      },
      { text: " Una segunda.", location: { column: 34 } },
      { text: " Y una tercera.", location: { column: 47 } },
    ],
    errors: [],
  },
  {
    paragraph: `Texto..`,
    fix_paragraph: "Texto..",
    split: [
      { text: "Texto.", location: { column: 1 } },
      { text: ".", location: { column: 7 } },
    ],
    errors: [
      {
        where: { text: ".", location: { column: 7 } },
        rule: "empty/incomplete sentence",
        type: "error",
        fix: null,
      },
    ],
  },
  {
    paragraph: `Texto. ¿`,
    fix_paragraph: "Texto. ¿",
    split: [
      { text: "Texto.", location: { column: 1 } },
      { text: " ¿", location: { column: 7 } },
    ],
    errors: [
      {
        where: { text: " ¿", location: { column: 7 } },
        rule: "incomplete sentence.",
        type: "error",
        fix: null,
      },
    ],
  },
  {
    paragraph:
      `Hola. ¿Cómo estás? El Sr. Pérez vive aquí. ¡Qué alegría verte! Esto es todo... Gracias.`,
    fix_paragraph: null,
    split: [
      { text: "Hola.", location: { column: 1 } },
      { text: " ¿Cómo estás?", location: { column: 6 } },
      { text: " El Sr. Pérez vive aquí.", location: { column: 19 } },
      { text: " ¡Qué alegría verte!", location: { column: 43 } },
      { text: " Esto es todo...", location: { column: 63 } },
      { text: " Gracias.", location: { column: 79 } },
    ],
    errors: [],
  },
  {
    paragraph: `Texto... Y todo continua con normalidad.`,
    fix_paragraph: null,
    split: [
      { text: "Texto...", location: { column: 1 } },
      { text: " Y todo continua con normalidad.", location: { column: 9 } },
    ],
    errors: [],
  },
  {
    paragraph: `Texto… Y todo continua con normalidad.`,
    fix_paragraph: null,
    split: [
      { text: "Texto…", location: { column: 1 } },
      { text: " Y todo continua con normalidad.", location: { column: 7 } },
    ],
    errors: [],
  },
  {
    paragraph: `texto de prueba a lo lorem ipsum`,
    fix_paragraph: "Texto de prueba a lo lorem ipsum.",
    split: [
      { text: "texto de prueba a lo lorem ipsum", location: { column: 1 } },
    ],
    errors: [
      {
        where: {
          text: "texto de prueba a lo lorem ipsum",
          location: { column: 1 },
        },
        rule:
          "sentence shall start with uppercased character, number, question or exclamations marks.",
        type: "error",
        fix: "Texto de prueba a lo lorem ipsum",
      },
      {
        where: {
          text: "texto de prueba a lo lorem ipsum",
          location: { column: 1 },
        },
        rule:
          "sentence shall end with dot, three dots, question or exclamations marks.",
        type: "error",
        fix: "texto de prueba a lo lorem ipsum.",
      },
    ],
  },
  {
    paragraph: `¿texto que se inicia con una pregunta`,
    fix_paragraph: "¿Texto que se inicia con una pregunta?",
    split: [{
      text: "¿texto que se inicia con una pregunta",
      location: { column: 1 },
    }],
    errors: [
      {
        where: {
          text: "¿texto que se inicia con una pregunta",
          location: { column: 1 },
        },
        rule:
          "sentence shall start with uppercased character, number, question or exclamations marks.",
        type: "error",
        fix: "¿Texto que se inicia con una pregunta",
      },
      {
        where: {
          text: "¿texto que se inicia con una pregunta",
          location: { column: 1 },
        },
        rule:
          "sentence shall end with dot, three dots, question or exclamations marks.",
        type: "error",
        fix: "¿texto que se inicia con una pregunta?",
      },
    ],
  },
  {
    paragraph: `¡`,
    // TODO this error can't be fixed, we throw ?
    fix_paragraph: "¡",
    split: [{ text: "¡", location: { column: 1 } }],
    errors: [
      {
        where: { text: "¡", location: { column: 1 } },
        rule: "empty/incomplete sentence",
        type: "error",
        fix: null,
      },
    ],
  },
  {
    paragraph: `¡texto que se inicia con una exclamación`,
    fix_paragraph: "¡Texto que se inicia con una exclamación!",
    split: [{
      text: "¡texto que se inicia con una exclamación",
      location: { column: 1 },
    }],
    errors: [
      {
        where: {
          text: "¡texto que se inicia con una exclamación",
          location: { column: 1 },
        },
        rule:
          "sentence shall start with uppercased character, number, question or exclamations marks.",
        type: "error",
        fix: "¡Texto que se inicia con una exclamación",
      },
      {
        where: {
          text: "¡texto que se inicia con una exclamación",
          location: { column: 1 },
        },
        rule:
          "sentence shall end with dot, three dots, question or exclamations marks.",
        type: "error",
        fix: "¡texto que se inicia con una exclamación!",
      },
    ],
  },
  {
    paragraph: `texto inicial y a mitad ¡otro que no termina`,
    fix_paragraph: "Texto inicial y a mitad ¡otro que no termina!",
    split: [
      {
        "text": "texto inicial y a mitad ¡otro que no termina",
        "location": {
          "column": 1,
        },
      },
    ],
    errors: [
      {
        "where": {
          "text": "texto inicial y a mitad ¡otro que no termina",
          "location": {
            "column": 1,
          },
        },
        "rule":
          "sentence shall start with uppercased character, number, question or exclamations marks.",
        "type": "error",
        "fix": "Texto inicial y a mitad ¡otro que no termina",
      },
      {
        "where": {
          "text": "texto inicial y a mitad ¡otro que no termina",
          "location": {
            "column": 1,
          },
        },
        "rule":
          "sentence shall end with dot, three dots, question or exclamations marks.",
        "type": "error",
        "fix": "texto inicial y a mitad ¡otro que no termina!",
      },
    ],
  },
  {
    paragraph: `¡qué me estas contando`,
    fix_paragraph: "¡Qué me estas contando!",
    split: [
      {
        "text": "¡qué me estas contando",
        "location": {
          "column": 1,
        },
      },
    ],
    errors: [
      {
        "where": {
          "text": "¡qué me estas contando",
          "location": {
            "column": 1,
          },
        },
        "rule":
          "sentence shall start with uppercased character, number, question or exclamations marks.",
        "type": "error",
        "fix": "¡Qué me estas contando",
      },
      {
        "where": {
          "text": "¡qué me estas contando",
          "location": {
            "column": 1,
          },
        },
        "rule":
          "sentence shall end with dot, three dots, question or exclamations marks.",
        "type": "error",
        "fix": "¡qué me estas contando!",
      },
    ],
  },
];
fixture.forEach((t) => {
  Deno.test(t.paragraph, () => {
    const paragraph = parse_paragraph(t.paragraph);
    assertEquals(
      paragraph.sentences,
      t.split,
      `split: ${t.paragraph} \n${JSON.stringify(paragraph.sentences, null, 2)}`,
    );
    const errors = get_errors(paragraph);
    // console.log(errors);
    assertEquals(
      errors,
      t.errors,
      `get_errors: ${t.paragraph} \n${JSON.stringify(errors, null, 2)}`,
    );

    assertEquals(
      t.paragraph,
      to_paragraph_text(paragraph),
      `to_paragrah: ${t.paragraph}`,
    );

    if (t.errors.length) {
      // both fixes has to do the same!
      assertEquals(
        t.fix_paragraph,
        fix_paragraph_text(t.paragraph),
        `fix_errors: ${t.paragraph}`,
      );

      assertEquals(
        t.fix_paragraph,
        to_paragraph_text(fix_paragraph(paragraph)),
        `fix_errors: ${t.paragraph}`,
      );      
    }
  });
});
