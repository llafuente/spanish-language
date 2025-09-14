import { assertEquals, assertThrows } from "jsr:@std/assert";
import {
  is_vowel,
  is_consonant
} from "./letter.ts";



// a) Sustantivos y adjetivos terminados en vocal átona o en -e tónica. Forman el plural con -s: casas, estudiantes, taxis, planos, tribus, comités. Son vulgares los plurales terminados en -ses, como ⊗‍cafeses, en lugar de cafés, o ⊗‍pieses, en lugar de pies.
assertEquals(is_vowel("a"), true)
assertEquals(is_vowel("b"), false)

assertEquals(is_consonant("ñ"), true)
assertEquals(is_consonant("Ñ"), true)
assertEquals(is_consonant("a"), false)
assertEquals(is_consonant("z"), true)
assertEquals(is_consonant("u"), false)

assertEquals(is_consonant("A"), false)
assertEquals(is_consonant("Z"), true)
assertEquals(is_consonant("U"), false)
