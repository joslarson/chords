import Chord from './chord';

export default class ChordSet {
    constructor(data) {
        this.id = data['id'];
        this.name = data['name'];
        this.description = data['description'];
        this.url = data['url'];
        this.instrument = data['instrument'];
        this.tuning = data['tuning'];
        this.computedKey = data['computed_key'];
        this.strings = data['strings'];
        this.capo = data['capo'];
        this.chords = [];
        data['chords'].forEach(chordData => this.chords.push(new Chord(chordData, this)));
    }

    drawSvg() {
        for (let chord of this.chords) {
            chord.drawSvg();
        }
    }
}
