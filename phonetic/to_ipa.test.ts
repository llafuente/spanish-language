import { assertEquals, assertThrows } from "jsr:@std/assert";
import { to_ipa } from "./to_ipa.ts";

Deno.test("get_ipa", () => {

  // Stressed vowels
  assertEquals(to_ipa(`piso`), `ˈpi.so`);
  assertEquals(to_ipa(`peso`), `ˈpe.so`);
  assertEquals(to_ipa(`paso`), `ˈpa.so`);
  assertEquals(to_ipa(`poso`), `ˈpo.so`);
  assertEquals(to_ipa(`puso`), `ˈpu.so`);

  // Unstressed vowels
  assertEquals(to_ipa(`pisó`), `pi.ˈso`);
  assertEquals(to_ipa(`pesó`), `pe.ˈso`);
  assertEquals(to_ipa(`pasó`), `pa.ˈso`);
  assertEquals(to_ipa(`posó`), `po.ˈso`);
  assertEquals(to_ipa(`pujó`), `pu.ˈxo`);


assertEquals(to_ipa(`piel`), `ˈpi̯el`)

assertEquals(to_ipa(`área`), `ˈa.ɾe.a`)
assertEquals(to_ipa(`héroe`), `ˈe.ɾo.e`)

  // j - x

assertEquals(to_ipa(`paje`), `ˈpa.xe`)
assertEquals(to_ipa(`jinete`), `xi.ˈne.te`)
assertEquals(to_ipa(`jirafa`), `xi.ˈɾa.fa`)

assertEquals(to_ipa(`genial`), `xe.ˈni̯al`)
assertEquals(to_ipa(`girar`), `xi.ˈɾaɾ`)
assertEquals(to_ipa(`página`), `ˈpa.xi.na`)

assertEquals(to_ipa(`dije`), `ˈdi.xe`)
assertEquals(to_ipa(`gente`), `ˈxen.te`)
//assertEquals(get_ipa(`mejico`), `ˈme.xi.ko`)
assertEquals(to_ipa(`jamón`), `xa.ˈmon`)

// k
assertEquals(to_ipa(`casa`), `ˈka.sa`)
assertEquals(to_ipa(`queso`), `ˈke.so`)
assertEquals(to_ipa(`cosa`), `ˈko.sa`)
assertEquals(to_ipa(`cuna`), `ˈku.na`)
assertEquals(to_ipa(`kilo`), `ˈki.lo`)  

// g
assertEquals(to_ipa(`guerra`), `ˈge.ɾ̄a`)
assertEquals(to_ipa(`guiso`), `ˈgi.so`)
assertEquals(to_ipa(`garra`), `ˈɣa.ɾ̄a`)
assertEquals(to_ipa(`gorra`), `ˈɣo.ɾ̄a`)
assertEquals(to_ipa(`gusano`), `ɣu.ˈsa.no`)

// TODO review stress
assertEquals(to_ipa(`agüita`), `a.ˈgui.ta`)
assertEquals(to_ipa(`halagüeño`), `a.la.ˈgue.ɲo`)

assertEquals(to_ipa(`güiski`), `ˈguis.ki`)
assertEquals(to_ipa(`wisky`), `ˈguis.ki`)

// r

assertEquals(to_ipa(`enredo`), `en.ˈɾ̄e.do`)
assertEquals(to_ipa(`alrededor`), `al.ɾ̄e.de.ˈdoɾ`)
assertEquals(to_ipa(`israelita`), `is.ɾ̄a.e.ˈli.ta`)

assertEquals(to_ipa(`rey`), `ˈɾ̄ei`)
assertEquals(to_ipa(`reina`), `ˈɾ̄ei̯.na`)
assertEquals(to_ipa(`pero`), `ˈpe.ɾo`)

// b
assertEquals(to_ipa(`beso`), `ˈbe.so`)
assertEquals(to_ipa(`vaso`), `ˈba.so`)

// ll, y

assertEquals(to_ipa(`yeso`), `ˈʝe.so`)
assertEquals(to_ipa(`haya`), `ˈa.ʝa`)
assertEquals(to_ipa(`llega`), `ˈʝe.ɣa`)
assertEquals(to_ipa(`halla`), `ˈa.ʝa`)

// θ

assertEquals(to_ipa(`zapato`), `θa.ˈpa.to`)
assertEquals(to_ipa(`cien`), `ˈθi̯en`)
assertEquals(to_ipa(`cebo`), `ˈθe.βo`)
assertEquals(to_ipa(`bien`), `ˈbi̯en`)

assertEquals(to_ipa(`sien`), `ˈsi̯en`)

assertEquals(to_ipa(`encima`), `en.ˈθi.ma`)
assertEquals(to_ipa(`enzima`), `en.ˈθi.ma`)

assertEquals(to_ipa(`cereza`), `θe.ˈɾe.θa`)

assertEquals(to_ipa(`escena`), `es.ˈθe.na`)



// x

assertEquals(to_ipa(`taxi`), `ˈtak.si`)

assertEquals(to_ipa(`experto`), `eks.ˈpeɾ.to`)
assertEquals(to_ipa(`auxilio`), `au̯k.ˈsi.li̯o`)


// assertEquals(get_ipa(`peine`, {target: "latin"}), `/ˈpejne/`)


// ch
assertEquals(to_ipa(`acechar`), `a.θe.ˈʧaɾ`)


assertEquals(to_ipa(`paz`), `ˈpað`)
 
assertEquals(to_ipa(`afganistán`), `af.ɣa.nis.ˈtan`) // afɣanisˈtan/

// z - Israel; isla; es mía; sabes la última

// χ


// refinament

assertEquals(to_ipa(`isla`), `ˈis.la`)
/*
ˈis.la (peninsular, mexicano altiplano, andino alto, ecuatoguineano, rioplatense)
ˈih.la (andaluz, canario, chileno)
ˈi.la (caribeño)
*/

assertEquals(to_ipa(`quesillo`), `ke.ˈsi.ʝo`)
/*
ke.ˈs̺i.ʝo (peninsular)
ke.ˈs̻i.ʝo (mexicano altiplano, andaluz, canario, caribeño, chileno, ecuatoguineano)
ke.ˈzi.ʎo (andino alto)
ke.ˈs̻i.ʃo (rioplatense)
*/
assertEquals(to_ipa(`yoyó`), `ʝo.ˈʝo`)
/*
ʝo.ˈʝo (peninsular, mexicano altiplano, andaluz, canario, caribeño, chileno, ecuatoguineano)
ʎo.ˈʎo (andino alto)
ʃo.ˈʃo (rioplatense)
*/
assertEquals(to_ipa(`yogurt`), `ʝo.ˈɣuɾt`)
/*
ʝo.ˈɣuɾt (peninsular, mexicano altiplano, andaluz, canario, caribeño, chileno)
ʎo.ˈɣuɾt (andino alto)
ʝo.ˈɡuɾt (ecuatoguineano)
ʃo.ˈɣuɾt (rioplatense)
*/

// TODO ˈme.xi.ko
assertEquals(to_ipa(`méxico`), `ˈmek.si.ko`)

assertEquals(to_ipa(`alma`), `ˈal.ma`)
/*
ˈal.ma
ˈar.ma (andaluz)
*/
// https://www.silabas.net/index.php?p=amor
assertEquals(to_ipa(`amor`), `a.ˈmoɾ`)
/*
a.ˈmoɾ (peninsular, mexicano altiplano, andaluz, canario, ecuatoguineano, rioplatense)
a.ˈmoɾ̝ (andino alto, chileno)
a.ˈmohɾ (caribeño)
*/

// dézðe
assertEquals(to_ipa(`desde`), `ˈdes.de`)

});
