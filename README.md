# FBI Operations Center

Modern FBI frakciós WebMDT / Operations Center prototípus FiveM roleplay szerverhez.

## Tartalom
- Modern responsive dashboard és oldalsó navigáció
- Áttekintő KPI kártyák, műveleti aktivitás
- Nyomozati ügylista, keresés, prioritások és státuszok
- Új ügy felvételi modal (jelenleg kliensoldali prototípus)
- Modulváz: személyek, járművek, bizonyítékok, jelentések, műveletek, fedőazonosságok, CCTV, ügynökök, rangok, audit
- Prisma PostgreSQL séma Neonhoz
- Seed adat és health endpoint

## Helyi futtatás Windows alatt

1. Telepítsd a Node.js LTS verziót: https://nodejs.org/
2. Csomagold ki a projektet, majd a mappában nyiss terminált.
3. Futtasd:

```bash
npm install
```

4. Másold az `.env.example` fájlt `.env` néven.
5. A `DATABASE_URL` értékét állítsd be:
   - Neon PostgreSQL URL-re, ha Neon adatbázist használsz; vagy
   - saját PostgreSQL adatbázis URL-re.
6. Hozd létre az adatbázistáblákat:

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

7. Indítsd el:

```bash
npm run dev
```

Nyisd meg: http://localhost:3000

> A dashboard demóadatokkal adatbázis nélkül is megjelenik. A Prisma adatbázis-sémához `DATABASE_URL` szükséges a migrációs parancsok futtatásához.

## Neon beállítás

1. Neonban hozz létre egy projektet és adatbázist.
2. A Connect menüben másold a pooled connection stringet.
3. Helyi `.env` fájlban add meg `DATABASE_URL` néven.
4. Vercelben a Project Settings → Environment Variables alatt add hozzá ugyanezt a változót.
5. A Vercel build parancs a `prisma generate && next build`.

## Vercel deploy

- Töltsd fel GitHub repositoryba.
- Importáld a projektet Vercelbe.
- Add meg a `DATABASE_URL` környezeti változót.
- Deploy.

## Fontos fejlesztési megjegyzés

Ez egy UI-prototípus és adatmodell-alap. Éles, frakciós használat előtt szükséges:
- autentikáció és session kezelés,
- szerveroldali role/rank permission checks,
- API route-ok és Prisma CRUD bekötése,
- auditnaplózás,
- feltöltött bizonyítékok biztonságos tárolása (pl. Vercel Blob vagy S3-kompatibilis tárhely),
- rate limit, inputvalidálás és adatvédelmi szabályok,
- FiveM karakterazonosító integráció.

Ne használd valós személyek érzékeny adatainak tárolására. A mintarekordok kizárólag RP/demo célúak.

## Belépés és felhasználó-adminisztráció

- Nincs publikus regisztráció.
- Első adminisztrátor: `stuartg` / `jani12` (seed hozza létre).
- A kezdeti jelszó a seed során scrypt hashként kerül adatbázisba, nem plain textként.
- Admin felület: `/admin` (csak SUPERADMIN/ADMIN szerepkörrel).
- Szerepkörök: SUPERADMIN, ADMIN, SUPERVISOR, AGENT, VIEWER; a backend API is ellenőrzi a szerepkört.
- A munkamenet 12 órás, HttpOnly, SameSite=Lax cookie-val van aláírva.

### Első telepítés

```bash
npm install
# .env fájl: DATABASE_URL és egy hosszú, véletlenszerű SESSION_SECRET
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Vercel-en a `DATABASE_URL` és `SESSION_SECRET` változókat Project Settings → Environment Variables alatt kell beállítani. A deploy build: `prisma generate && next build`. Adatbázis séma migrálásához Neon URL-lel lokálisan `npx prisma db push` futtatható.

**Biztonsági megjegyzés:** az első belépés után cseréld le a kezdeti jelszót. Ez az RP webapp számára készült, nem valódi FBI vagy állami rendszer; a jelenlegi UI-adatok és az ügykezelési modulok továbbfejlesztése szükséges ahhoz, hogy minden adat ténylegesen adatbázisba mentődjön.
