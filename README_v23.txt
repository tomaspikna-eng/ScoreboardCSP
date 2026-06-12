ConnectScore Pro — v23 (nasadenie 22.5.2026)
==============================================

Zmeny oproti v19:

1. REGISTRÁCIA (/registracia/)
   - Multi-šport športoviská: každý šport má vlastnú sekciu s vlastnými stoliskami
   - Príklad pre klub:
     ✓ Biliard: 9× 9ft Rasson, 2× 7ft Pool
     ✓ Šípky: 12× Steel terče
     ☐ Bowling (skryté)
   - Fix redirect: po výbere role presmeruje na /hrac/, /klub/, /organizacia/
   - Použitý upsert() — funguje aj ak riadok v profiles ešte neexistuje

2. NASTAVENIE PROFILU (/nastavenie-profilu/)
   - Save tlačidlo má console.log + robustný error reporting
   - Multi-šport športoviská (rovnako ako v registrácii)
   - Otvorí F12 → Console aby si videl prípadnú chybu

3. ODSTRÁNENÉ FIKTÍVNE MENÁ
   - Tomáš Pikna → Hráč 1
   - Moment Club / Point Klub → Klub
   - Kanianka / Dolný Kubín → Mesto
   - Nábrežná 12 → Adresa klubu
   - Slovenský biliardový zväz → Organizácia
   - T. Novák / P. Kováč / M. Bartoš / S. Tóth → Hráč
   - Aktualizované v 10 súboroch

4. OPRAVENÉ URL
   - tomaspikna-eng.github.io/cspfinal/ → cspboard.digital

============================================
DÔLEŽITÉ — pred testom spusti v Supabase SQL Editor:

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan text DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS sport text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS contact_email text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS open_hours text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS club_name text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS sportoviska text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio text;

============================================
NASADENIE NA GITHUB:
1. Stiahni a rozbaľ csp-deploy-v23.zip
2. Skopíruj všetok obsah do root repozitára (prepíš staré súbory)
3. Commit + push → Vercel automaticky nasadí
