import { assertEquals, assertThrows } from "jsr:@std/assert";
import { to_plural } from "./to_plural.ts";

Deno.test("to_plural", () => {
  assertThrows(() => {
    to_plural("y");
  }, "not a name or adjetive");

  // a) Sustantivos y adjetivos terminados en vocal átona o en -e tónica. Forman el plural con -s: casas, estudiantes, taxis, planos, tribus, comités. Son vulgares los plurales terminados en -ses, como ⊗‍cafeses, en lugar de cafés, o ⊗‍pieses, en lugar de pies.
  assertEquals(to_plural("casa"), ["casas"]);
  assertEquals(to_plural("casas"), ["casas"]);
  assertEquals(to_plural("estudiante"), ["estudiantes"]);
  assertEquals(to_plural("estudiantes"), ["estudiantes"]);
  assertEquals(to_plural("taxi"), ["taxis"]);
  assertEquals(to_plural("taxis"), ["taxis"]);
  assertEquals(to_plural("plano"), ["planos"]);
  assertEquals(to_plural("planos"), ["planos"]);
  assertEquals(to_plural("tribu"), ["tribus"]);
  assertEquals(to_plural("tribus"), ["tribus"]);
  assertEquals(to_plural("comité"), ["comités"]);
  assertEquals(to_plural("pié"), ["piés"]);

  // b) Sustantivos y adjetivos terminados en -a o en -o tónicas. Aunque durante algún tiempo vacilaron entre el plural en -s y el plural en -es, en la actualidad forman el plural únicamente con -s: papás, sofás, bajás, burós, rococós, dominós. Son excepción a esta regla los sustantivos faralá y albalá, y el adverbio no en función sustantiva, que forman el plural con -es: faralaes, albalaes, noes. También es excepción el pronombre yo cuando funciona como sustantivo, pues admite ambos plurales: yoes y yos. Son vulgares los plurales terminados en -ses, como ⊗‍sofases.
  assertEquals(to_plural("papá"), ["papás"]);
  assertEquals(to_plural("dominó"), ["dominós"]);

  // c) Sustantivos y adjetivos terminados en -i o en -u tónicas. Admiten generalmente dos formas de plural, una con -es y otra con -s, aunque en la lengua culta suele preferirse la primera: bisturíes o bisturís, carmesíes o carmesís, tisúes o tisús, tabúes o tabús. En los gentilicios, aunque no se consideran incorrectos los plurales en -s, se utilizan casi exclusivamente en la lengua culta los plurales en -es: israelíes, marroquíes, hindúes, bantúes. Por otra parte, hay voces, generalmente las procedentes de otras lenguas o las que pertenecen a registros coloquiales o populares, que solo forman el plural con -s: gachís, pirulís, popurrís, champús, menús, tutús, vermús. El plural del adverbio sí, cuando funciona como sustantivo, es síes, a diferencia de lo que ocurre con la nota musical si, cuyo plural es sis (→ 1). Son vulgares los plurales terminados en -ses, como ⊗‍gachises.
  assertEquals(to_plural("bisturí"), ["bisturís", "bisturíes"]);
  assertEquals(to_plural("carmesí"), ["carmesís", "carmesíes"]);

  // d) Sustantivos y adjetivos terminados en -y precedida de vocal. Forman tradicionalmente su plural con -es: rey, pl. reyes; ley, pl. leyes; buey, pl. bueyes; ay, pl. ayes; convoy, pl. convoyes; bocoy, pl. bocoyes. Sin embargo, los sustantivos y adjetivos con esta misma configuración que se han incorporado al uso más recientemente ―en su mayoría palabras tomadas de otras lenguas― hacen su plural en -s. En ese caso, la y del singular mantiene en plural su carácter vocálico y, por lo tanto, debe pasar a escribirse i (→ y1, 2.2.d): gay, pl. gais; jersey, pl. jerséis; espray, pl. espráis; yóquey, pl. yoqueis. Pertenecen a la etapa de transición entre ambas normas y admiten, por ello, ambos plurales las palabras coy, pl. coyes o cois; estay, pl. estayes o estáis; noray, pl. norayes o noráis; guirigay, pl. guirigayes o guirigáis, con preferencia hoy por las formas con -s. Son vulgares los plurales terminados en -ses, como ⊗‍jerseises.
  assertEquals(to_plural("ley"), ["leyes"]);
  assertEquals(to_plural("buey"), ["bueyes"]);

  // e) Voces extranjeras terminadas en -y precedida de consonante. Deben adaptarse gráficamente al español sustituyendo la -y por -i: dandi (del ingl. dandy); panti (del ingl. panty); ferri (del ingl. ferry). Su plural se forma, como el de las palabras españolas con esta terminación (→ 1.a), añadiendo una -s: dandis, pantis, ferris. No son admisibles, por tanto, los plurales que conservan la -y del singular etimológico: ⊗‍dandys, ⊗‍pantys, ⊗‍ferrys.
  assertEquals(to_plural("dandi"), ["dandis"]);
  assertEquals(to_plural("panti"), ["pantis"]);
  assertEquals(to_plural("ferri"), ["ferris"]);

  assertEquals(to_plural("dandy"), ["dandis"]);

  // f) Sustantivos y adjetivos terminados en -s o en -x. Si son monosílabos o polisílabos agudos, forman el plural añadiendo -es: tos, pl. toses; vals, pl. valses, fax, pl. faxes; compás, pl. compases; francés, pl. franceses. En el resto de los casos, permanecen invariables: crisis, pl. crisis; tórax, pl. tórax; fórceps, pl. fórceps. Es excepción a esta regla la palabra dux, que, aun siendo monosílaba, es invariable en plural: los dux. También permanecen invariables los polisílabos agudos cuando se trata de voces compuestas cuyo segundo elemento es ya un plural: ciempiés, pl. ciempiés (no ⊗‍ciempieses); buscapiés, pl. buscapiés (no ⊗‍buscapieses); pasapurés, pl. pasapurés (no ⊗‍pasapureses).

  assertEquals(to_plural("tos"), ["toses"]);
  assertEquals(to_plural("vals"), ["valses"]);
  assertEquals(to_plural("compás"), ["compases"]);
  assertEquals(to_plural("francés"), ["franceses"]);

  assertEquals(to_plural("crisis"), ["crisis"]);
  assertEquals(to_plural("tórax"), ["tórax"]);
  assertEquals(to_plural("fórceps"), ["fórceps"]);

  // TODO También permanecen invariables los polisílabos agudos cuando se trata de voces compuestas cuyo segundo elemento es ya un plural
  //assertEquals(get_plural("ciempiés"), ["ciempiés"])

  // g) Sustantivos y adjetivos terminados en -l, -r, -n, -d, -z, -j. Si no van precedidas de otra consonante (→ 1.j), forman el plural con -es: dócil, pl. dóciles; color, pl. colores; pan, pl. panes; césped, pl. céspedes; cáliz, pl. cálices; reloj, pl. relojes. Los extranjerismos que terminen en estas consonantes deben seguir esta misma regla: píxel, pl. píxeles; máster, pl. másteres; pin, pl. pines; interfaz, pl. interfaces; sij, pl. sijes. Son excepción las palabras esdrújulas, que permanecen invariables en plural: polisíndeton, pl. (los) polisíndeton; trávelin, pl. (los) trávelin; cáterin, pl. (los) cáterin. Excepcionalmente, hipérbaton presenta, además del plural invariable (los) hipérbaton, el irregular hipérbatos (→ hipérbaton). No son invariables régimen, pl. regímenes, ni espécimen, pl. especímenes, ambos con cambio de la vocal tónica (→ 2.1).
  assertEquals(to_plural("dócil"), ["dóciles"]);
  assertEquals(to_plural("color"), ["colores"]);
  assertEquals(to_plural("cáliz"), ["cálices"]);
  assertEquals(to_plural("césped"), ["céspedes"]);
  assertEquals(to_plural("reloj"), ["relojes"]);
  assertEquals(to_plural("píxel"), ["píxeles"]);
  assertEquals(to_plural("máster"), ["másteres"]);
  assertEquals(to_plural("interfaz"), ["interfaces"]);

  // h) Sustantivos y adjetivos terminados en consonantes distintas de -l, -r, -n, -d, -z, -j, -s, -x, -ch. Se trate de onomatopeyas o de voces procedentes de otras lenguas, hacen el plural en -s: crac, pl. cracs; zigzag, pl. zigzags; esnob, pl. esnobs; chip, pl. chips; mamut, pl. mamuts; cómic, pl. cómics. Se exceptúa de esta regla la palabra club, que admite dos plurales, clubs y clubes (→ club). También son excepciones el arabismo imam (→ imán), cuyo plural asentado es imames, y el latinismo álbum (→ álbum), cuyo plural asentado es álbumes.
  assertEquals(to_plural("crac"), ["cracs"]);
  assertEquals(to_plural("zigzag"), ["zigzags"]);
  assertEquals(to_plural("esnob"), ["esnobs"]);
  assertEquals(to_plural("mamut"), ["mamuts"]);
  assertEquals(to_plural("cómic"), ["cómics"]);

  assertEquals(to_plural("iman"), ["imanes"]);
  assertEquals(to_plural("álbum"), ["álbumes"]);

  // i) Sustantivos y adjetivos terminados en -ch. Procedentes todos ellos de otras lenguas, o bien se mantienen invariables en plural: (los) crómlech, (los) zarévich, (los) pech, o bien hacen el plural en -es: sándwich, pl. sándwiches; maquech, pl. maqueches.

  // rule about usage: can be used as singular or plural, but plural is what it is.
  assertEquals(to_plural("sándwich"), ["sándwiches"]);
  assertEquals(to_plural("maquech"), ["maqueches"]);
  assertEquals(to_plural("crómlech"), ["crómleches"]);

  // j) Sustantivos y adjetivos terminados en grupo consonántico. Procedentes todos ellos de otras lenguas, forman el plural con -s (salvo aquellos que terminan ya en -s, que siguen la regla general; → 1.f): gong, pl. gongs; iceberg, pl. icebergs; récord, pl. récords. Se exceptúan de esta norma las voces compost, karst, test, trust y kibutz, que permanecen invariables en plural, pues la adición de una -s en estos casos daría lugar a una secuencia de difícil articulación en español. También son excepción los anglicismos lord y milord, cuyo plural asentado en español es lores y milores, respectivamente.
  assertEquals(to_plural("gong"), ["gongs"]);
  assertEquals(to_plural("iceberg"), ["icebergs"]);
  assertEquals(to_plural("récord"), ["récords"]);

  // exceptions
  assertEquals(to_plural("compost"), ["compost"]);
  assertEquals(to_plural("karst"), ["karst"]);
  assertEquals(to_plural("test"), ["test"]);
  assertEquals(to_plural("trust"), ["trust"]);
  assertEquals(to_plural("kibutz"), ["kibutz"]);

  assertEquals(to_plural("lord"), ["lores"]);
  assertEquals(to_plural("milord"), ["milores"]);

  // k) Plural de los latinismos. Aunque tradicionalmente se venía recomendando mantener invariables en plural ciertos latinismos terminados en consonante, muchos de ellos se han acomodado ya, en el uso mayoritario, a las reglas de formación del plural que rigen para el resto de las palabras y que han sido expuestas en los párrafos anteriores. Así pues, y como norma general, los latinismos hacen el plural en -s, en -es o quedan invariables dependiendo de sus características formales, al igual que ocurre con el resto de los préstamos de otras lenguas: ratio, pl. ratios; plus, pl. pluses; lapsus, pl. lapsus; nomenclátor, pl. nomenclátores; déficit, pl. déficits; hábitat, pl. hábitats; vademécum, pl. vademécums; ítem, pl. ítems. Únicamente se apartan hoy de esta tendencia mayoritaria los latinismos terminados en -r procedentes de formas verbales, como cónfer, confíteor, exequátur e imprimátur, cuyo plural sigue siendo invariable. También constituye una excepción la palabra álbum (→ 1.h). En general, se aconseja usar con preferencia, cuando existan, las variantes hispanizadas de los latinismos y, consecuentemente, también su plural; así se usará armonio (pl. armonios) mejor que armónium; currículo (pl. currículos) mejor que currículum; podio (pl. podios) mejor que pódium. No deben usarse en español los plurales latinos en -a propios de los sustantivos neutros, tales como ⊗‍córpora, ⊗‍currícula, etc., que sí son normales en otras lenguas como el inglés. Las locuciones latinas, a diferencia de los latinismos simples, permanecen siempre invariables en plural: los statu quo, los currículum vítae, los mea culpa.
  assertEquals(to_plural("ratio"), ["ratios"]);
  assertEquals(to_plural("plus"), ["pluses"]);
  assertEquals(to_plural("lapsus"), ["lapsus"]);
  assertEquals(to_plural("nomenclátor"), ["nomenclátores"]);
  // TODO
  //assertEquals(get_plural("déficit"), ["déficits"])
  //assertEquals(get_plural("hábitat"), ["hábitats"])
  //assertEquals(get_plural("vademécum"), ["vademécums"])
  //assertEquals(get_plural("ítem"), ["ítems"])

  // 2. Otras cuestiones relativas al plural
  // 2.1. Cambio de la vocal tónica. La vocal tónica es la misma en el singular y en el plural, salvo en las palabras espécimen, régimen y carácter, en las que el acento cambia de lugar en el plural: especímenes, regímenes y caracteres  [karaktéres]. Además, aunque para ilion e isquion existen los plurales regulares íliones e ísquiones, los más usados son iliones e isquiones, con cambio de la vocal tónica con respecto al singular (→ ilion o ilión; isquion o isquión).

  assertEquals(to_plural("espécimen"), ["especímenes"]);
  assertEquals(to_plural("régimen"), ["regímenes"]);
  assertEquals(to_plural("carácter"), ["caracteres"]);

  // 2.2. Nombres de tribus o etnias. No hay ninguna razón lingüística para que los nombres de tribus o etnias permanezcan invariables en plural; así pues, estas palabras formarán su plural de acuerdo con sus características formales y según las reglas generales (→ 1): los mandingas, los masáis, los mapuches, los hutus, los tutsis, los yanomamis, los bantúes, los guaraníes, los iroqueses, los patagones, los tuaregs.

  // lucky!
  assertEquals(to_plural("mandingas"), ["mandingas"]);
  //assertEquals(get_plural("masáis"), ["masáis"])
  assertEquals(to_plural("mapuches"), ["mapuches"]);
  assertEquals(to_plural("hutus"), ["hutus"]);
  assertEquals(to_plural("tutsis"), ["tutsis"]);
  assertEquals(to_plural("yanomamis"), ["yanomamis"]);
  assertEquals(to_plural("bantúes"), ["bantúes"]);
  assertEquals(to_plural("guaraníes"), ["guaraníes"]);
  assertEquals(to_plural("iroqueses"), ["iroqueses"]);
  assertEquals(to_plural("patagones"), ["patagones"]);
  //assertEquals(get_plural("tuaregs"), ["tuaregs"])

  // 2.3. Nombres de color. → colores, 2.
  // ignore, is about plural usage

  // 2.4. Unidades léxicas formadas por dos sustantivos. En las construcciones nominales formadas por dos sustantivos, de los que el segundo actúa como modificador del primero, solo el primer sustantivo lleva marca de plural: horas punta, bombas lapa, faldas pantalón, ciudades dormitorio, pisos piloto, coches cama, hombres rana, niños prodigio, noticias bomba, sofás cama, mujeres objeto, coches bomba, casas cuartel. Igual ocurre en los compuestos ocasionales de este tipo, que se escriben con guion (→ guion2, 1.3.a): «Los dos nuevos edificios eran “viviendas-puente” […]. Servían para alojar durante dos años ―el tiempo que tardaba la Administración en hacer casas nuevas― a las familias que perdían sus pisos por grietas» (País@ [Esp.] 7.3.2000). Pero, si el segundo sustantivo puede funcionar, con el mismo valor, como atributo del primero en oraciones copulativas, tiende a tomar también la marca de plural: Estados miembros, países satélites, empresas líderes, palabras claves (pues puede decirse Estos estados son miembros de la UE; Esos países fueron satélites de la Unión Soviética; Esas empresas son líderes en su sector; Estas palabras son claves para entender el asunto).
  // ignore, is about plural usage

  // 2.5. Sustantivos que se usan en singular o en plural para designar un solo objeto. Hay sustantivos que, por designar objetos constituidos por partes simétricas, se usan normalmente en plural para referirse a uno solo de dichos objetos. Es el caso de palabras como gafas, pantalones, bragas, leotardos, tenazas, alicates, tijeras, etc.: Me encantan los pantalones que llevaste a la fiesta; Le rompió las gafas de un puñetazo; Necesito unas tenazas para sacar el clavo. En estos casos resulta igualmente válido, aunque suele ser menos frecuente, el empleo de la forma de singular: Me he manchado el pantalón; Esa gafa te favorece; Tráeme la tenaza que está sobre la mesa. Hay otros casos, como el de bigote o nariz, en que se usa normalmente el singular, reservándose el plural para usos expresivos: Me he afeitado el bigote; Me duele la nariz; pero Se atusaba los bigotes con parsimonia; Tiene unas narices enormes. En las expresiones fijas suele predominar el uso en plural: Estoy hasta las narices; La cosa tiene narices; Hace un frío de narices.
  // ignore, is about plural usage

  // 2.6. Adjetivos formados por prefijo + sustantivo. Los adjetivos formados por la adición de un prefijo a un sustantivo son invariables en plural: faros antiniebla (no ⊗‍faros antinieblas), máscaras antigás (no ⊗‍máscaras antigases), sistemas multifrecuencia (no ⊗‍sistemas multifrecuencias). Algunos de estos adjetivos tienen como base un sustantivo plural, de ahí que presenten una -s final tanto en singular como en plural: policía antidisturbios, policías antidisturbios. Otros tienen dos formas admitidas, una con -s y otra sin -s, válidas tanto para el singular como para el plural: mina o minas antipersona, mina o minas antipersonas.
  // ignore, is about plural usage

  // 2.7. Compuestos formados por dos adjetivos unidos con guion. → guion2, 1.2.
  // out of scope

  assertThrows(() => {
    to_plural("italo-&parlante");
  }, "invalid string");

  // 2.8. Nombres propios. Puesto que los nombres propios, a diferencia de los comunes, no designan clases de seres, sino que sirven para identificar un solo ser de entre los de su clase, no suelen emplearse en plural. Sin embargo, al existir seres que comparten el mismo nombre propio, sí cabe usar este en plural para designar varios referentes: Los Javieres que conozco son todos muy simpáticos; En América hay dos Córdobas, una en la Argentina y otra en México. Al respecto, conviene tener en cuenta lo siguiente:
  // usage of plural
  assertEquals(to_plural("Córdoba"), ["Córdobas"]);

  // 2.9. Los nombres de pila hacen el plural de acuerdo con las reglas generales (→ 1): las Pilares, las Cármenes, los Pablos, los Raúles, los Andreses.

  assertEquals(to_plural("pilar"), ["pilares"]);
  assertEquals(to_plural("cármen"), ["cármenes"]);
  assertEquals(to_plural("Raúl"), ["Raúles"]);
  //assertEquals(get_plural("andres"), ["andreses"]) // nombre de pila, terminado en "s" -> "es"

  // 2.10. Los apellidos se mantienen invariables cuando designan a los miembros de una misma familia: Mañana cenamos en casa de los García; Los Alcover se han ido a vivir a Quito. Cuando se emplean para designar un conjunto diverso de individuos que tienen el mismo apellido, el uso vacila entre mantenerlos invariables o añadirles las marcas propias del plural de acuerdo con su forma. La tendencia mayoritaria es mantenerlos invariables, sobre todo en el caso de apellidos que pueden ser también nombres de pila, para distinguir ambos usos: Los Alonsos de mi clase son muy simpáticos (nombre de pila) y Los Alonso de mi clase son muy simpáticos (apellido); o cuando se trata de apellidos que tienen variantes con -s y sin -s, como Torre(s), Puente(s) o Fuente(s): En mi pueblo hay muchos Puente (gente apellidada Puente) y En mi pueblo hay muchos Puentes (gente apellidada Puentes). Salvo en estos casos, los que terminan en vocal admiten con más naturalidad las marcas de plural que los que acaban en consonante: En la guía telefónica hay muchísimos Garcías (pero también hay muchísimos García), frente a ¿Cuántos Pimentel conoces? (más normal que ¿Cuántos Pimenteles conoces?). Los apellidos que acaban en -z se mantienen siempre invariables: los Hernández, los Díez.
  assertEquals(to_plural("garcía"), ["garcías"]);
  // assertEquals(spanish_plural("diéz"), ["Díez"]) // apellidos terminados en "z"

  // 2.11. Los nombres de dinastías o de familias notorias también vacilan. La mayoría tienden a permanecer invariables: los Habsburgo, los Trastámara, los Tudor, los Borgia; pero otros se usan casi siempre con marcas de plural: los Borbones, los Austrias, los Capuletos.
  // plural shall find the plural, it's usage is up to the user
  assertEquals(to_plural("Habsburgo"), ["Habsburgos"]);
  assertEquals(to_plural("Trastámara"), ["Trastámaras"]);
  assertEquals(to_plural("Tudor"), ["Tudores"]);
  assertEquals(to_plural("Borgia"), ["Borgias"]);
  assertEquals(to_plural("borbon"), ["borbones"]);

  // 2.12. Cuando se usa una marca comercial para designar varios objetos fabricados por dicha marca, si el nombre termina en vocal, suele usarse con la terminación -s característica del plural, mientras que, si termina en consonante, tiende a permanecer invariable: Hay tres Yamahas aparcadas en la puerta; Los Opel tienen un motor muy resistente. Lo mismo ocurre con los nombres de empresas, cuando designan varios de sus establecimientos: Últimamente han abierto muchos Zaras en el extranjero; Hay dos Benetton en Salamanca. Si el nombre es compuesto, permanece invariable: Los nuevos Corte Inglés de la ciudad son muy grandes.
  // mostly about usage not rules
  assertEquals(to_plural("Yamaha"), ["Yamahas"]);

  // plural -> plural ?
  //assertEquals(get_plural("comités"), ["comités"])
  //assertEquals(get_plural("dominós"), ["dominós"])
});
