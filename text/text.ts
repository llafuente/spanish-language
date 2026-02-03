import { DialogParagraph, TextErrors, Parragraphs } from "./types.ts";
import { VERBS_OF_SPEECH } from "./config.ts";

export function parse_text(text: string): Parragraphs[] {
  const output: Parragraphs[] = [];

  const paragraphs = text.replaceAll("\r", "").split("\n");
  for (let line = 0; line < paragraphs.length; ++line) {
    //let paragraph = paragraphs[line].trim();
    const paragraph = paragraphs[line];
    // console.log(line, paragraph);
    if (paragraph.length == 0) {
      // console.log("skip, empty line");
      output.push({
        type: "EmptyParagraph",
        location: {
          line: line + 1,
          column: 1,
        },
      });
      continue;
    }

    if (paragraph[0] == "\t" || (paragraph[0] == " " && paragraph[1] == " ")) {
      output.push({
        type: "Quote",
        text: paragraph,
        location: {
          line: line + 1,
          column: 1,
        },
      });
      continue;
    }

    // if a paragraph contains "—", it's a dialog
    if (paragraph.indexOf("—") >= 0) {
      const dialog: DialogParagraph = {
        type: "Dialog",
        parts: [],
        location: {
          line: line + 1,
          column: 1,
        },
      };
      const parts: string[] = paragraph.split("—");

      // paragraph starts with DialogText?
      let start = parts[0].length == 0 ? 1 : 0;
      let isDialog = start == 1;
      let column = start == 1 ? 2 : 1;

      for (let i = start; i < parts.length; ++i) {
        // console.log(i, isDialog, parts[i])
        if (isDialog) {
          dialog.parts.push({
            text: parts[i],
            type: "DialogText",
            location: {
              line: line + 1,
              column: column,
            },
          });
        } else {
          dialog.parts.push({
            text: parts[i],
            type: "NarratorComment",
            location: {
              line: line + 1,
              column: column,
            },
          });
        }
        isDialog = !isDialog;
        column += parts[i].length + 1;
      }
      output.push(dialog);
    } else {
      output.push({
        type: "Narrative",
        text: paragraph.trim(),
        location: {
          line: line + 1,
          column: 1,
        },
      });
    }
  }

  return output;
}

export function countWords(paragraph: string) {
  return paragraph.trim().replace(/[,\.¿?]/, " ").replace("  ", " ").split(" ")
    .length;
}

export function count(parts: Parragraphs[]) {
  let narrative = 0;
  let dialog = 0;
  let dialogComment = 0;

  for (const part of parts) {
    switch (part.type) {
      case "Narrative":
        narrative += countWords(part.text);
        break;
      case "Dialog":
        for (const dpart of part.parts) {
          switch (dpart.type) {
            case "DialogText":
              dialog += countWords(dpart.text);
              break;
            case "NarratorComment":
              dialogComment += countWords(dpart.text);
              break;
          }
        }
        break;
    }
  }
  const total = narrative + dialog + dialogComment;
  return {
    total,
    count: {
      narrative,
      dialog,
      dialogComment,
    },
    percentage: {
      narrative: Math.round((narrative / total) * 10000) / 100,
      dialog: Math.round((dialog / total) * 10000) / 100,
      dialogComment: Math.round((dialogComment / total) * 10000) / 100,
    },
  };
}

function get_paragraph_close_character(text: string) {
  const openQuestionMarks = (text.match(new RegExp("¿", "g")) || []).length;
  const closeQuestionMarks = (text.match(new RegExp("\\?", "g")) || []).length;
  const openExclamationMarks = (text.match(new RegExp("¡", "g")) || []).length;
  const closeExclamationMarks =
    (text.match(new RegExp("\\!", "g")) || []).length;
  let closeChar = ".";
  if (openQuestionMarks != closeQuestionMarks) {
    closeChar = "?";
  }
  if (openExclamationMarks != closeExclamationMarks) {
    closeChar = "!";
  }
  return closeChar;
}

export function get_errors(parts: Parragraphs[]): TextErrors[] {
  const output: TextErrors[] = [];

  for (let i = 0; i < parts.length; ++i) {
    const part = parts[i];

    switch (part.type) {
      case "Narrative":
        if (i == 0) {
          if (!part.text[0].match(/[A-Z0-9]/)) {
            output.push({
              part,
              rule: "paragraph shall start with uppercase",
              fixedText: part.text[0].toUpperCase() + part.text.substring(1),
            });
          }
        }

        if (!part.text[part.text.length - 1].match(/[\.\?\!]/)) {
          // if there is a previous question mark, close it
          output.push({
            part,
            rule: "paragraph shall end with: .?!",
            fixedText: part.text + get_paragraph_close_character(part.text),
          });
        }
        break;
      case "Dialog":
        for (let j = 0; j < part.parts.length; ++j) {
          let dpart = part.parts[j];
          const isLast = j == part.parts.length - 1;

          //console.log(j, dpart)
          /*
Reglas

La raya se pega al primer elemento (sin espacio) y después se deja espacio tras ella.

Las rayas se pegan al texto que introducen y se coloca punto solo al final del enunciado completo.

Si el inciso interrumpe una oración, se continúa en minúscula tras el inciso.
Si el inciso termina la oración, lo que sigue después empieza con mayúscula.
Ejemplo:

—No sé —dijo Marta— si podré ir mañana.
—Tal vez —añadió—. No estoy segura.

3. Puntuación interna del diálogo
Los signos de puntuación propios de cada intervención (puntos, comas, signos de interrogación o exclamación) se colocan antes del cierre de la raya, cuando hay inciso, o normalmente si no lo hay.

Ejemplos:

—¿Vendrás mañana? —preguntó Lucía.
—¡Qué alegría verte! —exclamó Juan.

Si no hay inciso del narrador, se finaliza con el signo de puntuación correspondiente y no se añade raya de cierre:

Ejemplo:

—Espero que mañana haga buen tiempo.

4. Diálogos extensos: unificación de signos
Si una intervención ocupa varios párrafos, solo el primero lleva raya de apertura. Los siguientes párrafos empiezan sin raya, salvo que haya un nuevo interlocutor.

Ejemplo:

—Desde que llegamos, todo ha cambiado.
El pueblo ya no es como antes.
Espero que podamos adaptarnos.

Si cambia el hablante, se introduce nueva raya.

5. Diálogo con acotaciones iniciales
Cuando se desea aclarar desde el inicio quién habla, puede empezarse con un inciso del narrador seguido de dos puntos y luego la intervención, sin raya:

Ejemplo:

Marta dijo: —Hoy no podré acompañarte.

Ojo: si tras los dos puntos la intervención continúa con un diálogo extendido, sí se puede usar raya en los cambios de turno.


          */

          const text = dpart.text;
          if (!dpart.text.length) {
            output.push({
              part: dpart,
              rule: "empty dialog or narrative comment",
              fixedText: null,
            });
            continue;
          }

          const firstChar = text[0];
          const lastChar = text[text.length - 1];
          const lastChar2 = text[text.length - 2];

          if (!lastChar2) {
            output.push({
              part: dpart,
              rule: "dialog too short analyze",
              fixedText: null,
            });
            continue;
          }

          switch (dpart.type) {
            case "DialogText":
              if (firstChar == " ") {
                output.push({
                  part: dpart,
                  rule: "dialog never starts with a space",
                  fixedText: dpart.text.substring(1),
                });
              }

              if (isLast) {
                // checks for last/single dialog
                if (!lastChar.match(/[\.\?\!…]/)) {
                  output.push({
                    part: dpart,
                    rule: "last dialog shall end with one of: .?!…",
                    fixedText: dpart.text +
                      get_paragraph_close_character(dpart.text),
                  });
                }
              } else {
                if (lastChar != " ") {
                  output.push({
                    part: dpart,
                    rule:
                      "dialog shall end with space because there is a narrator comment next",
                    fixedText: dpart.text + " ",
                  });
                }
              }

              if (lastChar2.match(/[\?\!]/)) {
                const ndpart = part.parts[j + 2];
                if (ndpart && ndpart.text[0] != ".") {
                  output.push({
                    part: ndpart,
                    rule:
                      "previous dialog ended with ?!, this one shall start with dot",
                    fixedText: ". " + ndpart.text,
                  });
                }
              }

              break;
            case "NarratorComment":
              if (firstChar == " ") {
                output.push({
                  part: dpart,
                  rule: "narrator comment do not start with a space",
                  fixedText: dpart.text.substring(1),
                });
              }
              // TODO this need to be more precise!
              if (j > 0 && firstChar.match(/[A-Z]/)) {
                const firstWord = dpart.text.split(" ")[0].toLowerCase();
                if (VERBS_OF_SPEECH.indexOf(firstWord) > 0) {
                  output.push({
                    part: dpart,
                    rule: "verbs of speech begin with a lowercase letter",
                    fixedText: firstChar.toLocaleLowerCase() +
                      dpart.text.substring(1),
                  });
                }
              }
              if (j == 0) {
                if (lastChar != " ") {
                  output.push({
                    part: dpart,
                    rule: "narrator comment at start shall end with space",
                    fixedText: null,
                  });
                }
                if (lastChar2 != ":") {
                  output.push({
                    part: dpart,
                    rule:
                      "if started with narrator comment shall end with colon space",
                    fixedText: dpart.text + ": ",
                  });
                }
              }
              // last!
              if (j == part.parts.length - 1) {
                if (!dpart.text[dpart.text.length - 1].match(/[\.\?\!…]/)) {
                  output.push({
                    part: dpart,
                    rule: "last narrator comment shall end with one of: .?!…",
                    fixedText: dpart.text +
                      get_paragraph_close_character(dpart.text),
                  });
                }
              }
              break;
          }
        }

        break;
    }
  }

  return output;
}

export function to_text(parts: Parragraphs[]): string {
  const text: string[] = [];
  for (let i = 0; i < parts.length; ++i) {
    const part = parts[i];
    // console.log(i, part);
    switch (part.type) {
      case "EmptyParagraph":
        text.push("");
        break;
      case "Narrative":
        text.push(part.text);
        break;
      case "Dialog":
        {
          let subtext = "";
          for (let i = 0; i < part.parts.length; ++i) {
            const dpart = part.parts[i];
            // console.log(part.type, dpart.type, dpart.location.line, dpart.text);
            switch (dpart.type) {
              case "DialogText":
                subtext += "—" + dpart.text;
                break;
              case "NarratorComment":
                subtext += (i > 0 ? "—" : "") + dpart.text;
                break;
            }
          }
          text.push(subtext);
        }
        break;
      case "Quote":
        text.push(part.text);
        break;
    }
  }

  return text.join("\n");
}

export function fix_text(text: string): string {
  let can_fix_more = true;
  let MAX_ITERATIONS = 10;
  do {
    const text_parts = parse_text(text);
    const errors = get_errors(text_parts);

    can_fix_more = false;
    for (let i = 0; i < errors.length; ++i) {
      const err = errors[i];
      if (err.fixedText != null) {
        can_fix_more = true;
        const p = err.part as any;
        p.text = err.fixedText;
      }
    }
    text = to_text(text_parts);
    // deno-coverage-ignore-start it's just a precaution
    if (--MAX_ITERATIONS == 0) {
      console.warn("exit by max iterations");
      break;
    }
    // deno-coverage-ignore-stop
  } while (can_fix_more);

  return text;
}
