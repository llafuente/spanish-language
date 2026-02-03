import { assertEquals, assertThrows } from "jsr:@std/assert";
import {
  is_closed_vowel,
  is_consonant,
  is_open_vowel,
  is_stressed_closed_vowel,
  is_strong_vowel,
  is_unstressed_open_vowel,
  is_vowel,
  remove_accents,
  remove_diaeresis,
} from "./letter.ts";

assertThrows(() => {
  is_vowel("");
}, "only one char is allowed");
assertThrows(() => {
  is_vowel("ab");
}, "only one char is allowed");

assertThrows(() => {
  is_consonant("");
}, "only one char is allowed");
assertThrows(() => {
  is_consonant("ab");
}, "only one char is allowed");

assertThrows(() => {
  is_open_vowel("");
}, "only one char is allowed");
assertThrows(() => {
  is_open_vowel("ab");
}, "only one char is allowed");

assertThrows(() => {
  is_strong_vowel("");
}, "only one char is allowed");
assertThrows(() => {
  is_strong_vowel("ab");
}, "only one char is allowed");

assertThrows(() => {
  is_closed_vowel("");
}, "only one char is allowed");
assertThrows(() => {
  is_closed_vowel("ab");
}, "only one char is allowed");

assertThrows(() => {
  is_unstressed_open_vowel("");
}, "only one char is allowed");
assertThrows(() => {
  is_unstressed_open_vowel("ab");
}, "only one char is allowed");

assertThrows(() => {
  is_stressed_closed_vowel("");
}, "only one char is allowed");
assertThrows(() => {
  is_stressed_closed_vowel("ab");
}, "only one char is allowed");

// a) Sustantivos y adjetivos terminados en vocal átona o en -e tónica. Forman el plural con -s: casas, estudiantes, taxis, planos, tribus, comités. Son vulgares los plurales terminados en -ses, como ⊗‍cafeses, en lugar de cafés, o ⊗‍pieses, en lugar de pies.
assertEquals(is_vowel("a"), true);
assertEquals(is_vowel("b"), false);

assertEquals(is_consonant("ñ"), true);
assertEquals(is_consonant("Ñ"), true);
assertEquals(is_consonant("a"), false);
assertEquals(is_consonant("z"), true);
assertEquals(is_consonant("u"), false);

assertEquals(is_consonant("A"), false);
assertEquals(is_consonant("Z"), true);
assertEquals(is_consonant("U"), false);

assertEquals(is_open_vowel("a"), true);
assertEquals(is_open_vowel("e"), true);
assertEquals(is_open_vowel("i"), false);
assertEquals(is_open_vowel("o"), true);
assertEquals(is_open_vowel("u"), false);

assertEquals(remove_diaeresis("güecho"), "guecho");
assertEquals(remove_diaeresis("GÜECHO"), "GUECHO");

assertEquals(remove_accents("áéíóú"), "aeiou");
assertEquals(remove_accents("ÁÉÍÓÚ"), "AEIOU");
assertEquals(remove_accents("NO MODIFICAR NADA"), "NO MODIFICAR NADA");
assertEquals(
  remove_accents("no modificar NA! de na!"),
  "no modificar NA! de na!",
);

assertEquals(is_strong_vowel("a"), true);
assertEquals(is_strong_vowel("i"), false);

assertEquals(is_closed_vowel("a"), false);
assertEquals(is_closed_vowel("e"), false);
assertEquals(is_closed_vowel("i"), true);
assertEquals(is_closed_vowel("o"), false);
assertEquals(is_closed_vowel("u"), true);

assertEquals(is_unstressed_open_vowel("a"), true);
assertEquals(is_unstressed_open_vowel("u"), false);

assertEquals(is_stressed_closed_vowel("á"), false);
assertEquals(is_stressed_closed_vowel("ú"), true);
