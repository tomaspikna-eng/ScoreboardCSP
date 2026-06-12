ConnectScore Pro — v24 (testovacia fáza)
==========================================

ZMENY oproti v23:

1) PRIHLASOVANIE — kompletne prerobené
   - /login/   — samostatné prihlásenie (email/heslo + Google)
   - /registracia/ — samostatná registrácia (email/heslo + Google)
   - Žiadny 4-step flow, žiadny výber role
   - Plný debug v Console (F12): [LOGIN], [REG], [KLUB] výpisy

2) AUTOMATICKÝ PROFIL
   - Každý nový užívateľ pri registrácii automaticky dostane:
     role = 'klub'
     plan = 'ultra'
   - Po registrácii rovno presmeruje na /klub/

3) /klub/ — minimalistický
   - NEROBÍ žiadne redirecty (žiadne loopovanie)
   - Buď ukáže profil, alebo chybu s tlačidlom

============================================
DÔLEŽITÉ — pred testom v Supabase:

1) SQL Editor → spusti SUPABASE_SETUP.sql
   (vytvorí RLS policies — bez nich upsert ZLYHÁ)

2) Authentication → Providers → Email
   → vypni "Confirm email"
   (inak signUp nevytvorí session a registrácia sa zacyklí)
