export var chordset = {
    "id": "a590048c-957f-407a-9d58-fe71dfa77983",
    "name": "",
    "description": "",
    "url": "",
    "instrument": "standard-guitar", // slug, can be custom-#####
    "tuning": "custom-853", // allows us to easily match on non standard tunings, and filter by tuning
    "computed_key": "B Flat", // allows us easily filter by key
    "strings": ['E', 'A', 'D', 'G', 'B', 'E'], // string multiples with [array, ...] instead of [string, ...], num strings, tunings
    "capo": [3, -5], // 0 for none, int fret, or array [int fret, int strings_covered] where strings covered is from string 1 if positive or the last string if negative (you can't have a capo in the middle of the strings)
    "chords": [
        {
            "id": "a590048c-957f-407a-9d58-fe71dfa77983",
            "computed_name": "C",
            "description": "",
            "fingers": [
                [[1, 7]],
                [[2, 8]],
                [[3, 9], [4, 9]],
                [],
                [],
                [],
            ],
            "mutes": [1, 1, 0, 0, 0, 0],
        },
        {
            "id": "a590048c-957f-407a-9d58-fe71dfa77983",
            "computed_name": "F",
            "description": "",
            "fingers": [
                [[1, 2]],
                [[2, 3]],
                [[3, 4], [4, 4]],
                [],
                [],
                [],
            ],
            "mutes": [1, 1, 0, 0, 0, 0],
        },
        {
            "id": "a590048c-957f-407a-9d58-fe71dfa77983",
            "computed_name": "F",
            "description": "",
            "fingers": [
                [[1, 1]],
                [[2, 2]],
                [[4, 3]],
                [[3, 3]],
                [],
                [],
            ],
            "mutes": [1, 1, 0, 0, 0, 0],
        },
        {
            "id": "a590048c-957f-407a-9d58-fe71dfa77983",
            "computed_name": "F",
            "description": "",
            "fingers": [
                [],
                [[2, 1]],
                [[3, 2], [4, 2]],
                [],
                [],
                [],
            ],
            "mutes": [1, 1, 0, 0, 0, 0],
        },
    ],
};

// export default chordSetSample;