import * as sampledata from './sampledata';
import ChordSet from './chordset';
// import zazate from 'zazate.js';
// import teoria from 'teoria';
// import musicjs from 'musicjs';

$(function(){
    var chordset = new ChordSet(sampledata.chordset);
    chordset.drawSvg();
});

// console.log(zazate.chords.determine(['E', 'A', 'D'], true));

// console.log(teoria.note.fromKey(0).toString(true));