# Spanish language / Español / Castellano

Éste es un proyecto para conseguir aplicar las reglas del castellano en su totalidad, según la rae.

Entre las utilidades que se encuentran en el proyecto.

* Palabra (operaciones a nivel de palabra)
  * *TODO* dictionary/get_definition: Devuelve una entrada del diccionario o una redireccion a otra entrada.
  * *TODO* is_plural: para saber si una palabra es plural o no
  * `plural/to_plural.ts`: devuelve el plural de una palabra.
    ```typescript
    import { assertEquals } from "jsr:@std/assert";
    import { to_plural } from "./to_plural.ts";

    assertEquals(to_plural("casa"), ["casas"]);
    // plural can have multiples options
    assertEquals(to_plural("bisturí"), ["bisturís", "bisturíes"]);
    ```

  * *TODO* plural/to_singular: devuelve el singular de una palabra
  * `syllabify/syllabify.ts`: silabea una palabra.
    * silabas de la palabra: ataque, nucleo, coda (incluido hiato, diptongo, triptongo y sus tipos)
    * silaba tónica
    * letra acentuada
    * tipo de acenturación

    *example*

    ```typescript
    import {
      syllabify,
    } from "./syllabify/syllabify.ts";
    console.log(syllabify("ciudad"));
    ```

    ```js
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
    }
    ```
* Género
  * *TODO* genre/get_genre: determina el género de la palabra enviada.
* Verbos
  * *TODO* verbs
Texto (operaciones con texto)
* Fonética (también aplica con palabras)
  * `phonetic/to_ipa.ts`: Dado un texto lo transforma al Alfabeto Fonético Internacional (AFI) / International Phonetic Alphabet (IPA)
    ```typescript
    import { assertEquals } from "jsr:@std/assert";
    import { to_ipa } from "./phonetic/to_ipa.ts";
    assertEquals(to_ipa(`Un ejemplo y ninguno más.`), `ˈune.ˈxem.ploˈinin.ˈɣu.noˈmas‖`);
    ```

* Morfología
  * `morphology/get_sufixes.ts`: Localiza los sufijos de una palabra
  * `morphology/get_prefixes.ts`: Localiza los prefijos de una palabra
* text
  * `text/tokenize.ts`: Parte un texto en tokens para ser analizado: texto y puntuación.


Así mismo poder analizar morfológicamente / sintácticamente una frase.


Palabras variables. Son las que modifican su terminación para señalar género, número, persona, tiempo y/o modo: el sustantivo, el adjetivo, el artículo, el pronombre y el verbo.
Palabras invariables. Son las que no sufren modificaciones: el adverbio, la preposición, la conjunción y la interjección.