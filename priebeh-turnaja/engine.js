// ═══════════════════════════════════════════
// DKO ENGINE
// ═══════════════════════════════════════════
function buildSeedOrder(n){let o=[1];while(o.length<n){const s=o.length*2,nx=[];for(let i=0;i<o.length;i++){nx.push(o[i]);nx.push(s+1-o[i]);}o=nx;}return o;}
const LETTERS=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P'];
const B1_KEY=['B','A','D','C','F','E','H','G'];
const B2_KEY=['B','A','D','C'];
const B3_KEY=['B','A'];

class DKOEngine{
  constructor(players,opts={}){this.players=players;this.n=opts.bracketSize||16;this.thirdPlace=opts.thirdPlace!==false;this.matches=[];this._mid=0;this._build();}
  _new(round,pos,label){const m={id:++this._mid,round,pos,label,p1:null,p2:null,s1:null,s2:null,winner:null,loser:null,status:'pending',isLock:false,letter:null,winner_to:null,loser_to:null};this.matches.push(m);return m;}
  _assign(mid,slot,player){const m=this.matches.find(x=>x.id===mid);if(!m||!player)return;if(slot===1)m.p1=player;else m.p2=player;if(m.p1&&m.p2)m.status='ready';}
  _build(){
    const byS={};this.players.forEach(p=>byS[p.seed]=p);
    const so=buildSeedOrder(this.n);
    const a0=[];for(let i=0;i<8;i++){const s1=so[i*2],s2=so[i*2+1],p1=byS[s1]||null,p2=byS[s2]||null;const m=this._new('A0',i+1,'A0-'+(i+1));m.letter=LETTERS[i];m.p1=p1;m.p2=p2;if(!p1&&!p2){m.isLock=true;m.status='lock';}else if(!p1||!p2){m.isLock=true;m.status='lock';m.winner=p1||p2;}else m.status='ready';a0.push(m);}
    const a1=[],a2=[],sf=[],b1=[],b2=[],b3=[];
    for(let i=0;i<4;i++){const m=this._new('A1',i+1,'A1-'+(i+1));m.letter=LETTERS[i];a1.push(m);}
    for(let i=0;i<2;i++){const m=this._new('A2',i+1,'A2-'+(i+1));m.letter=LETTERS[i];a2.push(m);}
    for(let i=0;i<2;i++)sf.push(this._new('SF',i+1,'SF-'+(i+1)));
    for(let i=0;i<4;i++)b1.push(this._new('B1',i+1,'B1-'+(i+1)));
    for(let i=0;i<4;i++)b2.push(this._new('B2',i+1,'B2-'+(i+1)));
    for(let i=0;i<2;i++)b3.push(this._new('B3',i+1,'B3-'+(i+1)));
    const lf=this._new('LF',1,'LF');
    const tp=this.thirdPlace?this._new('TP',1,'3. miesto'):null;
    const gf=this._new('GF',1,'Grand Final');
    a0.forEach((m,i)=>{const a1idx=Math.floor(i/2),slot=(i%2)+1;m.winner_to={id:a1[a1idx].id,slot};if(m.isLock){m.loser_to='eliminated';if(m.winner)this._assign(a1[a1idx].id,slot,m.winner);}else{const ki=B1_KEY.indexOf(m.letter),bi=Math.floor(ki/2),bs=(ki%2)+1;m.loser_to={id:b1[bi].id,slot:bs};}});
    a1.forEach((m,i)=>{const a2idx=Math.floor(i/2),slot=(i%2)+1;m.winner_to={id:a2[a2idx].id,slot};const ki=B2_KEY.indexOf(m.letter);if(ki>=0)m.loser_to={id:b2[ki].id,slot:1};});
    a2.forEach((m,i)=>{m.winner_to='sf_draw';const ki=B3_KEY.indexOf(m.letter);if(ki>=0)m.loser_to={id:b3[ki].id,slot:1};});
    b1.forEach((m,i)=>{m.winner_to={id:b2[i].id,slot:2};m.loser_to='eliminated';});
    b2.forEach((m,i)=>{m.winner_to={id:b3[Math.floor(i/2)].id,slot:(i%2)+1};m.loser_to='eliminated';});
    b3.forEach((m,i)=>{m.winner_to={id:lf.id,slot:i+1};m.loser_to='eliminated';});
    lf.winner_to='sf_draw';lf.loser_to='eliminated';
    sf.forEach((m,i)=>{m.winner_to={id:gf.id,slot:i+1};m.loser_to=tp?{id:tp.id,slot:i+1}:'eliminated';});
    gf.winner_to='champion';gf.loser_to='runner_up';
    if(tp){tp.winner_to='third';tp.loser_to='fourth';}
    this.r={a0,a1,a2,sf,b1,b2,b3,lf,tp,gf};
  }
  trySFDraw(){const sf=this.r.sf;if(sf.some(m=>m.p1||m.p2))return;const a2w=this.r.a2.filter(m=>m.status==='done').map(m=>({...m.winner,_s:'w'}));const lfw=this.r.lf.status==='done'?[{...this.r.lf.winner,_s:'l'}]:[];if(a2w.length<2||lfw.length<1)return;const pool=[...a2w,...lfw];for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}this._assign(sf[0].id,1,pool[0]);this._assign(sf[0].id,2,pool[1]);if(pool[2]){sf[1].p1=pool[2];sf[1].isLock=true;sf[1].status='lock';sf[1].winner=pool[2];this._assign(this.r.gf.id,2,pool[2]);}}
  record(mid,s1,s2){const m=this.matches.find(x=>x.id===mid);if(!m||m.status==='done'||m.isLock)return null;m.s1=s1;m.s2=s2;m.status='done';m.winner=s1>s2?m.p1:m.p2;m.loser=s1>s2?m.p2:m.p1;const skip=['champion','runner_up','third','fourth','sf_draw','eliminated'];if(m.winner_to&&!skip.includes(m.winner_to))this._assign(m.winner_to.id,m.winner_to.slot,m.winner);if(m.loser_to&&!skip.includes(m.loser_to))this._assign(m.loser_to.id,m.loser_to.slot,m.loser);this.trySFDraw();this._save();return{winner:m.winner,loser:m.loser};}
  setStatus(mid,status){const m=this.matches.find(x=>x.id===mid);if(!m)return;if(status==='active'&&m.status==='ready')m.status='active';else if(status==='paused'&&m.status==='active')m.status='ready';else if(status==='done'&&m.s1!==null&&m.s2!==null)m.status='done';this._save();}
  byRound(r){return this.matches.filter(m=>m.round===r);}
  byId(id){return this.matches.find(m=>m.id===id);}
  _save(){try{localStorage.setItem('csp_priebeh',JSON.stringify({players:this.players,matches:this.matches,n:this.n,thirdPlace:this.thirdPlace}));}catch(e){}}
  static load(){try{const d=JSON.parse(localStorage.getItem('csp_priebeh')||'null');if(!d)return null;const e=new DKOEngine(d.players,{bracketSize:d.n,thirdPlace:d.thirdPlace});e.matches=d.matches;e._mid=Math.max(...d.matches.map(m=>m.id));return e;}catch(e){return null;}}
}

// SKO engine (Single KO) - jednoduchý pavúk
class SKOEngine{
  constructor(players,opts={}){this.players=players;this.n=opts.bracketSize||nearestPow2(players.length);this.thirdPlace=opts.thirdPlace!==false;this.matches=[];this._mid=0;this._build();}
  _new(round,label){const m={id:++this._mid,round,label,p1:null,p2:null,s1:null,s2:null,winner:null,loser:null,status:'pending',isLock:false};this.matches.push(m);return m;}
  _assign(mid,slot,player){const m=this.matches.find(x=>x.id===mid);if(!m||!player)return;if(slot===1)m.p1=player;else m.p2=player;if(m.p1&&m.p2)m.status='ready';}
  _build(){
    const byS={};this.players.forEach(p=>byS[p.seed]=p);
    const so=buildSeedOrder(this.n);
    let prevRound=[];
    const r1=[];
    for(let i=0;i<this.n/2;i++){
      const m=this._new('R1','R1-'+(i+1));
      m.p1=byS[so[i*2]]||null;m.p2=byS[so[i*2+1]]||null;
      if(!m.p1&&!m.p2){m.isLock=true;m.status='lock';}
      else if(!m.p1||!m.p2){m.isLock=true;m.status='lock';m.winner=m.p1||m.p2;}
      else m.status='ready';
      r1.push(m);
    }
    prevRound=r1;
    let rNum=2;
    while(prevRound.length>2){
      const next=[];
      for(let i=0;i<prevRound.length;i+=2){
        const m=this._new('R'+rNum,'R'+rNum+'-'+(i/2+1));
        prevRound[i].winner_to={id:m.id,slot:1};
        prevRound[i+1].winner_to={id:m.id,slot:2};
        if(prevRound[i].isLock&&prevRound[i].winner)this._assign(m.id,1,prevRound[i].winner);
        if(prevRound[i+1].isLock&&prevRound[i+1].winner)this._assign(m.id,2,prevRound[i+1].winner);
        next.push(m);
      }
      prevRound=next;rNum++;
    }
    const gf=this._new('GF','Grand Final');
    prevRound[0].winner_to={id:gf.id,slot:1};
    prevRound[1].winner_to={id:gf.id,slot:2};
    if(prevRound[0].isLock&&prevRound[0].winner)this._assign(gf.id,1,prevRound[0].winner);
    if(prevRound[1].isLock&&prevRound[1].winner)this._assign(gf.id,2,prevRound[1].winner);
    if(this.thirdPlace){
      // SF (predposledné kolo)
    }
    this.r={gf};
  }
  record(mid,s1,s2){const m=this.matches.find(x=>x.id===mid);if(!m||m.status==='done'||m.isLock)return null;m.s1=s1;m.s2=s2;m.status='done';m.winner=s1>s2?m.p1:m.p2;m.loser=s1>s2?m.p2:m.p1;if(m.winner_to)this._assign(m.winner_to.id,m.winner_to.slot,m.winner);this._save();return{winner:m.winner,loser:m.loser};}
  setStatus(mid,status){const m=this.matches.find(x=>x.id===mid);if(!m)return;if(status==='active'&&m.status==='ready')m.status='active';else if(status==='paused')m.status='ready';this._save();}
  byId(id){return this.matches.find(m=>m.id===id);}
  _save(){try{localStorage.setItem('csp_priebeh',JSON.stringify({type:'sko',players:this.players,matches:this.matches,n:this.n}));}catch(e){}}
}

// RR ENGINE (Round Robin)
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


function nearestPow2(n){let p=1;while(p<n)p*=2;return p;}

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
