export const BASE_BPM = 140;               // default BPM

export const getStrangerTune = (bpm) => `
setcps(${bpm} / 60 / 4)

samples('github:algorave-dave/samples')
samples('https://raw.githubusercontent.com/tidalcycles/Dirt-Samples/master/strudel.json')
samples('https://raw.githubusercontent.com/Mittans/tidal-drum-machines/main/machines/tidal-drum-machines.json')

const gain_patterns = [
  "2",
  "{0.75 2.5}*4",
    "{0.75 2.5!9 0.75 2.5!5 0.75 2.5 0.75 2.5!7 0.75 2.5!3 <2.5 0.75> 2.5}%16",
]

const drum_structure = [
"~",
"x*4",
"{x ~!9 x ~!5 x ~ x ~!7 x ~!3 < ~ x > ~}%16",
]

const basslines = [
  "[[eb1, eb2]!16 [f2, f1]!16 [g2, g1]!16 [f2, f1]!8 [bb2, bb1]!8]/8",
  "[[eb1, eb2]!16 [bb2, bb1]!16 [g2, g1]!16 [f2, f1]!4 [bb1, bb2]!4 [eb1, eb2]!4 [f1, f2]!4]/8"
]

const arpeggiator1 = [
"{d4 bb3 eb3 d3 bb2 eb2}%16",
"{c4 bb3 f3 c3 bb2 f2}%16",
"{d4 bb3 g3 d3 bb2 g2}%16",
"{c4 bb3 f3 c3 bb2 f2}%16",
]

const arpeggiator2 = [
"{d4 bb3 eb3 d3 bb2 eb2}%16",
"{c4 bb3 f3 c3 bb2 f2}%16",
"{d4 bb3 g3 d3 bb2 g2}%16",
"{d5 bb4 g4 d4 bb3 g3 d4 bb3 eb3 d3 bb2 eb2}%16",
]


const pattern = 0
const bass = 0

bassline:
note(pick(basslines, bass))
.sound("supersaw")
.postgain(2)
.room(0.6)
.lpf(700)
.room(0.4)
.postgain(pick(gain_patterns, pattern))


main_arp: 
note(pick(arpeggiator1, "<0 1 2 3>/2"))
.sound("supersaw")
.lpf(300)
.adsr("0:0:.5:.1")
.room(0.6)
.lpenv(3.3)
.postgain(pick(gain_patterns, pattern))


drums:
stack(
  s("tech:5")
  .postgain(6)
  .pcurve(2)
  .pdec(1)
  .struct(pick(drum_structure, pattern)),

  s("sh").struct("[x!3 ~!2 x!10 ~]")
  .postgain(0.5).lpf(7000)
  .bank("RolandTR808")
  .speed(0.8).jux(rev).room(sine.range(0.1,0.4)).gain(0.6),

  s("{~ ~ rim ~ cp ~ rim cp ~!2 rim ~ cp ~ < rim ~ >!2}%8 *2")
  .bank("[KorgDDM110, OberheimDmx]").speed(1.2)
  .postgain(.25),
)

drums2: 
stack(
  s("[~ hh]*4").bank("RolandTR808").room(0.3).speed(0.75).gain(1.2),
  s("hh").struct("x*16").bank("RolandTR808")
  .gain(0.6)
  .jux(rev)
  .room(sine.range(0.1,0.4))
  .postgain(0.5),
  
  s("[psr:[2|5|6|7|8|9|12|24|25]*16]?0.1")
  .gain(0.1)
  .postgain(pick(gain_patterns, pattern))
  .hpf(1000)
  .speed(0.5)
  .rarely(jux(rev)),
)
//Remixed and reproduced from Algorave Dave's code found here: https://www.youtube.com/watch?v=ZCcpWzhekEY
// all(x => x.gain(mouseX.range(0,1)))
// all(x => x.log())

// @version 1.2`;


// ----------------------------------------------------
// New Tune - club remix style

export const getHyperworldTune = (bpm) => `
setcps(${bpm} / 60 / 4)

samples('github:tidalcycles/dirt-samples')
samples('github:switchangel/pad')

//██╗  ██╗ █████╗ ███╗   ██╗    ██╗     ███████╗
//██║  ██║██╔══██╗████╗  ██║    ██║     ██╔════╝
//███████║███████║██╔██╗ ██║    ██║     █████╗  
//██╔══██║██╔══██║██║╚██╗██║    ██║     ██╔══╝  
//██║  ██║██║  ██║██║ ╚████║    ███████╗███████╗
//╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝    ╚══════╝╚══════╝

const structures = [
  "{~}",
  "x*4",
  "{x ~!6 x ~ ~ x ~!3 x ~}%16",
  "{x ~!3 x ~!3 x ~!2 x ~!2 x ~}%16",
  "{x ~!9 x ~!5 x ~ x ~!7 x ~!3 < ~ x > ~}%16"
]

const pg = [
  "{0.8}",
  "0.3 0.8".fast(4),
  "{0.3 0.8!6 0.3 0.8!2 0.3 0.8!3 0.3 1}",
  "{0.3 0.8!3 0.3 0.8!3 0.3 0.8!2 0.3 0.8!2 0.3 0.8}%16",
  "{0.4 1!9 0.4 1!5 0.4 1 0.4 1!7 0.4 1!3 <1 0.4 > 1}%16"
]

const beat = 3
const energy = slider(400, 400, 5000)

main_vocal:
s("hw:2").chop(64).cut(1).loopAt(16)
.lpf(slider(3433.9, 300, 8000))
.gain(2.5)

verse_chops:
s("hw:1")
.slice(16, "1|2|4|5|9|10|11|12|13".fast(4))
.struct("x").chop(8).clip(0.5).ply(2)
.cut(1).lpf(slider(7000, 300, 7000))
.room(1).rfade(30)
.postgain(pick(pg, beat)).gain(3)

pad:
note("g1".slow(2).add("<2 6 6 4>"))
.s("swpad:1".slow(2))
.att("0").lpf(slider(5000, 300, 5000))
.postgain(pick(pg, beat)).gain(1).room(2)

bassline:
n(irand("<1!7 <8>>".fast(2)))
.scale("<f2 a2 d2 e2>:minor:pentatonic")
.sound("[gym_sythn_bass_1, square]")
.transpose("[0, -12]")
.struct("x*16").decay(0.3).hpf(200).room(0.5)
.lpf(energy)
.postgain(pick(pg, beat)).gain(0.7)

drums:
stack(
  s("tech:5").postgain(5).pcurve(2).pdec(1)
  .hpf(75).struct(pick(structures, beat)),

  s(" [~cp]").bank("KorgDOM110").speed(1).fast(2)
  .postgain(0.2).lpf(3000),

  s("~ hh").bank("RolandTR808").room(0.2)
  .speed(0.75).gain(0.5).fast(4),

  s("breaks165").gain(0.6).loopAt(1).chop(16)
  .fit().postgain(pick(pg, beat))
)

// @version 3.0 HyperWorld Club Remix
`;

// ----------------------------------------------------
// Export all tunes for RadioControls
// ----------------------------------------------------
export const tunes = {
    stranger: getStrangerTune,
    hyperworld: getHyperworldTune,
};
