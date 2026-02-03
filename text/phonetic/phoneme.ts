// references
// https://www.rae.es/ortograf%C3%ADa/los-fonemas-voc%C3%A1licos
// https://www.rae.es/ortograf%C3%ADa/los-fonemas-conson%C3%A1nticos
// https://lenguaje.com/fonemas/
// https://github.com/nvaccess/espeak-ng/blob/46f935d9de69a528d938746635ed4a4fa918cf83/docs/phoneme_model.md

// TODO
// https://www.gramaticas.net/2014/07/fonetica-y-fonologia.html
// https://en.wikipedia.org/wiki/International_Phonetic_Alphabet

const PHONETIC_TYPE_VOWEL = "VOWEL";
const PHONETIC_TYPE_CONSONANT = "CONSONANT";

const PHONETICS_OPEN = "OPEN";
const PHONETICS_MIDDLE = "MIDDLE";
const PHONETICS_CLOSE = "CLOSE";

// labial
const PHONETIC_POA_LABIAL = "LABIAL";
// dental
const PHONETIC_POA_DENTAL = "DENTAL";
// alveolar
const PHONETIC_POA_ALVEOLAR = "ALVEOLAR";
// postalveolar
const PHONETIC_POA_POSTALVEOLAR = "POSTALVEOLAR";
// palatal
const PHONETIC_POA_PALATAL = "PALATAL";
// velar
const PHONETIC_POA_VELAR = "VELAR";
const PHONETIC_POA_UVULAR = "UVULAR";
const PHONETIC_POA_GLOTTAL = "GLOTTAL";

const PHONETIC_TARGET_NASAL = "NASAL";
const PHONETIC_TARGET_ORAL = "ORAL";

type PHONETIC_TYPE =
  | typeof PHONETIC_TYPE_CONSONANT
  | typeof PHONETIC_TYPE_VOWEL;

type PHONETIC_OPENING =
  | typeof PHONETICS_OPEN
  | typeof PHONETICS_MIDDLE
  | typeof PHONETICS_CLOSE;
/*
| bilabial              | `blb`     | `lbl`  | `ulp` |         |         |
| linguolabial          | `lgl`     | `lmn`  | `ulp` |         |         |
| labiodental           | `lbd`     | `lbl`  |       | `utt`   |         |
| bilabial-labiodental  | `bld`     | `bld`  | `ulp` | `utt`   |         |
| interdental           | `idt`     | `lmn`  |       | `utt`   |         |
| dental                | `dnt`     | `apc`  |       | `utt`   |         |
| denti-alveolar        | `dta`     | `lmn`  |       | `utt`   | `alf`   |
| alveolar              | `alv`     | `lmn`  |       |         | `alf`   |
| apico-alveolar        | `apa`     | `apc`  |       |         | `alf`   |
| palato-alveolar       | `pla`     | `lmn`  |       |         | `alb`   |
| apical retroflex      | `arf`     | `sac`  |       |         | `alb`   |
| retroflex             | `rfx`     | `apc`  |       |         | `hpl`   |
| alveolo-palatal       | `alp`     | `dsl`  |       |         | `alb`   |
| palatal               | `pal`     | `dsl`  |       |         | `hpl`   |
| velar                 | `vel`     | `dsl`  |       |         | `spl`   |
| labio-velar           | `lbv`     | `dsl`  | `ulp` |         | `spl`   |
| uvular                | `uvl`     | `dsl`  |       |         | `uvu`   |
| pharyngeal            | `phr`     | `rdl`  |       |         | `prx`   |
| epiglotto-pharyngeal  | `epp`     | `lyx`  |       |         | `prx`   |
| (ary-)epiglottal      | `epg`     | `lyx`  |       |         | `egs`   |
| glottal               | `glt`     | `lyx`  |       |         | `gts`   |
*/
type PHONETIC_PLACE_OF_ARTICULATION =
  | typeof PHONETIC_POA_LABIAL
  | typeof PHONETIC_POA_DENTAL
  | typeof PHONETIC_POA_ALVEOLAR
  | typeof PHONETIC_POA_POSTALVEOLAR
  | typeof PHONETIC_POA_PALATAL
  | typeof PHONETIC_POA_VELAR
  | typeof PHONETIC_POA_UVULAR
  | typeof PHONETIC_POA_GLOTTAL;

type PHONETIC_TARGET =
  | typeof PHONETIC_TARGET_NASAL
  | typeof PHONETIC_TARGET_ORAL;

/*
| Feature | Name        | Description                                                                       |
|---------|-------------|-----------------------------------------------------------------------------------|
| `occ`   | occlusive   | The air flow is blocked within the vocal tract.                                   |
| `frv`   | fricative   | The air flow is constricted, causing turbulence.                                  |
| `fla`   | flap        | A single tap of the tongue against the secondary articulator.                     |
| `tri`   | trill       | A rapid vibration of the primary articulator against the secondary articulator.   |
| `app`   | approximant | The vocal tract is narrowed at the place of articulation without being turbulant. |
| `vow`   | vowel       | The phoneme is articulated as a vowel instead of a consonant.                     |
*/
// aka STOP
const PHONETIC_MOA_OCCLUSIVE = "OCCLUSIVE";
// aka CONTINUANT
const PHONETIC_MOA_FRICATIVE = "FRICATIVE";
const PHONETIC_MOA_AFRICATIVE = "FRICATIVE";
const PHONETIC_MOA_FLAP = "FLAP";
const PHONETIC_MOA_TAP = "TAP";
const PHONETIC_MOA_TRILL = "TRILL";
const PHONETIC_MOA_APPROXIMANT = "APPROXIMANT";
const PHONETIC_MOA_VOWEL_OPEN = "VOWEL_OPEN";
const PHONETIC_MOA_VOWEL_HALF = "VOWEL_HALF";
const PHONETIC_MOA_VOWEL_CLOSE = "VOWEL_CLOSE";

type PHONETIC_MANNER_OF_ARTICULATION =
  | typeof PHONETIC_MOA_OCCLUSIVE
  | typeof PHONETIC_MOA_FRICATIVE
  | typeof PHONETIC_MOA_AFRICATIVE
  | typeof PHONETIC_MOA_TAP
  | typeof PHONETIC_MOA_FLAP
  | typeof PHONETIC_MOA_TRILL
  | typeof PHONETIC_MOA_APPROXIMANT
  | typeof PHONETIC_MOA_VOWEL_OPEN
  | typeof PHONETIC_MOA_VOWEL_HALF
  | typeof PHONETIC_MOA_VOWEL_CLOSE;

const PHONETIC_VH_CLOSE = "CLOSE";
const PHONETIC_VH_NEAR_CLOSE = "NEAR_CLOSE";
const PHONETIC_VH_CLOSE_MID = "CLOSE_MID";
const PHONETIC_VH_MID = "MID";
const PHONETIC_VH_OPEN_MID = "OPEN_MID";
const PHONETIC_VH_NEAR_OPEN = "NEAR_OPEN";
const PHONETIC_VH_OPEN = "OPEN";

type PHONETIC_VOWEL_HEIGHT =
  | typeof PHONETIC_VH_CLOSE
  | typeof PHONETIC_VH_NEAR_CLOSE
  | typeof PHONETIC_VH_CLOSE_MID
  | typeof PHONETIC_VH_MID
  | typeof PHONETIC_VH_OPEN_MID
  | typeof PHONETIC_VH_NEAR_OPEN
  | typeof PHONETIC_VH_OPEN;

const PHONETIC_VB_FRONT = "FRONT";
const PHONETIC_VB_CENTRAL = "CENTRAL";
const PHONETIC_VB_BACK = "BACK";

type PHONETIC_VOWEL_BACKNESS =
  | typeof PHONETIC_VB_FRONT
  | typeof PHONETIC_VB_CENTRAL
  | typeof PHONETIC_VB_BACK;

/*
Feature	Name
hgh	close (high)
smh	near-close (semi-high)
umd	close-mid (upper-mid)
mid	mid
lmd	open-mid (lower-mid)
sml	near-open (semi-low)
low	open (low)
*/

interface PhoneticConsonant {
  phoneme: string;
  graphemes: string[];
  type: typeof PHONETIC_TYPE_CONSONANT;
  opening?: PHONETIC_OPENING;
  plaaceOfArticulation: PHONETIC_PLACE_OF_ARTICULATION;
  mannerOfArticulation: PHONETIC_MANNER_OF_ARTICULATION;
  target: PHONETIC_TARGET;
}

interface PhoneticVowel {
  phoneme: string;
  graphemes: string[];
  type: typeof PHONETIC_TYPE_VOWEL;

  vowelHeight: PHONETIC_VOWEL_HEIGHT;
  vowelBackness: PHONETIC_VOWEL_BACKNESS;
}

//interface Phonetic {}
type Phonetic = PhoneticConsonant | PhoneticVowel;

// https://en.wikipedia.org/wiki/International_Phonetic_Alphabet#Vowels
// https://www.rae.es/ortograf%C3%ADa/los-fonemas-voc%C3%A1licos
// https://course.happyhourspanish.com/lessons/the-ipa-phonetics-chart-for-spanish/
const VOWELS: Phonetic[] = [
  {
    // /a/: vocal, abierta o baja.
    // /a/	a	abierto	central
    phoneme: "a",
    graphemes: ["a"],
    type: PHONETIC_TYPE_VOWEL,
    vowelHeight: PHONETIC_VH_OPEN,
    vowelBackness: PHONETIC_VB_CENTRAL,
  },
  {
    // /e/: vocal, media, anterior o palatal;
    // /e/	e	medio	anterior
    phoneme: "e",
    graphemes: ["e"],
    type: PHONETIC_TYPE_VOWEL,
    vowelHeight: PHONETIC_VH_CLOSE_MID,
    vowelBackness: PHONETIC_VB_FRONT,
  },
  {
    // /i/: vocal, cerrada o alta, anterior o palatal;
    // /i/	i	cerrado	anterior
    phoneme: "i",
    graphemes: ["i"],
    type: PHONETIC_TYPE_VOWEL,
    vowelHeight: PHONETIC_VH_CLOSE,
    vowelBackness: PHONETIC_VB_FRONT,
  },
  {
    // /o/: vocal, media, posterior o velar;
    // /o/	o	medio	posterior
    phoneme: "o",
    graphemes: ["o"],
    type: PHONETIC_TYPE_VOWEL,
    vowelHeight: PHONETIC_VH_CLOSE_MID,
    vowelBackness: PHONETIC_VB_BACK,
  },
  {
    // /u/: vocal, cerrada o alta, posterior o velar;
    // /u/	u	cerrado	posterior
    phoneme: "u",
    graphemes: ["u"],
    type: PHONETIC_TYPE_VOWEL,
    vowelHeight: PHONETIC_VH_CLOSE,
    vowelBackness: PHONETIC_VB_BACK,
  },
];
// https://en.wikipedia.org/wiki/Help:IPA/Spanish
// https://en.wikipedia.org/wiki/Spanish_phonology
const CONSONANTS: Phonetic[] = [
  {
    // /f/: consonante, obstruyente, fricativa, labial [labiodental], sorda;
    // /f/	f	fricativo	labiodental	sordo	oral
    phoneme: "f",
    graphemes: ["f"],
    type: PHONETIC_TYPE_CONSONANT,
    plaaceOfArticulation: PHONETIC_POA_LABIAL,
    target: PHONETIC_TARGET_ORAL,
    mannerOfArticulation: PHONETIC_MOA_FRICATIVE,
  },
  {
    // /z/: consonante, obstruyente, fricativa, dental [interdental], sorda;
    // /θ/	c, z	fricativo	interdental	sordo	oral
    phoneme: "θ", // south america s
    graphemes: ["c", "z"],
    type: PHONETIC_TYPE_CONSONANT,
    mannerOfArticulation: PHONETIC_MOA_FRICATIVE,
    plaaceOfArticulation: PHONETIC_POA_DENTAL,
    target: PHONETIC_TARGET_ORAL,
  },
  {
    // /s/: consonante, obstruyente, fricativa, alveolar (en las zonas donde coexiste con el fonema /z/) odental-alveolar (en las áreas donde no existe el fonema /z/; v. § 4.2.1.1), sorda;
    // /s/	c, s, z, x	fricativo	alveolar	sordo	oral
    phoneme: "s",
    graphemes: ["c", "s", "z", "x"],
    type: PHONETIC_TYPE_CONSONANT,
    plaaceOfArticulation: PHONETIC_POA_ALVEOLAR, // alveolar (en las zonas donde coexiste con el fonema /z/) odental-alveolar (en las áreas donde no existe el fonema /z/; v. § 4.2.1.1), sorda;
    mannerOfArticulation: PHONETIC_MOA_FRICATIVE,
    target: PHONETIC_TARGET_ORAL,
  },
  {
    // /j/: consonante, obstruyente, fricativa, velar, sorda;
    // /x/	g, j, h	fricativo	velar	sordo	oral
    phoneme: "x",
    graphemes: ["g", "j", "h"],
    type: PHONETIC_TYPE_CONSONANT,
    plaaceOfArticulation: PHONETIC_POA_VELAR,
    mannerOfArticulation: PHONETIC_MOA_FRICATIVE,
    target: PHONETIC_TARGET_ORAL,
  },
  {
    // /p/: consonante, obstruyente, oclusiva, labial [bilabial], sorda;
    // /p/	p	oclusivo	bilabial	sordo	oral
    phoneme: "p",
    graphemes: ["p"],
    type: PHONETIC_TYPE_CONSONANT,
    plaaceOfArticulation: PHONETIC_POA_LABIAL,
    mannerOfArticulation: PHONETIC_MOA_OCCLUSIVE,
    target: PHONETIC_TARGET_ORAL,
  },
  {
    // /t/: consonante, obstruyente, oclusiva, dental, sorda;
    // /t/	t	oclusivo	dental	sordo	oral
    phoneme: "t",
    graphemes: ["t"],
    type: PHONETIC_TYPE_CONSONANT,
    plaaceOfArticulation: PHONETIC_POA_DENTAL,
    mannerOfArticulation: PHONETIC_MOA_OCCLUSIVE,
    target: PHONETIC_TARGET_ORAL,
  },
  {
    // /ch/: consonante, obstruyente, africada, palatal, sorda;
    // /ʧ/	ch	africado	palatal	sordo	oral
    phoneme: "ʧ", // tʃ
    graphemes: ["ch"],
    type: PHONETIC_TYPE_CONSONANT,
    plaaceOfArticulation: PHONETIC_POA_PALATAL,
    mannerOfArticulation: PHONETIC_MOA_AFRICATIVE,
    target: PHONETIC_TARGET_ORAL,
  },
  {
    // /k/: consonante, obstruyente, oclusiva, velar, sorda;
    // /k/	c, k, q, qu	oclusivo	velar	sordo	oral
    phoneme: "k",
    graphemes: ["c", "k", "q", "qu"],
    type: PHONETIC_TYPE_CONSONANT,
    plaaceOfArticulation: PHONETIC_POA_VELAR,
    mannerOfArticulation: PHONETIC_MOA_OCCLUSIVE,
    target: PHONETIC_TARGET_ORAL,
  },
  {
    // /b/: consonante, obstruyente, labial [bilabial], sonora;
    // /b/	b, v, w	oclusivo	bilabial	sonoro	oral
    phoneme: "b",
    graphemes: ["b", "v", "w"],
    type: PHONETIC_TYPE_CONSONANT,
    plaaceOfArticulation: PHONETIC_POA_LABIAL,
    mannerOfArticulation: PHONETIC_MOA_OCCLUSIVE,
    target: PHONETIC_TARGET_ORAL,
  },
  {
    // /d/: consonante, obstruyente, dental, sonora;
    // /d/	d	oclusivo	dental	sonoro	oral
    phoneme: "d",
    graphemes: ["d"],
    type: PHONETIC_TYPE_CONSONANT,
    plaaceOfArticulation: PHONETIC_POA_DENTAL,
    mannerOfArticulation: PHONETIC_MOA_OCCLUSIVE,
    target: PHONETIC_TARGET_ORAL,
  },
  {
    // https://en.wikipedia.org/wiki/Voiced_palatal_approximant
    // /y/: consonante, obstruyente, palatal, sonora;
    // /ʝ/	y, ll	fricativo	palatal	sonoro	oral
    phoneme: "ʝ",
    graphemes: ["y", "ll"],
    type: PHONETIC_TYPE_CONSONANT,
    plaaceOfArticulation: PHONETIC_POA_PALATAL,
    mannerOfArticulation: PHONETIC_MOA_APPROXIMANT,
    target: PHONETIC_TARGET_ORAL,
  },
  {
    // /g/: consonante, obstruyente, velar, sonora;
    // /g/	g, gu	oclusivo	velar	sonoro	oral
    phoneme: "g",
    graphemes: ["g", "gu"],
    type: PHONETIC_TYPE_CONSONANT,
    plaaceOfArticulation: PHONETIC_POA_VELAR,
    mannerOfArticulation: PHONETIC_MOA_OCCLUSIVE,
    target: PHONETIC_TARGET_ORAL,
  },
  {
    // /m/: consonante, sonante, nasal, labial [bilabial];
    // /m/	m	oclusivo	bilabial	sonoro	nasal
    phoneme: "m",
    graphemes: ["m"],
    type: PHONETIC_TYPE_CONSONANT,
    plaaceOfArticulation: PHONETIC_POA_LABIAL,
    mannerOfArticulation: PHONETIC_MOA_OCCLUSIVE,
    target: PHONETIC_TARGET_NASAL,
  },
  {
    // /n/: consonante, sonante, nasal, alveolar;
    // /n/	n	oclusivo	alveolar	sonoro	nasal
    phoneme: "n",
    graphemes: ["n"],
    type: PHONETIC_TYPE_CONSONANT,
    plaaceOfArticulation: PHONETIC_POA_ALVEOLAR,
    mannerOfArticulation: PHONETIC_MOA_OCCLUSIVE,
    target: PHONETIC_TARGET_NASAL,
  },
  {
    // /ñ/: consonante, sonante, nasal, palatal;
    // /ɲ/	ñ	oclusivo	palatal	sonoro	nasal
    phoneme: "ɲ",
    graphemes: ["ñ"],
    type: PHONETIC_TYPE_CONSONANT,
    plaaceOfArticulation: PHONETIC_POA_PALATAL,
    mannerOfArticulation: PHONETIC_MOA_OCCLUSIVE,
    target: PHONETIC_TARGET_NASAL,
  },
  {
    // https://en.wikipedia.org/wiki/Voiced_dental,_alveolar_and_postalveolar_lateral_approximants
    // /l/	l	lateral	alveolar	sonoro	oral
    // /l/: consonante, sonante, oral, lateral, z;
    phoneme: "l",
    graphemes: ["l"],
    type: PHONETIC_TYPE_CONSONANT,
    plaaceOfArticulation: PHONETIC_POA_ALVEOLAR,
    mannerOfArticulation: PHONETIC_MOA_APPROXIMANT,
    target: PHONETIC_TARGET_ORAL,
  },
  {
    // /ll/: consonante, sonante, oral, lateral, palatal;
    // /ʎ/	ll	lateral	palatal	sonoro	oral
    phoneme: "ʎ",
    graphemes: ["ll"],
    type: PHONETIC_TYPE_CONSONANT,
    plaaceOfArticulation: PHONETIC_POA_PALATAL,
    mannerOfArticulation: PHONETIC_MOA_APPROXIMANT,
    target: PHONETIC_TARGET_ORAL,
  },
  {
    // https://en.wikipedia.org/wiki/Voiced_dental_and_alveolar_taps_and_flaps
    // /r/: consonante, sonante, oral, vibrante, simple;
    // /ɾ/	r	vibrante simple	alveolar	sonoro	oral
    phoneme: "ɾ",
    graphemes: ["r"],
    type: PHONETIC_TYPE_CONSONANT,
    plaaceOfArticulation: PHONETIC_POA_ALVEOLAR,
    mannerOfArticulation: PHONETIC_MOA_TAP,
    target: PHONETIC_TARGET_ORAL,
  },
  {
    // https://en.wikipedia.org/wiki/Voiced_dental,_alveolar_and_postalveolar_trills#Voiced_alveolar_trill
    // /rr/: consonante, sonante, oral, vibrante, múltiple.
    // /r/	r, rr	vibrante múltiple	alveolar	sonoro	oral
    phoneme: "r",
    graphemes: ["rr", "r"],
    type: PHONETIC_TYPE_CONSONANT,
    plaaceOfArticulation: PHONETIC_POA_ALVEOLAR,
    mannerOfArticulation: PHONETIC_MOA_TRILL,
    target: PHONETIC_TARGET_ORAL,
  },
];
