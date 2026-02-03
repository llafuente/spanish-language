# Spanish language / Español / Castellano

Éste es un proyecto para conseguir aplicar las reglas del castellano en su totalidad, según la rae.

Entre las utilidades que se encuentran en el proyecto.

* Palabra (operaciones a nivel de un única palabra)
  * *TODO* dictionary/get_definition: Devuelve una entrada del diccionario o una redireccion a otra entrada.
  * *TODO* is_plural: para saber si una palabra es plural o no
  * `word/plural/to_plural.ts`: devuelve el plural de una palabra.
    ```typescript
      import { to_plural } from "./word/plural/to_plural.ts";

      // single plural example
      assertEquals(to_plural("casa"), ["casas"]);
      // multiple plurals example
      assertEquals(to_plural("bisturí"), ["bisturís", "bisturíes"]);
    ```

  * *TODO* plural/to_singular: devuelve el singular de una palabra
  * `word/syllabify/syllabify.ts`: silabea una palabra.
    * silabas de la palabra: ataque, nucleo, coda (incluido hiato, diptongo, triptongo y sus tipos)
    * silaba tónica
    * letra acentuada
    * tipo de acenturación

    *example*

    ```typescript
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
    ```
* Género
  * *TODO* genre/get_genre: determina el género de la palabra enviada.
* Verbos
  * *TODO* verbs

  * `word/phonetic/to_ipa.ts`: Dado un texto lo transforma al Alfabeto Fonético Internacional (AFI) / International Phonetic Alphabet (IPA)
    ```typescript
      import {
        SPANISH_STANDARD,
        to_ipa as word_to_ipa,
      } from "./word/phonetic/to_ipa.ts";
      // to_ipa support custom dialecs
      assertEquals(word_to_ipa(`ninguno`, SPANISH_STANDARD), `nin.ˈɣu.no`);
    ```

Oraciones (operaciones con oraciones)
  * `sentence/sentence.ts`
    * `get_errors`: Devuelve los errores (sintácticos, *TODO* semánticos) de la oración enviada.

Párrafo (operaciones con párrafos)
  * `parapgrah/parapgrah.ts`
    * `parse_paragraph`: Parte el texto de un párrafo en sus oraciones. Las oraciones pueden contener errores.
    * `to_paragraph_text`: Transform un párrafo en su texto.
    * `get_errors`: Devuelve los errores (sintácticos, *TODO* semánticos).
    * `fix_paragraph`: Corrige los errores de todas las oraciones del párrafo (siempre que se pueda)

Texto (operaciones con texto)
  * `text/phonetic/to_ipa.ts`: Dado un texto lo transforma al Alfabeto Fonético Internacional (AFI) / International Phonetic Alphabet (IPA)
    ```typescript
      import { to_ipa } from "./text/phonetic/to_ipa.ts";
      // to_ipa can be used at text level.
      assertEquals(
        to_ipa(`Un ejemplo y ninguno más.`),
        `ˈun.e.ˈxem.plo.ˈi.nin.ˈɣu.no.ˈmas‖`,
      );
    ```
  * `text/tokenize.ts`: Parte un texto en tokens para ser analizado: texto y puntuación.
  * `text/text.ts`

      ```typescript
        import { parse_text, get_errors, fix_text } from "./text/text.ts";
        // there is an error in this text
        const text = `—Cierra la puerta. —Las palabras eran una súplica, no una orden.
        —Cierra la puerta. —Dijo pepe.`;

        const paragraphs = parse_text(text);
        // text is fixed!, remember that not all errors can be "autofix"
        assertEquals(fix_text(text), `—Cierra la puerta. —Las palabras eran una súplica, no una orden.
        —Cierra la puerta. —dijo pepe.`);
      ```

     * `parse_text`: Parte un texto completo en sus párrafos. Se asume que el texto es literario, un libro.
     * `to_text`: Transforma el texto parseado en un único string.
     * `get_errors`: Devuelve los errores (sintácticos, *TODO* semánticos).
     * `fix_text`: Corrige los errores de todas las oraciones del párrafo (siempre que se pueda)
     * `count`: Cuenta las palabras por cada tipo de párrafo.

* Morfología
  * `morphology/get_sufixes.ts`: Localiza los sufijos de una palabra
  * `morphology/get_prefixes.ts`: Localiza los prefijos de una palabra
     

Así mismo poder analizar morfológicamente / sintácticamente una frase.


Palabras variables. Son las que modifican su terminación para señalar género, número, persona, tiempo y/o modo: el sustantivo, el adjetivo, el artículo, el pronombre y el verbo.
Palabras invariables. Son las que no sufren modificaciones: el adverbio, la preposición, la conjunción y la interjección.