# CardScoresPro – cspboard.digital

Turnajový systém pre biliard, šípky, bowling a snooker.

## Štruktúra stránok

| URL | Popis |
|-----|-------|
| `/` | Landing page |
| `/login/` | Prihlásenie / Registrácia |
| `/profil/` | Hráčsky profil |
| `/klub/` | Klubový profil |
| `/nastavenie-profilu/` | Nastavenie profilu |
| `/nastavenie-profilu/avatar/` | Výber avatara |
| `/nastavenie-turnaja/` | Nastavenie turnaja |
| `/vytvorit-udalost/` | Vytvoriť udalosť |
| `/trening/biliard/` | Biliard počítadlo |
| `/trening/sipky/` | Šípky 501 počítadlo |
| `/trening/bowling/` | Bowling počítadlo |
| `/trening/snooker/` | Snooker počítadlo |
| `/priebeh-turnaja/` | Live priebeh turnaja |
| `/preregistracia/` | Predregistrácia (univerzálna) |
| `/preregistracia/turnaj/` | Predregistrácia s turnajom |
| `/rezervacia/moment-club/` | Rezervačný kalendár |
| `/search/` | Vyhľadávanie turnajov |
| `/uspechy/` | Úspechy hráča |
| `/udalost/` | Detail udalosti |
| `/cookies/` | Cookies |
| `/obchodne-podmienky/` | Obchodné podmienky |

## Backend

- **Supabase** – databáza, autentifikácia, realtime
- URL: `https://ierliswrgrtltrrvlqsz.supabase.co`

## Nasadenie

```bash
git add .
git commit -m "Update"
git push origin main
```

GitHub Pages automaticky nasadí z `main` branch.

## Magazín

| URL | Popis |
|-----|-------|
| `/magazin/biliard/` | Biliardový magazín |
| `/magazin/sipky/` | Šípkový magazín |
| `/magazin/bowling/` | Bowlingový magazín |
| `/magazin/admin/` | Admin — písanie článkov |

Obsah magazínu sa načítava dynamicky zo Supabase tabuľky `articles`.
