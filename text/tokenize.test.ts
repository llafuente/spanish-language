import { assertEquals, assertThrows } from "jsr:@std/assert";
import { tokenize } from "./tokenize.ts";
import path from "node:path";

Deno.test("tokenize", () => {
    const text = Deno.readTextFileSync(path.join(import.meta.dirname + "./quijote-test.text"))

    // update test
    // Deno.writeFileSync(path.join(import.meta.dirname + "/quijote-test.json"), new TextEncoder().encode(JSON.stringify(tokenize(text), null, 2)))
    const jsontext = Deno.readTextFileSync(path.join(import.meta.dirname + "./quijote-test.json"))
    const json = JSON.parse(jsontext)

    assertEquals(tokenize(text), json)
});
