# Yamandia EP — notatki dla modelu

Statyczna strona Astro (Korona Gór Polski + trasy rowerowe). Ten plik ma
oszczędzić kolejnej sesji szukania po repo/internecie tego, co już raz
ustalono. Czytaj przed edycją treści (`src/content/`).

## Deploy

- **Produkcja: Vercel**, domena **yamandia.com**. Push na `main` = auto-deploy.
- `astro.config.mjs`: `base: '/'` (Vercel serwuje z roota — **nie** `/EP_Website/`).
- **GitHub Pages działa tylko jako przekierowanie** na yamandia.com — patrz
  `pages-redirect/` + `.github/workflows/pages-redirect.yml`. To zachowuje
  stary link `yamandiaep.github.io/EP_Website/` (np. wysłany w CV) żywym.
  Nie przywracaj tam pełnego builda Astro — z `base:'/'` byłby zepsuty
  (assety 404, bo Pages serwuje spod `/EP_Website/`).
- `npm run build` lokalnie zawsze przed pushem, żeby złapać błędy schematu.

## Dwie kolekcje treści

`src/content.config.ts` jest **jedynym** aktywnym configiem (Content Layer
API, `loader: glob(...)`). Jeśli kiedyś zobaczysz `src/content/config.ts` —
to relikt starego API, usuń go, nie edytuj.

### `szczyty` (src/content/szczyty/*.md) — Korona Gór Polski

Pola: `nazwa, region, wysokosc, czas, przewyzszenie, trudnosc(łatwa|średnia|
trudna), done, data?, photo?, photos?[], instagram?, tiktok?, gpx?, parking?,
trasa?, kolejnosc`.

`kolejnosc` = **pozycja w pełnej liście 28 szczytów KGP posortowanej rosnąco
wg wysokości** (nie kolejność dodania!). Repo ma obecnie tylko część
szczytów, więc numeracja ma dziury — to normalne, zostaw luki dla
niedodanych jeszcze szczytów. Pełna lista niżej.

### `trasy` (src/content/trasy/*.md) — trasy rowerowe

Pola: `nazwa, start, meta, region, dystans, dni, przewyzszenie, nawierzchnia,
trudnosc(łatwa|średnia|trudna), done, data?, photo?, photos?[], instagram?,
tiktok?, gpx?, mapa?, kolejnosc`.

Uwaga: pole schematu nazywa się `dni`, ale w `TrasaLayout.astro` wyświetla
się pod etykietą **„Czas"** — więc mimo nazwy pola wpisuj tam też np. `"~10h"`,
nie tylko liczbę dni. `kolejnosc` tu to zwykła kolejność dodania (nie ma
zewnętrznego rankingu jak przy KGP).

## Pełna lista 28 szczytów KGP (rosnąco wg wysokości = wartość `kolejnosc`)

Zweryfikowana i zgodna z danymi już w repo (Kowadło=13, Rudawiec=18,
Turbacz=23, Śnieżka=26). Gdy dodajesz nowy szczyt, znajdź go tu i wstaw
dokładnie ten numer — **nie zgaduj i nie przeliczaj na nowo przez web search**.

| kolejnosc | Szczyt | Wysokość | Pasmo |
|---:|---|---:|---|
| 1 | Łysica | 612 m | Góry Świętokrzyskie |
| 2 | Ślęża | 718 m | Masyw Ślęży |
| 3 | Skopiec | 724 m | Góry Kaczawskie |
| 4 | Kłodzka Góra | 765 m | Góry Bardzkie |
| 5 | Chełmiec | 869 m | Góry Wałbrzyskie |
| 6 | Biskupia Kopa | 891 m | Góry Opawskie |
| 7 | Lubomir | 912 m | Beskid Makowski |
| 8 | Szczeliniec Wielki | 919 m | Góry Stołowe |
| 9 | Czupel | 933 m | Beskid Mały |
| 10 | Waligóra | 936 m | Góry Kamienne |
| 11 | Skalnik | 945 m | Rudawy Janowickie |
| 12 | Jagodna | 985 m | Góry Bystrzyckie |
| 13 | Kowadło | 989 m | Góry Złote |
| 14 | Lackowa | 997 m | Beskid Niski |
| 15 | Wielka Sowa | 1015 m | Góry Sowie |
| 16 | Wysoka / Wysokie Skałki | 1050 m | Pieniny |
| 17 | Orlica | 1084 m | Góry Orlickie |
| 18 | Rudawiec | 1106 m | Góry Bialskie |
| 19 | Wysoka Kopa | 1126 m | Góry Izerskie |
| 20 | Mogielica | 1171 m | Beskid Wyspowy |
| 21 | Skrzyczne | 1257 m | Beskid Śląski |
| 22 | Radziejowa | 1266 m | Beskid Sądecki |
| 23 | Turbacz | 1310 m | Gorce |
| 24 | Tarnica | 1346 m | Bieszczady |
| 25 | Śnieżnik | 1425 m | Masyw Śnieżnika |
| 26 | Śnieżka | 1603 m | Karkonosze |
| 27 | Babia Góra | 1725 m | Beskid Żywiecki |
| 28 | Rysy | 2499 m | Tatry (wierzchołek graniczny) |

## Styl treści (relacje z wypraw)

Wzorce: `src/content/szczyty/skalnik.md` (krótsza, klasyczna), `sniezka.md`
(dłuższa, „open hike"). Zasady:

- Pierwsza osoba liczby mnogiej („ruszyliśmy", „doszliśmy"), potoczny,
  konkretny ton — nie poradnikowy, nie marketingowy.
- 3–6 akapitów: start/dojazd → przebieg po kolei (szlaki, skręty,
  charakterystyczne punkty) → szczyt/pieczątka → zejście. Bez nagłówków,
  chyba że trasa ma wyraźnie osobny wątek (np. `## BONUSOWY SZLAK` w
  skalnik.md, `## Nawierzchnia i uwagi` w trasach rowerowych).
- Konkretne nazwy szlaków (kolory), odległości, punkty orientacyjne —
  czytelnik ma móc iść z tym tekstem w ręku.
- Jeśli trasa pochodzi z zewnętrznego źródła (np. bloga), **wpleć link do
  źródła w tekście** (patrz `turbacz.md` → plannawypad.pl).
- Dla tras rowerowych: treść zwięźlejsza niż dla szczytów (nikt nie czyta
  eseju przed 170 km) — krótki wstęp + `## Nawierzchnia i uwagi` +
  `## Dobrze wiedzieć` jako listy.

## GPX → dystans i przewyższenie

Dystans liczony z surowych trkpt (haversine) jest wiarygodny i zwykle 1:1 z
Mapy.com. **Przewyższenie liczone jako suma wszystkich dodatnich skoków
elevation z surowego GPX jest zawyżone** (szum GPS w danych wysokości się
sumuje) — przy trasie Wrocław→Poznań surowe liczenie dało +675 m, a
Mapy.com (wygładzony profil) pokazywał realne +265 m. **Zawsze weryfikuj
przewyższenie z Mapy.com / innym zaufanym źródłem, nie tylko z surowego
pliku GPX.**

## Zdjęcia: konwersja HEIC → JPG

`npm run convert-heic [folder]` (domyślnie `public/images`) — konwertuje
wszystkie `.HEIC`/`.heic` w folderze na `.jpg` (max 1920px szerokości,
honoruje orientację EXIF, jakość 85). Oryginałów **nie usuwa automatycznie**
— sprawdź wynik, potem usuń `.HEIC` i ewentualnie przenumeruj pliki na
konwencję `<slug>.jpg` (główne) + `<slug>-1.jpg`, `<slug>-2.jpg`, ... (galeria).

Używa `heic-convert` (dekoduje HEIC) + `sharp` (skalowanie/kompresja) —
`sharp` **sam nie ma kodeka HEIC** wbudowanego w tej instalacji, więc samo
`sharp('plik.HEIC')` się wysypie. Oba pakiety są w `devDependencies`.

## Znane pułapki (już raz naprawiane, nie powielaj)

- **Astro scoped styles nie dziedziczą globalnego `box-sizing: border-box`**
  z `Layout.astro` — komponenty w innych plikach `.astro` (np.
  `TrasaLayout`) muszą same zadeklarować `box-sizing: border-box` na
  elementach z paddingiem, inaczej `width:100%` + padding wychodzi poza
  kontener.
- **Leaflet czasem renderuje mapę węziej niż jej kontener** przy
  pierwszym renderze (przed przeliczeniem layoutu) — zawsze wołaj
  `map.invalidateSize()` po `fitBounds` i na `resize`.
- **Ciemne hero (trasa/szczyt) + tryb jasny** = nawigacja na górze strony
  robi się niewidoczna, jeśli nie ma wymuszenia koloru. Layout ma prop
  `darkHero` na `<Layout>` właśnie po to — ustawiaj go na stronach z
  ciemnym/przyciemnionym hero.
