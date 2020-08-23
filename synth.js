

let audioContext = new (window.AudioContext || window.webkitAudioContext());
let oscList = [];
let Gain = null;

let keys = document.getElementById('keys');
let wavepicker = document.querySelector("#waveform");
let volume = document.getElementById("volume");

let freq = null;
let sine = null;
let customWaveForm = null;
let cosine = null;

function noteFreqTable() {
    let noteFreq = [];

    for (let i = 0; i <= 1; i++) {
        noteFreq[i] = [];
    }

    noteFreq[0]["f"] = 349.23;
    noteFreq[0]["fs"] = 369.99;
    noteFreq[0]["g"] = 392.00;
    noteFreq[0]["gs"] = 415.30;
    noteFreq[0]["a"] = 440.00;
    noteFreq[0]["as"] = 466.16;
    noteFreq[0]["b"] = 493.88;
    noteFreq[0]["c"] = 523.25;
    noteFreq[0]["cs"] = 554.37;
    noteFreq[0]["d"] = 587.33;
    noteFreq[0]["ds"] = 622.25;
    noteFreq[0]["e"] = 659.25;

    return noteFreq;
}

function setup() {
    noteFreq = noteFreqTable();

    volume.addEventListener("change", changeVolume, false);

    masterGainNode = audioContext.createGain();
    masterGainNode.connect(audioContext.destination);
    masterGainNode.gain.value = volume.value;

    noteFreq.forEach(function (keys, idx) {
        let keylist = Object.entries(keys);

        keylist.forEach(function (key) {
            createKey(key[0], key[1]);
        })
    })


    sine = new Float32Array([0, 0, 1, 0, 1]);
    cosine = new Float32Array(sine.length);
    customWaveForm = audioContext.createPeriodicWave(cosine, sine);

    for (i=0; i <= 1; i++) {
        oscList[i] = [];
    }
}

setup();

function createKey(note, freq) {
    let keyElement = document.getElementById(note);

    keyElement.dataset["frequency"] = freq;
    keyElement.addEventListener("mousedown", notePressed, false);
    keyElement.addEventListener("mouseup", noteReleased, false);
    keyElement.addEventListener("mouseover", notePressed, false);
    keyElement.addEventListener("mouseleave", noteReleased, false);

    return keyElement;
}

function playTone(freq) {
    let osc = audioContext.createOscillator();
    osc.connect(masterGainNode);

    let type = wavepicker.options[wavepicker.selectedIndex].value;

    if (type === "custom") {
        osc.setPeriodicWave(customWaveForm);
    } else {
        osc.type = type;
    }

    osc.frequency.value = freq;
    osc.start();

    return osc;
}

function notePressed(event) {
    if(event.buttons & 1) {
        let dataset = event.target.dataset;
        let note = event.target.getAttribute("id");

        console.log(note);

        if (!dataset["pressed"]) {
            oscList[0[event.target.getAttribute("id")]] = playTone(dataset["frequency"]);
            dataset["pressed"] = "yes";
        }

        console.log(oscList[0[note]]);

    }
}

function noteReleased(event) {
    let dataset = event.target.dataset;
    let note = event.target.getAttribute("id")

    if (dataset && dataset["pressed"]) {
        oscList[0[note]].stop();
        oscList[0[note]] = null;
        delete dataset["pressed"];
    }
}

function changeVolume(event) {
    masterGainNode.gain.value = volume.value
}

