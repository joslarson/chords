(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _sampledata = require('./sampledata');

var sampledata = _interopRequireWildcard(_sampledata);

var _chordset = require('./chordset');

var _chordset2 = _interopRequireDefault(_chordset);

// import zazate from 'zazate.js';
// import teoria from 'teoria';
// import musicjs from 'musicjs';

$(function () {
    var chordset = new _chordset2['default'](sampledata.chordset);
    chordset.drawSvg();
});

// console.log(zazate.chords.determine(['E', 'A', 'D'], true));

// console.log(teoria.note.fromKey(0).toString(true));

},{"./chordset":3,"./sampledata":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Chord = (function () {
    function Chord(data, chordset) {
        _classCallCheck(this, Chord);

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

        this.innerHeight = 4 + this.fretRange.length * this.rowHeight + 1;
        this.height = this.cardMargins[0] + this.fretRange.length * this.rowHeight + this.cardMargins[2];
        this.innerWidth = this.columnCount * this.columnWidth + 2;
        this.width = this.innerWidth + this.cardMargins[1] + this.cardMargins[3];

        this.snap = Snap(this.width, this.height);

        // console.log(this.getCoord(65, 140));
    }

    _createClass(Chord, [{
        key: 'drawSvg',
        value: function drawSvg() {
            var _this = this;

            var that = this;
            var s = this.snap;

            //////////////////////////////////////////////////////////
            // draw frets

            var patternOffsetX = 38 % this.columnWidth;
            var patternOffsetY = 54 % this.rowHeight - .5;

            var grid1 = s.g(s.rect(0, 0, this.columnWidth, this.rowHeight), s.path('M' + patternOffsetX + ',0,' + patternOffsetX + ',' + this.rowHeight).attr({
                strokeWidth: 2
            }), s.path('M0,' + patternOffsetY + ',' + this.columnWidth + ',' + patternOffsetY).attr({
                strokeWidth: 1
            })).pattern(0, 0, this.columnWidth, this.rowHeight).attr({ id: 'grid2' });

            var grid2 = s.g(s.rect(0, 0, this.columnWidth, this.rowHeight), s.path('M9,0,9,' + this.rowHeight).attr({
                strokeWidth: 2
            }), s.path('M11.5,0,11.5,' + this.rowHeight).attr({
                strokeWidth: 1
            }), s.path('M0,19.5,' + this.columnWidth + ',19.5').attr({
                strokeWidth: 1
            })).pattern(0, 0, this.columnWidth, this.rowHeight).attr({ id: 'grid1' });

            s.line(0, this.cardMargins[0] - 2, this.width, this.cardMargins[0] - 2).addClass('line top');
            for (var i = 0; i < this.fretRange.length; i++) {
                var fret = this.fretRange[i];

                // draw fret lines
                var top = this.cardMargins[0] + (i + 1) * this.rowHeight - .5;
                s.line(0, top, this.width, top).addClass('line');

                // draw fret numbers
                s.text(this.cardMargins[1] / 2, top - this.rowHeight / 2 + 2, fret);
                s.text(this.width - this.cardMargins[1] / 2, top - this.rowHeight / 2 + 2, fret);
            }
            s.line(0, this.height - this.cardMargins[2], this.width, this.height - this.cardMargins[2]).addClass('line bottom');
            s.rect(this.cardMargins[1] + 1, this.cardMargins[0] - 3, this.innerWidth - 2, this.innerHeight - 2, 2, 2).addClass('inner-bg').attr({ fill: grid1 });
            s.line(this.cardMargins[1] + 2, this.cardMargins[0] - 2, this.width - this.cardMargins[3] - 2, this.cardMargins[0] - 2).addClass('line top inner');

            //////////////////////////////////////////////////////////
            // draw marker dots

            for (var i in this.fretRange) {
                var dotSize = 6;
                if ([3, 5, 7, 9, 15, 17, 19, 21].indexOf(this.fretRange[i]) > -1) {
                    s.circle(this.width / 2, this.cardMargins[0] + this.rowHeight * i + this.rowHeight / 2, dotSize).addClass('dot');
                }
                if ([12].indexOf(this.fretRange[i]) > -1) {
                    s.circle(this.width / 2 - this.columnWidth, this.cardMargins[0] + this.rowHeight * i + this.rowHeight / 2, dotSize).addClass('dot');
                    s.circle(this.width / 2 + this.columnWidth, this.cardMargins[0] + this.rowHeight * i + this.rowHeight / 2, dotSize).addClass('dot');
                }
            }

            //////////////////////////////////////////////////////////
            // draw tuning & mutes

            var tunePoint = [this.cardMargins[3], this.cardMargins[0] / 2 + 1];
            var mutePoint = [this.cardMargins[3], this.height - this.cardMargins[2] / 2 + 2];
            for (var i in this.chordset.strings) {
                var string = this.chordset.strings[i];
                var mute = this.mutes[i] ? '⤫' : '○'; // ○ ● ⦾ ⦿ ⨀ × ⤫ ✕

                s.text(tunePoint[0], tunePoint[1], string);
                s.text(mutePoint[0], mutePoint[1], mute);
                tunePoint[0] += this.columnWidth;
                mutePoint[0] += this.columnWidth;
            }

            //////////////////////////////////////////////////////////
            // draw fingers

            var _loop = function (_fret) {
                var fretGroup = s.g(
                // draw fret hover area
                s.rect(0, _this.cardMargins[0] + _fret * _this.rowHeight, _this.width, _this.rowHeight).addClass('hover-region')).addClass('fret');
                // draw string lines

                var _loop2 = function (string) {
                    var startPoint = _this.getFingerDrawPoint(string, _this.fretRange[_fret]);
                    console.log([string, parseInt(_fret) + _this.fretRange[0]]);
                    console.log(_this.getCoord(startPoint[0], startPoint[1]));
                    var endPoint = startPoint;
                    var lineArgs = [startPoint[0], startPoint[1], endPoint[0], endPoint[1]];
                    var fingerOuter = s.line.apply(s, lineArgs).addClass('outer');
                    fingerOuter.coords = [_fret, string];
                    var fingerInner = s.line.apply(s, lineArgs).addClass('inner');
                    fingerInner.coords = [_fret, string];
                    var fingerGroup = s.g(s.rect(_this.width - _this.cardMargins[1] - (string - 1) * _this.columnWidth - _this.columnWidth / 2 - 1, _this.cardMargins[0] + _fret * _this.rowHeight, _this.columnWidth, _this.rowHeight).addClass('hover-region'), fingerOuter, fingerInner).addClass('finger').mousedown(function (handler) {
                        if (this.hasClass('active')) {}
                        this.toggleClass('active');
                        if (this.hasClass('active')) {
                            fretGroup.addClass('adding');
                        } else {
                            var x1 = parseInt(fingerInner.attr('x1'));
                            fretGroup.addClass('removing');

                            fingerInner.animate({ x2: x1 }, 100).removeClass('line');
                            fingerOuter.animate({ x2: x1 }, 100).removeClass('line');
                        }
                    }).drag(function (dx, dy) {
                        fretGroup.addClass('dragging');
                        var x1 = parseInt(fingerInner.attr('x1'));
                        var x2 = parseInt(fingerInner.attr('x2'));
                        var x2new = x1 + dx;

                        for (var _string = 1; _string <= that.stringCount; _string++) {
                            var x = that.getFingerDrawPoint(_string, _fret)[0];
                            var diff = Math.abs(x - x2new);
                            if (diff < that.columnWidth / 2 + .5) {
                                x2new = x;
                                if (fingerInner.x2 != x2new) {
                                    fingerInner.x2 = x2new;
                                    fingerInner.animate({ x2: x2new }, 75);
                                    fingerOuter.animate({ x2: x2new }, 75);

                                    if (x2new != x1) {
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
                    if (_this.fretBoundaries[parseInt(_fret)]) {
                        if (_this.fretBoundaries[parseInt(_fret)].indexOf(parseInt(string))) {
                            fretGroup.addClass('disabled');
                        }
                    }
                    fretGroup.mouseup(function (handler) {
                        this.removeClass('adding').removeClass('removing').removeClass('dragging');
                    });
                    fretGroup.append(fingerGroup);
                };

                for (var string = 1; string <= _this.stringCount; string++) {
                    _loop2(string);
                }
            };

            for (var _fret in this.fretRange) {
                _loop(_fret);
            }
        }
    }, {
        key: 'getFretRange',
        value: function getFretRange() {
            var lowFret, highFret;
            var fretRange = [];
            var fretRangeBoudaries = [];

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.fingers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var finger = _step.value;
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = finger[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var pos = _step2.value;

                            lowFret = fretRangeBoudaries[0];
                            highFret = fretRangeBoudaries[1];

                            if (lowFret === undefined || pos[1] < lowFret) {
                                fretRangeBoudaries[0] = pos[1];
                            }
                            if (highFret === undefined || pos[1] > highFret) {
                                fretRangeBoudaries[1] = pos[1];
                            }
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                                _iterator2['return']();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator['return']) {
                        _iterator['return']();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            lowFret = fretRangeBoudaries[0];
            highFret = fretRangeBoudaries[1];

            if (highFret < 7) {
                fretRangeBoudaries[0] = 1;
                fretRangeBoudaries[1] = 6;
            } else if (highFret - lowFret < 6) {
                fretRangeBoudaries[1] = lowFret + 5;
            }

            for (var i = fretRangeBoudaries[0]; i <= fretRangeBoudaries[1]; i++) {
                fretRange.push(i);
            }

            return fretRange;
        }
    }, {
        key: 'getFretBoundaries',
        value: function getFretBoundaries() {
            var result = [];
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = this.fretRange[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var fret = _step3.value;

                    result[fret] = [];
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3['return']) {
                        _iterator3['return']();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = this.fingers[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var finger = _step4.value;
                    var _iteratorNormalCompletion5 = true;
                    var _didIteratorError5 = false;
                    var _iteratorError5 = undefined;

                    try {
                        for (var _iterator5 = finger[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                            var coord = _step5.value;

                            if (coord) result[coord[1]].push(coord[0]);
                        }
                    } catch (err) {
                        _didIteratorError5 = true;
                        _iteratorError5 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion5 && _iterator5['return']) {
                                _iterator5['return']();
                            }
                        } finally {
                            if (_didIteratorError5) {
                                throw _iteratorError5;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4['return']) {
                        _iterator4['return']();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            return result;
        }
    }, {
        key: 'getFingerDrawPoint',
        value: function getFingerDrawPoint(string, fret) {
            var startFret = this.fretRange[0];

            var x = this.width - this.cardMargins[1] - (string - 1) * this.columnWidth - 1;
            var y = this.cardMargins[0] + (fret - startFret + 1) * this.rowHeight - this.rowHeight / 2;

            return [x, y];
        }
    }, {
        key: 'getCoord',
        value: function getCoord(x, y) {
            var string = this.stringCount - parseInt((x - this.cardMargins[3]) / this.columnWidth);
            var fret = this.fretRange[0] + parseInt((y - this.cardMargins[0]) / this.rowHeight);
            return [string, fret];
        }
    }]);

    return Chord;
})();

exports['default'] = Chord;
module.exports = exports['default'];

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _chord = require('./chord');

var _chord2 = _interopRequireDefault(_chord);

var ChordSet = (function () {
    function ChordSet(data) {
        var _this = this;

        _classCallCheck(this, ChordSet);

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
        data['chords'].forEach(function (chordData) {
            return _this.chords.push(new _chord2['default'](chordData, _this));
        });
    }

    _createClass(ChordSet, [{
        key: 'drawSvg',
        value: function drawSvg() {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.chords[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var chord = _step.value;

                    chord.drawSvg();
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator['return']) {
                        _iterator['return']();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }]);

    return ChordSet;
})();

exports['default'] = ChordSet;
module.exports = exports['default'];

},{"./chord":2}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var chordset = {
    "id": "a590048c-957f-407a-9d58-fe71dfa77983",
    "name": "",
    "description": "",
    "url": "",
    "instrument": "standard-guitar", // slug, can be custom-#####
    "tuning": "custom-853", // allows us to easily match on non standard tunings, and filter by tuning
    "computed_key": "B Flat", // allows us easily filter by key
    "strings": ['E', 'A', 'D', 'G', 'B', 'E'], // string multiples with [array, ...] instead of [string, ...], num strings, tunings
    "capo": [3, -5], // 0 for none, int fret, or array [int fret, int strings_covered] where strings covered is from string 1 if positive or the last string if negative (you can't have a capo in the middle of the strings)
    "chords": [{
        "id": "a590048c-957f-407a-9d58-fe71dfa77983",
        "computed_name": "C",
        "description": "",
        "fingers": [[[1, 7]], [[2, 8]], [[3, 9], [4, 9]], [], [], []],
        "mutes": [1, 1, 0, 0, 0, 0]
    }, {
        "id": "a590048c-957f-407a-9d58-fe71dfa77983",
        "computed_name": "F",
        "description": "",
        "fingers": [[[1, 2]], [[2, 3]], [[3, 4], [4, 4]], [], [], []],
        "mutes": [1, 1, 0, 0, 0, 0]
    }, {
        "id": "a590048c-957f-407a-9d58-fe71dfa77983",
        "computed_name": "F",
        "description": "",
        "fingers": [[[1, 1]], [[2, 2]], [[4, 3]], [[3, 3]], [], []],
        "mutes": [1, 1, 0, 0, 0, 0]
    }, {
        "id": "a590048c-957f-407a-9d58-fe71dfa77983",
        "computed_name": "F",
        "description": "",
        "fingers": [[], [[2, 1]], [[3, 2], [4, 2]], [], [], []],
        "mutes": [1, 1, 0, 0, 0, 0]
    }]
};

exports.chordset = chordset;
// export default chordSetSample;

},{}]},{},[1])


//# sourceMappingURL=bundle.js.map