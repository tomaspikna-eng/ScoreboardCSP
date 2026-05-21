/**
 * CSP – Round Robin Engine
 * 
 * Generuje skupiny, zápasy každý s každým.
 * Bodovanie: výhra = 2 body, prehra = 0 bodov.
 * Zoradenie: body → výhry → skóre rozdiel.
 */

class RREngine {
  constructor(players, opts) {
    // opts: { groups, groupSize, race, advance, phase2 }
    this.players   = players;
    this.groups    = opts.groups    || 1;
    this.groupSize = opts.groupSize || players.length;
    this.race      = opts.race      || 7;
    this.advance   = opts.advance   || 2;
    this.phase2    = opts.phase2    || 'dko';
    this.matches   = [];
    this._mid      = 0;
    this.groupData = []; // [{name, players, standings}]
    this._build();
  }

  _build() {
    // Rozdeľ hráčov do skupín (serpentínovým spôsobom: 1→G1, 2→G2, 3→G3, 4→G3, 5→G2, 6→G1...)
    const gs = [];
    for(let i = 0; i < this.groups; i++) gs.push([]);

    this.players.forEach((p, i) => {
      const cycle  = Math.floor(i / this.groups);
      const pos    = i % this.groups;
      const gIdx   = cycle % 2 === 0 ? pos : (this.groups - 1 - pos);
      if(gs[gIdx]) gs[gIdx].push(p);
    });

    // Vytvor skupiny a zápasy
    gs.forEach((gPlayers, gi) => {
      const gName = 'Skupina ' + String.fromCharCode(65 + gi); // A, B, C...
      const group = {
        idx:      gi,
        name:     gName,
        players:  gPlayers,
        matches:  [],
        standings: gPlayers.map(p => ({
          player: p,
          w: 0, l: 0, pts: 0,
          scored: 0, received: 0,
        })),
      };

      // Zápasy každý s každým
      for(let a = 0; a < gPlayers.length; a++) {
        for(let b = a + 1; b < gPlayers.length; b++) {
          const m = {
            id:     ++this._mid,
            group:  gi,
            gName:  gName,
            label:  gName + '-' + this._mid,
            p1:     gPlayers[a],
            p2:     gPlayers[b],
            s1:     null,
            s2:     null,
            winner: null,
            loser:  null,
            status: 'ready',
          };
          group.matches.push(m);
          this.matches.push(m);
        }
      }

      this.groupData.push(group);
    });
  }

  record(matchId, s1, s2) {
    const m = this.matches.find(x => x.id === matchId);
    if(!m || m.status === 'done') return null;

    m.s1     = s1;
    m.s2     = s2;
    m.status = 'done';
    m.winner = s1 > s2 ? m.p1 : m.p2;
    m.loser  = s1 > s2 ? m.p2 : m.p1;

    // Aktualizuj standings
    const group = this.groupData[m.group];
    const sw = group.standings.find(s => s.player.id === m.winner.id);
    const sl = group.standings.find(s => s.player.id === m.loser.id);
    if(sw){ sw.w++; sw.pts += 2; sw.scored += Math.max(s1,s2); sw.received += Math.min(s1,s2); }
    if(sl){ sl.l++;              sl.scored += Math.min(s1,s2); sl.received += Math.max(s1,s2); }

    this._sortStandings(group);
    return { winner: m.winner, loser: m.loser };
  }

  _sortStandings(group) {
    group.standings.sort((a, b) =>
      b.pts - a.pts ||
      b.w   - a.w   ||
      (b.scored - b.received) - (a.scored - a.received)
    );
  }

  getGroup(idx)     { return this.groupData[idx]; }
  getMatch(id)      { return this.matches.find(m => m.id === id); }
  getGroupMatches(gi){ return this.matches.filter(m => m.group === gi); }

  isGroupDone(gi) {
    return this.getGroupMatches(gi).every(m => m.status === 'done');
  }

  isAllDone() {
    return this.matches.every(m => m.status === 'done');
  }

  // Vráti postupujúcich hráčov (top N z každej skupiny)
  getAdvancing() {
    const result = [];
    this.groupData.forEach(g => {
      g.standings.slice(0, this.advance).forEach((s, rank) => {
        result.push({ player: s.player, group: g.name, groupRank: rank + 1 });
      });
    });
    return result;
  }

  stats() {
    const total = this.matches.length;
    const done  = this.matches.filter(m => m.status === 'done').length;
    return { total, done, pct: Math.round(done / total * 100) || 0 };
  }
}

if(typeof module !== 'undefined') module.exports = { RREngine };
