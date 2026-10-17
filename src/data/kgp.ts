/**
 * Kanoniczne dane Korony Gór Polski + logika filtrów.
 *
 * Jedno źródło prawdy dla:
 *  - `src/pages/kgp/[widok].astro` (strony zbiorcze)
 *  - `src/pages/kgp/index.astro`
 *  - `src/pages/sitemap.xml.ts`
 *  - `src/pages/index.astro` (filtry na stronie głównej)
 *
 * Lista 28 szczytów jest potrzebna osobno od kolekcji `szczyty`, bo repo ma
 * relacje tylko z części szczytów — a zestawienia mają pokazywać pełną
 * Koronę (28 pozycji), linkując tylko tam, gdzie relacja faktycznie jest.
 */

export type KgpSzczyt = {
  kolejnosc: number;
  nazwa: string;
  wysokosc: number;
  pasmo: string;
};

/** Pełna KGP, rosnąco wg wysokości. `kolejnosc` = ta sama wartość co w frontmatterze. */
export const KGP_LISTA: readonly KgpSzczyt[] = [
  { kolejnosc: 1,  nazwa: 'Łysica',             wysokosc: 612,  pasmo: 'Góry Świętokrzyskie' },
  { kolejnosc: 2,  nazwa: 'Ślęża',              wysokosc: 718,  pasmo: 'Masyw Ślęży' },
  { kolejnosc: 3,  nazwa: 'Skopiec',            wysokosc: 724,  pasmo: 'Góry Kaczawskie' },
  { kolejnosc: 4,  nazwa: 'Kłodzka Góra',       wysokosc: 765,  pasmo: 'Góry Bardzkie' },
  { kolejnosc: 5,  nazwa: 'Chełmiec',           wysokosc: 869,  pasmo: 'Góry Wałbrzyskie' },
  { kolejnosc: 6,  nazwa: 'Biskupia Kopa',      wysokosc: 891,  pasmo: 'Góry Opawskie' },
  { kolejnosc: 7,  nazwa: 'Lubomir',            wysokosc: 912,  pasmo: 'Beskid Makowski' },
  { kolejnosc: 8,  nazwa: 'Szczeliniec Wielki', wysokosc: 919,  pasmo: 'Góry Stołowe' },
  { kolejnosc: 9,  nazwa: 'Czupel',             wysokosc: 930,  pasmo: 'Beskid Mały' },
  { kolejnosc: 10, nazwa: 'Waligóra',           wysokosc: 936,  pasmo: 'Góry Kamienne' },
  { kolejnosc: 11, nazwa: 'Skalnik',            wysokosc: 945,  pasmo: 'Rudawy Janowickie' },
  { kolejnosc: 12, nazwa: 'Jagodna',            wysokosc: 977,  pasmo: 'Góry Bystrzyckie' },
  { kolejnosc: 13, nazwa: 'Kowadło',            wysokosc: 989,  pasmo: 'Góry Złote' },
  { kolejnosc: 14, nazwa: 'Lackowa',            wysokosc: 997,  pasmo: 'Beskid Niski' },
  { kolejnosc: 15, nazwa: 'Wielka Sowa',        wysokosc: 1015, pasmo: 'Góry Sowie' },
  { kolejnosc: 16, nazwa: 'Wysokie Skałki',     wysokosc: 1050, pasmo: 'Pieniny' },
  { kolejnosc: 17, nazwa: 'Orlica',             wysokosc: 1084, pasmo: 'Góry Orlickie' },
  { kolejnosc: 18, nazwa: 'Rudawiec',           wysokosc: 1106, pasmo: 'Góry Bialskie' },
  { kolejnosc: 19, nazwa: 'Wysoka Kopa',        wysokosc: 1126, pasmo: 'Góry Izerskie' },
  { kolejnosc: 20, nazwa: 'Mogielica',          wysokosc: 1171, pasmo: 'Beskid Wyspowy' },
  { kolejnosc: 21, nazwa: 'Skrzyczne',          wysokosc: 1257, pasmo: 'Beskid Śląski' },
  { kolejnosc: 22, nazwa: 'Radziejowa',         wysokosc: 1266, pasmo: 'Beskid Sądecki' },
  { kolejnosc: 23, nazwa: 'Turbacz',            wysokosc: 1310, pasmo: 'Gorce' },
  { kolejnosc: 24, nazwa: 'Tarnica',            wysokosc: 1346, pasmo: 'Bieszczady' },
  { kolejnosc: 25, nazwa: 'Śnieżnik',           wysokosc: 1425, pasmo: 'Masyw Śnieżnika' },
  { kolejnosc: 26, nazwa: 'Śnieżka',            wysokosc: 1603, pasmo: 'Karkonosze' },
  { kolejnosc: 27, nazwa: 'Babia Góra',         wysokosc: 1725, pasmo: 'Beskid Żywiecki' },
  { kolejnosc: 28, nazwa: 'Rysy',               wysokosc: 2499, pasmo: 'Tatry' },
] as const;

export const KGP_TOTAL = KGP_LISTA.length;

/* ---------------------------------------------------------------- filtry */

/**
 * Te trzy predykaty są wspólne dla strony głównej (chipsy JS) i dla stron
 * zbiorczych `/kgp/*`. "czesciowo" / "smycz" liczą się jako spełnione —
 * tak samo jak w chipsach na stronie głównej.
 */
type InfoPola = {
  parkingDarmowy?: 'tak' | 'nie' | 'czesciowo';
  psyDozwolone?: 'tak' | 'nie' | 'smycz';
  gastronomiaDostepna?: 'tak' | 'nie' | 'czesciowo';
};

export const maDarmowyParking = (d: InfoPola) =>
  d.parkingDarmowy === 'tak' || d.parkingDarmowy === 'czesciowo';

export const mozliwyZPsem = (d: InfoPola) =>
  d.psyDozwolone === 'tak' || d.psyDozwolone === 'smycz';

export const maGastronomie = (d: InfoPola) =>
  d.gastronomiaDostepna === 'tak' || d.gastronomiaDostepna === 'czesciowo';

/* ---------------------------------------------------- etykiety wartości */

export const PARKING_LABEL: Record<string, string> = {
  tak: 'Darmowy',
  nie: 'Płatny',
  czesciowo: 'Częściowo darmowy',
};

export const PSY_LABEL: Record<string, string> = {
  tak: 'Można',
  nie: 'Zakaz',
  smycz: 'Na smyczy',
};

export const GASTRO_LABEL: Record<string, string> = {
  tak: 'Jest',
  nie: 'Brak',
  czesciowo: 'Częściowo',
};

export const TRUDNOSC_LABEL: Record<string, string> = {
  'łatwa': 'Łatwa',
  'średnia': 'Średnia',
  'trudna': 'Trudna',
};

/* --------------------------------------------- konfiguracja stron /kgp/* */

/** Która kolumna „praktyczna" ma się pokazać w tabeli danego widoku. */
export type KolumnaInfo = 'parking' | 'psy' | 'gastro' | 'trudnosc' | 'czas';

export type KgpWidok = {
  slug: string;
  /** H1 — w formie pytania, bo pod to idą zapytania w wyszukiwarkach. */
  h1: string;
  /** <title> — ≤60 znaków licząc sufiks brandowy. */
  title: string;
  /** meta description — ≤160 znaków. */
  description: string;
  /** Akapit wprowadzający nad tabelą. */
  intro: string;
  /** Krótka etykieta do nawigacji i huba. */
  nazwaKrotka: string;
  /** Tylko szczyty spełniające ten warunek; brak = wszystkie 28. */
  filtr?: (d: InfoPola) => boolean;
  /** Dodatkowe kolumny tabeli poza nazwą/wysokością/pasmem. */
  kolumny: KolumnaInfo[];
  /** Po czym sortować. */
  sort: 'wysokosc' | 'trudnosc';
  /**
   * `true` → tabela pokazuje wszystkie 28 szczytów Korony (także te, na których
   * jeszcze nie byliśmy, z pustymi danymi). `false`/brak → tylko szczyty, dla
   * których mamy własną relację, bo czas, trudność i info o parkingu bierzemy
   * z naszego wyjścia, a nie z zewnętrznych źródeł.
   */
  pelnaLista?: boolean;
};

export const KGP_WIDOKI: readonly KgpWidok[] = [
  {
    slug: 'darmowy-parking',
    nazwaKrotka: 'Darmowy parking',
    h1: 'Które szczyty Korony Gór Polski mają darmowy parking?',
    title: 'Darmowy parking — Korona Gór Polski',
    description:
      'Lista szczytów Korony Gór Polski z darmowym parkingiem pod szlakiem, ' +
      'z konkretnymi cenami i lokalizacjami tam, gdzie parking jest płatny.',
    intro:
      'Zestawienie powstało z naszych własnych wyjść — za każdy z tych parkingów ' +
      'faktycznie płaciliśmy albo nie płaciliśmy. „Częściowo darmowy" znaczy, że ' +
      'darmowa opcja istnieje, ale wymaga podejścia albo zaparkowania dalej.',
    filtr: maDarmowyParking,
    kolumny: ['parking', 'czas'],
    sort: 'wysokosc',
  },
  {
    slug: 'z-psem',
    nazwaKrotka: 'Z psem',
    h1: 'Na które szczyty Korony Gór Polski można wejść z psem?',
    title: 'Z psem na szlak — Korona Gór Polski',
    description:
      'Na które szczyty Korony Gór Polski wolno wejść z psem, gdzie obowiązuje ' +
      'smycz, a gdzie parki narodowe mają zakaz. Stan na naszych trasach.',
    intro:
      'Uwaga: zakazy dotyczą konkretnych szlaków, nie całych szczytów. Poniżej ' +
      'opisujemy sytuację na trasie, którą sami szliśmy — innym szlakiem na ten ' +
      'sam szczyt zasady mogą być inne. Przy parkach narodowych zawsze sprawdź ' +
      'aktualny regulamin parku przed wyjazdem.',
    filtr: mozliwyZPsem,
    kolumny: ['psy', 'czas'],
    sort: 'wysokosc',
  },
  {
    slug: 'gastronomia',
    nazwaKrotka: 'Gastronomia',
    h1: 'Gdzie na szlakach Korony Gór Polski jest schronisko lub gastronomia?',
    title: 'Schroniska i gastronomia — Korona Gór Polski',
    description:
      'Na których szczytach Korony Gór Polski zjesz ciepły posiłek — schroniska, ' +
      'bufety i bary na szczycie albo po drodze.',
    intro:
      'Przydatne, jeśli planujesz wyjście bez pełnego prowiantu. „Częściowo" ' +
      'znaczy, że punkt istnieje, ale bywa sezonowy albo stoi daleko od szczytu.',
    filtr: maGastronomie,
    kolumny: ['gastro', 'czas'],
    sort: 'wysokosc',
  },
  {
    slug: 'wedlug-trudnosci',
    nazwaKrotka: 'Wg trudności',
    h1: 'Które szczyty Korony Gór Polski są najłatwiejsze, a które najtrudniejsze?',
    title: 'Szczyty KGP według trudności',
    description:
      'Szczyty Korony Gór Polski uszeregowane od najłatwiejszych do najtrudniejszych, ' +
      'z czasem przejścia i przewyższeniem dla każdej trasy.',
    intro:
      'Trudność oceniamy po trasie, którą sami przeszliśmy — liczy się długość, ' +
      'przewyższenie i techniczność terenu, nie sama wysokość szczytu. Dobry punkt ' +
      'wyjścia, jeśli zaczynasz Koronę i chcesz rozpocząć od czegoś spokojnego.',
    kolumny: ['trudnosc', 'czas'],
    sort: 'trudnosc',
  },
  {
    slug: 'wedlug-wysokosci',
    nazwaKrotka: 'Wg wysokości',
    h1: 'Lista wszystkich 28 szczytów Korony Gór Polski według wysokości',
    title: 'Wszystkie 28 szczytów KGP wg wysokości',
    description:
      'Pełna lista 28 szczytów Korony Gór Polski od najniższego (Łysica, 612 m) ' +
      'do najwyższego (Rysy, 2499 m), z pasmem górskim dla każdego.',
    intro:
      'Pełna, kompletna lista Korony Gór Polski — wszystkie 28 szczytów wraz z ' +
      'pasmem i wysokością. Tam, gdzie mamy już własną relację z wejścia, nazwa ' +
      'szczytu jest linkiem.',
    kolumny: ['trudnosc', 'czas'],
    sort: 'wysokosc',
    pelnaLista: true,
  },
  {
    slug: 'czas-przejscia',
    nazwaKrotka: 'Czas przejścia',
    h1: 'Ile czasu zajmuje wejście na szczyty Korony Gór Polski?',
    title: 'Czas przejścia i przewyższenie — KGP',
    description:
      'Czas przejścia i przewyższenie dla szczytów Korony Gór Polski — ' +
      'zmierzone na trasach, które sami przeszliśmy, nie przepisane z map.',
    intro:
      'Czasy są z naszych realnych wyjść, razem z przerwami, w tempie ' +
      'spokojnego marszu. Przewyższenia weryfikowaliśmy z Mapy.com, bo surowe ' +
      'dane z GPS-a zawyżają sumę podejść.',
    kolumny: ['czas', 'trudnosc'],
    sort: 'wysokosc',
  },
] as const;

/* ------------------------------------------------- odmiana nazw szczytów */

/**
 * Przypadki potrzebne w pytaniach FAQ na stronach szczytów. Bez tego
 * wychodziło „parking pod Śnieżka" / „wejść na Śnieżka z psem".
 *
 * Klucz = `kolejnosc` (stabilny, odporny na różnice w nazewnictwie między
 * frontmatterem a listą kanoniczną — np. „Wysoka" vs „Wysokie Skałki").
 *
 *  narzednik    → „parking pod {…}"            (pod Śnieżką, pod Turbaczem)
 *  biernik      → „wejście na {…}"             (na Śnieżkę, na Turbacz)
 *  miejscownik  → „czy na {…} jest schronisko" (na Śnieżce, na Turbaczu)
 *
 * Gdy brak wpisu, kod spada na mianownik z frontmattera — zdanie wyjdzie
 * koślawe, ale nic się nie wysypie.
 */
export type Przypadki = { narzednik: string; biernik: string; miejscownik: string };

export const KGP_PRZYPADKI: Record<number, Przypadki> = {
  1:  { narzednik: 'Łysicą',              biernik: 'Łysicę',             miejscownik: 'Łysicy' },
  2:  { narzednik: 'Ślężą',               biernik: 'Ślężę',              miejscownik: 'Ślęży' },
  3:  { narzednik: 'Skopcem',             biernik: 'Skopiec',            miejscownik: 'Skopcu' },
  4:  { narzednik: 'Kłodzką Górą',        biernik: 'Kłodzką Górę',       miejscownik: 'Kłodzkiej Górze' },
  5:  { narzednik: 'Chełmcem',            biernik: 'Chełmiec',           miejscownik: 'Chełmcu' },
  6:  { narzednik: 'Biskupią Kopą',       biernik: 'Biskupią Kopę',      miejscownik: 'Biskupiej Kopie' },
  7:  { narzednik: 'Lubomirem',           biernik: 'Lubomir',            miejscownik: 'Lubomirze' },
  8:  { narzednik: 'Szczelińcem Wielkim', biernik: 'Szczeliniec Wielki', miejscownik: 'Szczelińcu Wielkim' },
  9:  { narzednik: 'Czuplem',             biernik: 'Czupel',             miejscownik: 'Czuplu' },
  10: { narzednik: 'Waligórą',            biernik: 'Waligórę',           miejscownik: 'Waligórze' },
  11: { narzednik: 'Skalnikiem',          biernik: 'Skalnik',            miejscownik: 'Skalniku' },
  12: { narzednik: 'Jagodną',             biernik: 'Jagodną',            miejscownik: 'Jagodnej' },
  13: { narzednik: 'Kowadłem',            biernik: 'Kowadło',            miejscownik: 'Kowadle' },
  14: { narzednik: 'Lackową',             biernik: 'Lackową',            miejscownik: 'Lackowej' },
  15: { narzednik: 'Wielką Sową',         biernik: 'Wielką Sowę',        miejscownik: 'Wielkiej Sowie' },
  16: { narzednik: 'Wysoką',              biernik: 'Wysoką',             miejscownik: 'Wysokiej' },
  17: { narzednik: 'Orlicą',              biernik: 'Orlicę',             miejscownik: 'Orlicy' },
  18: { narzednik: 'Rudawcem',            biernik: 'Rudawiec',           miejscownik: 'Rudawcu' },
  19: { narzednik: 'Wysoką Kopą',         biernik: 'Wysoką Kopę',        miejscownik: 'Wysokiej Kopie' },
  20: { narzednik: 'Mogielicą',           biernik: 'Mogielicę',          miejscownik: 'Mogielicy' },
  21: { narzednik: 'Skrzycznem',          biernik: 'Skrzyczne',          miejscownik: 'Skrzycznem' },
  22: { narzednik: 'Radziejową',          biernik: 'Radziejową',         miejscownik: 'Radziejowej' },
  23: { narzednik: 'Turbaczem',           biernik: 'Turbacz',            miejscownik: 'Turbaczu' },
  24: { narzednik: 'Tarnicą',             biernik: 'Tarnicę',            miejscownik: 'Tarnicy' },
  25: { narzednik: 'Śnieżnikiem',         biernik: 'Śnieżnik',           miejscownik: 'Śnieżniku' },
  26: { narzednik: 'Śnieżką',             biernik: 'Śnieżkę',            miejscownik: 'Śnieżce' },
  27: { narzednik: 'Babią Górą',          biernik: 'Babią Górę',         miejscownik: 'Babiej Górze' },
  28: { narzednik: 'Rysami',              biernik: 'Rysy',               miejscownik: 'Rysach' },
};
