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
        this.fretBoundaries = this.getFretBoundaries();
        // console.log(this.fretBoundaries);

        this.cardMargins = [54, 37, 52, 37];
        this.rowHeight = 34;
        this.columnWidth = 26;

        this.innerHeight = 4 + (this.fretRange.length * this.rowHeight) + 1;
        this.height = this.cardMargins[0] + (this.fretRange.length * this.rowHeight) + this.cardMargins[2];
        this.innerWidth = (this.columnCount * this.columnWidth) + 2;
        this.width = this.innerWidth + this.cardMargins[1] + this.cardMargins[3];

        this.snap = Snap(this.width, this.height);

        // console.log(this.getCoord(65, 140));
    }

    drawSvg() {
        var that = this;
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
            let dotSize = 6;
            if([3, 5, 7, 9, 15, 17, 19, 21].indexOf(this.fretRange[i]) > -1){
                s.circle(this.width/2, this.cardMargins[0] + (this.rowHeight * i) + this.rowHeight / 2, dotSize).addClass('dot');
            }
            if([12].indexOf(this.fretRange[i]) > -1){
                s.circle(this.width/2 - this.columnWidth, this.cardMargins[0] + (this.rowHeight * i) + this.rowHeight / 2, dotSize).addClass('dot');
                s.circle(this.width/2 + this.columnWidth, this.cardMargins[0] + (this.rowHeight * i) + this.rowHeight / 2, dotSize).addClass('dot');
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

        for(let fret in this.fretRange) {
            let fretGroup = s.g(
                // draw fret hover area
                s.rect(
                    0, 
                    this.cardMargins[0] + (fret * this.rowHeight),
                    this.width,
                    this.rowHeight
                ).addClass('hover-region')
            ).addClass('fret');
            // draw string lines
            for(let string = 1; string <= this.stringCount; string++) {
                let startPoint = this.getFingerDrawPoint(string, this.fretRange[fret]);
                console.log([string, parseInt(fret) + this.fretRange[0]]);
                console.log(this.getCoord(startPoint[0], startPoint[1]));
                let endPoint = startPoint;
                let lineArgs = [startPoint[0], startPoint[1], endPoint[0], endPoint[1]];
                let fingerOuter = s.line(...lineArgs).addClass('outer');
                fingerOuter.coords = [fret, string];
                let fingerInner = s.line(...lineArgs).addClass('inner');
                fingerInner.coords = [fret, string];
                let fingerGroup = s.g(
                    s.rect(
                        this.width - this.cardMargins[1] - ((string - 1) * this.columnWidth) - (this.columnWidth / 2) - 1,
                        this.cardMargins[0] + (fret * this.rowHeight),
                        this.columnWidth,
                        this.rowHeight
                    ).addClass('hover-region'),
                    fingerOuter,
                    fingerInner
                ).addClass('finger').mousedown(function(handler){
                    if(this.hasClass('active')) {

                    }
                    this.toggleClass('active');
                    if(this.hasClass('active')) {
                        fretGroup.addClass('adding');
                    } else {
                        let x1 = parseInt(fingerInner.attr('x1'));
                        fretGroup.addClass('removing');

                        fingerInner.animate({x2: x1}, 100).removeClass('line');
                        fingerOuter.animate({x2: x1}, 100).removeClass('line');
                    }
                }).drag(function(dx, dy) {
                    fretGroup.addClass('dragging');
                    let x1 = parseInt(fingerInner.attr('x1'));
                    let x2 = parseInt(fingerInner.attr('x2'));
                    let x2new = x1 + dx;

                    for(let string = 1; string <= that.stringCount; string++) {
                        let x = that.getFingerDrawPoint(string, fret)[0];
                        let diff = Math.abs(x - x2new);
                        if(diff < that.columnWidth / 2 + .5){
                            x2new = x;
                            if(fingerInner.x2 != x2new) {
                                fingerInner.x2 = x2new;
                                fingerInner.animate({x2: x2new}, 75);
                                fingerOuter.animate({x2: x2new}, 75);

                                if(x2new != x1){
                                    fingerInner.addClass('line');
                                    fingerOuter.addClass('line');
                                } else {
                                    fingerInner.removeClass('line');
                                    fingerOuter.removeClass('line');
                                }
                            }
                            break;
                        }
                    }
                });
                if(this.fretBoundaries[parseInt(fret)]){
                    if(this.fretBoundaries[parseInt(fret)].indexOf(parseInt(string))){
                        fretGroup.addClass('disabled');
                    }
                }
                fretGroup.mouseup(function(handler) {
                    this.removeClass('adding').removeClass('removing').removeClass('dragging');
                });
                fretGroup.append(fingerGroup);
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

    getFretBoundaries(){
        var result = [];
        for(let fret of this.fretRange) {
            result[fret] = [];
        }
        for(let finger of this.fingers) {
            for(let coord of finger){
                if(coord) result[coord[1]].push(coord[0]);
            }
        }
        return result;
    }

    getFingerDrawPoint(string, fret) {
        var startFret = this.fretRange[0];

        var x = this.width - this.cardMargins[1] - (string - 1) * this.columnWidth - 1;
        var y = this.cardMargins[0] + ((fret - startFret + 1) * this.rowHeight) - (this.rowHeight / 2);

        return [x, y];
    }

    getCoord(x, y) {
        var string = this.stringCount - parseInt((x - this.cardMargins[3]) / this.columnWidth);
        var fret = this.fretRange[0] + parseInt((y - this.cardMargins[0]) / this.rowHeight);
        return [string, fret];
    }
}