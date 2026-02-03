import { assertEquals, assertThrows } from "jsr:@std/assert";
import { parse_text, fix_text, check, count, to_text } from "./text.ts";

Deno.test("check 0", () => {
  const bad_text = `Texto en narrativo.
—
—a`;

  const bad_analyzed = parse_text(bad_text);
  assertEquals(
    to_text(bad_analyzed),
    bad_text,
    "back to text shall be the same",
  );

  const bad_checked = check(bad_analyzed);

  console.log(bad_checked);
  assertEquals(bad_checked, [
    {
      part: { text: "", type: "DialogText", location: { line: 2, column: 2 } },
      rule: "empty dialog or narrative comment",
      fixedText: null,
    },
    {
      part: { text: "a", type: "DialogText", location: { line: 3, column: 2 } },
      rule: "dialog too short analyze",
      fixedText: null,
    },
  ]);
});

Deno.test("check 1", () => {
  const bad_text = `texto en narrativo
¿Por si fuera poco
¡Cómo duele`;
  const good_text = `Texto en narrativo.
¿Por si fuera poco?
¡Cómo duele!`;

  const bad_analyzed = parse_text(bad_text);
  assertEquals(
    to_text(bad_analyzed),
    bad_text,
    "back to text shall be the same",
  );

  const bad_checked = check(bad_analyzed);

  const good_analyzed = parse_text(good_text);
  assertEquals(
    to_text(good_analyzed),
    good_text,
    "back to text shall be the same",
  );

  const good_checked = check(good_analyzed);
  assertEquals(good_checked.length, 0, "no errors found");

  //console.log(bad_checked);
  assertEquals(bad_checked, [
    {
      part: {
        type: "Narrative",
        text: "texto en narrativo",
        location: { line: 1, column: 1 },
      },
      rule: "paragraph shall start with uppercase",
      fixedText: "Texto en narrativo",
    },
    {
      part: {
        type: "Narrative",
        text: "texto en narrativo",
        location: { line: 1, column: 1 },
      },
      rule: "paragraph shall end with: .?!",
      fixedText: "texto en narrativo.",
    },
    {
      part: {
        type: "Narrative",
        text: "¿Por si fuera poco",
        location: { line: 2, column: 1 },
      },
      rule: "paragraph shall end with: .?!",
      fixedText: "¿Por si fuera poco?",
    },
    {
      part: {
        type: "Narrative",
        text: "¡Cómo duele",
        location: { line: 3, column: 1 },
      },
      rule: "paragraph shall end with: .?!",
      fixedText: "¡Cómo duele!",
    },
  ]);

  assertEquals(fix_text(bad_text), good_text);
});

Deno.test("check 2", () => {
  const bad_text = `— ¡Madre!—Gruñó un guardia`;
  const good_text = `—¡Madre! —gruñó un guardia.`;

  const bad_analyzed = parse_text(bad_text);
  assertEquals(
    to_text(bad_analyzed),
    bad_text,
    "back to text shall be the same",
  );

  const bad_checked = check(bad_analyzed);

  const good_analyzed = parse_text(good_text);
  assertEquals(
    to_text(good_analyzed),
    good_text,
    "back to text shall be the same",
  );

  const good_checked = check(good_analyzed);

  assertEquals(good_checked.length, 0, "no errors found");

  // console.log(bad_checked)
  assertEquals(bad_checked, [
    {
      part: {
        text: " ¡Madre!",
        type: "DialogText",
        location: { line: 1, column: 2 },
      },
      rule: "dialog never starts with a space",
      fixedText: "¡Madre!",
    },
    {
      part: {
        text: " ¡Madre!",
        type: "DialogText",
        location: { line: 1, column: 2 },
      },
      rule:
        "dialog shall end with space because there is a narrator comment next",
      fixedText: " ¡Madre! ",
    },
    {
      part: {
        text: "Gruñó un guardia",
        type: "NarratorComment",
        location: { line: 1, column: 11 },
      },
      rule: "verbs of speech begin with a lowercase letter",
      fixedText: "gruñó un guardia",
    },
    {
      part: {
        text: "Gruñó un guardia",
        type: "NarratorComment",
        location: { line: 1, column: 11 },
      },
      rule: "last narrator comment shall end with one of: .?!…",
      fixedText: "Gruñó un guardia.",
    },
  ]);
});

Deno.test("check 3", () => {
  const bad_text = `— No había prisa`;
  const good_text = `—No había prisa.`;

  const bad_analyzed = parse_text(bad_text);
  assertEquals(
    to_text(bad_analyzed),
    bad_text,
    "back to text shall be the same",
  );

  const bad_checked = check(bad_analyzed);

  const good_analyzed = parse_text(good_text);
  assertEquals(
    to_text(good_analyzed),
    good_text,
    "back to text shall be the same",
  );

  const good_checked = check(good_analyzed);
  assertEquals(good_checked.length, 0, "no errors found");

  // console.log(bad_checked)
  assertEquals(bad_checked, [
    {
      part: {
        text: " No había prisa",
        type: "DialogText",
        location: { line: 1, column: 2 },
      },
      rule: "dialog never starts with a space",
      fixedText: "No había prisa",
    },
    {
      part: {
        text: " No había prisa",
        type: "DialogText",
        location: { line: 1, column: 2 },
      },
      rule: "last dialog shall end with one of: .?!…",
      fixedText: " No había prisa.",
    },
  ]);
});

Deno.test("check 4", () => {
  const bad_text =
    `—¿No había prisa? — intervino el regidor —Nada de que preocuparse`;
  const good_text =
    `—¿No había prisa? —intervino el regidor —. Nada de que preocuparse.`;

  const bad_analyzed = parse_text(bad_text);
  assertEquals(
    to_text(bad_analyzed),
    bad_text,
    "back to text shall be the same",
  );

  const bad_checked = check(bad_analyzed);

  const good_analyzed = parse_text(good_text);
  assertEquals(
    to_text(good_analyzed),
    good_text,
    "back to text shall be the same",
  );

  const good_checked = check(good_analyzed);
  assertEquals(good_checked.length, 0, "no errors found");

  // console.log(bad_checked)
  assertEquals(bad_checked, [
    {
      part: {
        text: "Nada de que preocuparse",
        type: "DialogText",
        location: { line: 1, column: 43 },
      },
      rule: "previous dialog ended with ?!, this one shall start with dot",
      fixedText: ". Nada de que preocuparse",
    },
    {
      part: {
        text: " intervino el regidor ",
        type: "NarratorComment",
        location: { line: 1, column: 20 },
      },
      rule: "narrator comment do not start with a space",
      fixedText: "intervino el regidor ",
    },
    {
      part: {
        text: "Nada de que preocuparse",
        type: "DialogText",
        location: { line: 1, column: 43 },
      },
      rule: "last dialog shall end with one of: .?!…",
      fixedText: "Nada de que preocuparse.",
    },
  ]);
});

Deno.test("check 5", () => {
  const bad_text = `Juan no pudo contenerse y dijo— ¡Qué está ocurriendo aquí!`;
  const good_text =
    `Juan no pudo contenerse y dijo: —¡Qué está ocurriendo aquí!`;

  const bad_analyzed = parse_text(bad_text);
  assertEquals(
    to_text(bad_analyzed),
    bad_text,
    "back to text shall be the same",
  );

  const bad_checked = check(bad_analyzed);

  const good_analyzed = parse_text(good_text);
  assertEquals(
    to_text(good_analyzed),
    good_text,
    "back to text shall be the same",
  );

  const good_checked = check(good_analyzed);
  assertEquals(good_checked.length, 0, "no errors found");

  // console.log(bad_checked);
  assertEquals(bad_checked, [
    {
      part: {
        text: "Juan no pudo contenerse y dijo",
        type: "NarratorComment",
        location: { line: 1, column: 1 },
      },
      rule: "narrator comment at start shall end with space",
      fixedText: null,
    },
    {
      part: {
        text: "Juan no pudo contenerse y dijo",
        type: "NarratorComment",
        location: { line: 1, column: 1 },
      },
      rule: "if started with narrator comment shall end with colon space",
      fixedText: "Juan no pudo contenerse y dijo: ",
    },
    {
      part: {
        text: " ¡Qué está ocurriendo aquí!",
        type: "DialogText",
        location: { line: 1, column: 32 },
      },
      rule: "dialog never starts with a space",
      fixedText: "¡Qué está ocurriendo aquí!",
    },
  ]);
});

Deno.test("check 1", () => {
  const good_text = `Texto en narrativo.
  "par te un poema
  que se arrastra varias líneas
  hasta que llega su final
  y conluye"
Para que el texto pueda seguir.`;

  const good_analyzed = parse_text(good_text);
  assertEquals(
    to_text(good_analyzed),
    good_text,
    "back to text shall be the same",
  );

  const good_checked = check(good_analyzed);
  assertEquals(good_checked.length, 0, "no errors found");
});

Deno.test("count!", () => {
  const good_text = `Un poco de narrativa no le viene mal a nadie.
—¡Qué me estas contando! —gritó Juan.

Al estruendo de los platos contestó Pepe: —¡Cuidado! —gritó un guardia.
—¡Vámonos! —sugirió otra persona sin nombre —. Aquí sólo nos espera la muerte.

Y el olvido les atacó y mató. ¿Que ocurre?`;

  const good_analyzed = parse_text(good_text);
  assertEquals(
    to_text(good_analyzed),
    good_text,
    "back to text shall be the same",
  );

  const good_checked = check(good_analyzed);
  const good_count = count(good_analyzed);
  assertEquals(good_checked.length, 0, "no errors found");

  // console.log(good_count);
  assertEquals(good_count, {
    total: 52,
    count: { narrative: 20, dialog: 13, dialogComment: 19 },
    percentage: { narrative: 38.46, dialog: 25, dialogComment: 36.54 },
  });
});

Deno.test("check 1", () => {
  //const bad_text = `—Cierra la puerta. —Las palabras eran una súplica, no una orden.`;
  //const bad_text = `—Cierra la puerta. —Dijo pepe.`;
  const bad_text = `—Bueno, supongo que esto significa que me quedo. —Hizo un gesto a un niño para que le acercara un taburete—. Menos mal...Hubiese sido una lástima haber tenido que marcharme antes decompartir mis noticias.`

  const bad_analyzed = parse_text(bad_text);
  assertEquals(
    to_text(bad_analyzed),
    bad_text,
    "back to text shall be the same",
  );

  const bad_checked = check(bad_analyzed);

  console.log(bad_checked);
  assertEquals(bad_checked, []);
});


