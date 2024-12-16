var audioContext = new (window.AudioContext || window.webkitAudioContext)()
function loadSound(filename) {
 var sound = {volume: 1, audioBuffer: null}
 
 var ajax = new XMLHttpRequest()
 ajax.open("GET", filename, true)
 ajax.responseType = "arraybuffer"
 ajax.onload = function()
 {
  audioContext.decodeAudioData
  (
   ajax.response,
   function(buffer) {
    sound.audioBuffer = buffer
   },
   function(error) {
    debugger
   }
  )
 }
 
 ajax.onerror = function() {
  debugger
 }
 
 ajax.send()
 
 return sound
}
function playSound(sound) {
 if(!sound.audioBuffer)
  return false
 
 var source = audioContext.createBufferSource()
 if(!source)
  return false
 
 source.buffer = sound.audioBuffer
 if(!source.start)
  source.start = source.noteOn
 
 if(!source.start)
  return false
 
 var gainNode = audioContext.createGain()
 gainNode.gain.value = sound.volume
 source.connect(gainNode)
 gainNode.connect(audioContext.destination)
 
 source.start(0)
 
 sound.gainNode = gainNode
 return true
}
function stopSound(sound) {
 if(sound.gainNode)
  sound.gainNode.gain.value = 0
}
function setSoundVolume(sound, volume) {
 sound.volume = volume
 
 if(sound.gainNode)
  sound.gainNode.gain.value = volume
}