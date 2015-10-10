export default class Chord {
    constructor(data, chordset) {
        this.id = data['id'];
        this.computedName = data['computed_name'];
        this.description = data['description'];
        this.fingers = data['fingers'];
        this.mutes = data['mutes'];
        this.chordset = chordset;

        this.stringCount = chordset.strings.length;
        this.columnCount = this.stringCount - 1;
        this.fretRange = this.getFretRange();

        this.cardMargins = [54, 37, 52, 37];
        this.rowHeight = 34;
        this.columnWidth = 26;

        this.innerHeight = 4 + (this.fretRange.length * this.rowHeight) + 1;
        this.height = this.cardMargins[0] + (this.fretRange.length * this.rowHeight) + this.cardMargins[2];
        this.innerWidth = (this.columnCount * this.columnWidth) + 2;
        this.width = this.innerWidth + this.cardMargins[1] + this.cardMargins[3];

        this.snap = Snap(this.width, this.height);
    }

    drawSvg() {
        var s = this.snap;

        //////////////////////////////////////////////////////////
        // draw frets

        var patternOffsetX = 38 % this.columnWidth;
        var patternOffsetY = 54 % this.rowHeight - .5;

        var grid1 = s.g(
            s.rect(0, 0, this.columnWidth, this.rowHeight),
            s.path(`M${patternOffsetX},0,${patternOffsetX},${this.rowHeight}`).attr({
                strokeWidth: 2
            }),
            s.path(`M0,${patternOffsetY},${this.columnWidth},${patternOffsetY}`).attr({
                strokeWidth: 1
            })
        ).pattern(0, 0, this.columnWidth, this.rowHeight).attr({id: 'grid2'});

        var grid2 = s.g(
            s.rect(0, 0, this.columnWidth, this.rowHeight),
            s.path(`M9,0,9,${this.rowHeight}`).attr({
                strokeWidth: 2
            }),
            s.path(`M11.5,0,11.5,${this.rowHeight}`).attr({
                strokeWidth: 1
            }),
            s.path(`M0,19.5,${this.columnWidth},19.5`).attr({
                strokeWidth: 1
            })
        ).pattern(0, 0, this.columnWidth, this.rowHeight).attr({id: 'grid1'});

        s.line(0, this.cardMargins[0] - 2, this.width, this.cardMargins[0] - 2).addClass('line top');
        for (let i = 0; i < this.fretRange.length; i++) {
            var fret = this.fretRange[i];

            // draw fret lines
            var top = this.cardMargins[0] + ((i + 1) * this.rowHeight) - .5;
            s.line(0, top, this.width, top).addClass('line');

            // draw fret numbers
            s.text(this.cardMargins[1]/2, top - this.rowHeight/2 + 2, fret);
            s.text(this.width - this.cardMargins[1]/2, top - this.rowHeight/2 + 2, fret);
        }
        s.line(0, this.height - this.cardMargins[2], this.width, this.height - this.cardMargins[2]).addClass('line bottom');
        s.rect(this.cardMargins[1] + 1, this.cardMargins[0] - 3, this.innerWidth - 2, this.innerHeight - 2, 2, 2).addClass('inner-bg').attr({fill: grid1});
        s.line(this.cardMargins[1] + 2, this.cardMargins[0] - 2, this.width - this.cardMargins[3] - 2, this.cardMargins[0] - 2).addClass('line top inner');

        //////////////////////////////////////////////////////////
        // draw marker dots

        for(let i in this.fretRange){
            let dotSize = 5;
            if([3, 5, 7, 9, 15, 17, 19, 21].indexOf(this.fretRange[i]) > -1){
                s.circle(this.width/2, this.cardMargins[0] + (this.rowHeight * i) + this.rowHeight / 2, dotSize).addClass('dot');
            }
            if([12].indexOf(this.fretRange[i]) > -1){
                s.circle(this.width/2 - this.columnWidth * 1, this.cardMargins[0] + (this.rowHeight * i) + this.rowHeight / 2, dotSize).addClass('dot');
                s.circle(this.width/2 + this.columnWidth * 1, this.cardMargins[0] + (this.rowHeight * i) + this.rowHeight / 2, dotSize).addClass('dot');
            }
        }

        //////////////////////////////////////////////////////////
        // draw tuning & mutes

        let tunePoint = [this.cardMargins[3], this.cardMargins[0] / 2 + 1];
        let mutePoint = [this.cardMargins[3], this.height - (this.cardMargins[2] / 2) + 2];
        for (let i in this.chordset.strings) {
            let string = this.chordset.strings[i];
            let mute = this.mutes[i] ? '⤫' : '○';  // ○ ● ⦾ ⦿ ⨀ × ⤫ ✕

            s.text(tunePoint[0], tunePoint[1], string);
            s.text(mutePoint[0], mutePoint[1], mute);
            tunePoint[0] += this.columnWidth;
            mutePoint[0] += this.columnWidth;
        }

        //////////////////////////////////////////////////////////
        // draw fingers

        for (let finger of this.fingers) {
            if(finger.length == 0) continue;

            let pathParts = [];

            var startPoint = this.getFingerDrawPoint(finger[0][0], finger[0][1]);
            pathParts.push(`M${startPoint[0]} ${startPoint[1]}`);
            for(let gridPoint of finger) {
                let point = this.getFingerDrawPoint(gridPoint[0], gridPoint[1]);
                pathParts.push(`${point[0]} ${point[1]}`);
            }
            let pathString = pathParts.join(', ');

            let fingerOuter = s.path(pathString).addClass('finger outer');
            let fingerInner = s.path(pathString).addClass('finger inner');

            if (finger.length > 1) {
                fingerInner.addClass('line');
                fingerOuter.addClass('line');
            }
        }

        //////////////////////////////////////////////////////////
        // draw marker dots

        for(let i in this.fretRange){
            let dotSize = 6.5;
            if([3, 5, 7, 9, 15, 17, 19, 21].indexOf(this.fretRange[i]) > -1){
                s.circle(this.width/2, this.cardMargins[0] + (this.rowHeight * i) + this.rowHeight / 2, dotSize).addClass('dot-ontop');
            }
            if([12].indexOf(this.fretRange[i]) > -1){
                s.circle(this.width/2 - this.columnWidth * 1, this.cardMargins[0] + (this.rowHeight * i) + this.rowHeight / 2, dotSize).addClass('dot-ontop');
                s.circle(this.width/2 + this.columnWidth * 1, this.cardMargins[0] + (this.rowHeight * i) + this.rowHeight / 2, dotSize).addClass('dot-ontop');
            }
        }
    }

    getFretRange() {
        var lowFret, highFret;
        var fretRange = [];
        var fretRangeBoudaries = [];

        for (let finger of this.fingers) {
            for (let pos of finger) {
                lowFret = fretRangeBoudaries[0];
                highFret = fretRangeBoudaries[1];

                if(lowFret === undefined || pos[1] < lowFret) {
                    fretRangeBoudaries[0] = pos[1];
                }
                if(highFret === undefined || pos[1] > highFret) {
                    fretRangeBoudaries[1] = pos[1];
                }
            }
        }

        lowFret = fretRangeBoudaries[0];
        highFret = fretRangeBoudaries[1];
        if(highFret < 7) {
            fretRangeBoudaries[0] = 1;
            fretRangeBoudaries[1] = 6;
        } else if(highFret - lowFret < 6) {
            fretRangeBoudaries[1] = lowFret + 5;
        }

        for (let i = fretRangeBoudaries[0]; i <= fretRangeBoudaries[1]; i++) {
            fretRange.push(i);
        }

        return fretRange;
    }

    getFingerDrawPoint(string, fret) {
        var startFret = this.fretRange[0];

        var x = this.width - this.cardMargins[1] - (string - 1) * this.columnWidth - 1;
        var y = this.cardMargins[0] + ((fret - startFret + 1) * this.rowHeight) - (this.rowHeight / 2);

        return [x, y];
    }
}