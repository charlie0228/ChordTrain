const fs = require('fs');

// songs
var imagine = ['c', 'cmaj7', 'f', 'am', 'dm', 'g', 'e7'];
var somewhere_over_the_rainbow = ['c', 'em', 'f', 'g', 'am'];
var tooManyCooks = ['c', 'g', 'f'];
var iWillFollowYouIntoTheDark = ['f', 'dm', 'bb', 'c', 'a', 'bbm'];
var babyOneMoreTime = ['cm', 'g', 'bb', 'eb', 'fm', 'ab'];
var creep = ['g', 'gsus4', 'b', 'bsus4', 'c', 'cmsus4', 'cm6'];
var army = ['ab', 'ebm7', 'dbadd9', 'fm7', 'bbm', 'abmaj7', 'ebm'];
var paperBag = ['bm7', 'e', 'c', 'g', 'b7', 'f', 'em', 'a', 'cmaj7', 'em7', 'a7', 'f7', 'b'];
var toxic = ['cm', 'eb', 'g', 'cdim', 'eb7', 'd7', 'db7', 'ab', 'gmaj7', 'g7'];
var bulletproof = ['d#m', 'g#', 'b', 'f#', 'g#m', 'c#'];
var song_11 = [];

var songs = [];
var labels = [];
var allChords = [];
var labelCounts = [];
var labelProbabilities = [];
var chordCountsInLabels = {};
var probabilityOfChordsInLabels = {};

// 訓練
function train(chords, label) {
  // 將標記與譜寫入 songs
  songs.push([label, chords]);
  // 將相對應順序的曲目標記寫入 labels
  labels.push(label);
  for (var i = 0; i < chords.length; i++) {
    if (!allChords.includes(chords[i])) {
      // 將和弦寫入 allChords
      allChords.push(chords[i]);
    }
  }
  // 將曲目的難度標記進行計數
  if(!!(Object.keys(labelCounts).includes(label))){
    labelCounts[label] = labelCounts[label] + 1;
  } else {
    labelCounts[label] = 1;
  }
};

// 取得總曲目長度
function getNumberOfSongs(){
  return songs.length;
};

// 依照訓練資料建立難度分布之比率
function setLabelProbabilities(){
  Object.keys(labelCounts).forEach(function(label){
    var numberOfSongs = getNumberOfSongs();
    labelProbabilities[label] = labelCounts[label] / numberOfSongs;
  });
};

// 將各種難度的和弦進行計數
function setChordCountsInLabels(){
  songs.forEach(function(i){
    if(chordCountsInLabels[i[0]] === undefined){
      chordCountsInLabels[i[0]] = {};
    }
    i[1].forEach(function(j){
      if(chordCountsInLabels[i[0]][j] > 0){
        chordCountsInLabels[i[0]][j] = chordCountsInLabels[i[0]][j] + 1;
      } else {
        chordCountsInLabels[i[0]][j] = 1;
      }
    })
  })
}

// 計算各和弦出現於各難度的機率
function setProbabilityOfChordsInLabels(){
  probabilityOfChordsInLabels = chordCountsInLabels;
  Object.keys(probabilityOfChordsInLabels).forEach(function (i){
    Object.keys(probabilityOfChordsInLabels[i]).forEach(function (j) {
      probabilityOfChordsInLabels[i][j] = probabilityOfChordsInLabels[i][j] * 1.0 / songs.length;
    });
  });
}

train(imagine, 'easy');
train(somewhere_over_the_rainbow, 'easy');
train(tooManyCooks, 'easy');
train(iWillFollowYouIntoTheDark, 'medium');
train(babyOneMoreTime, 'medium');
train(creep, 'medium');
train(paperBag, 'hard');
train(toxic, 'hard');
train(bulletproof, 'hard');

setLabelProbabilities();
setChordCountsInLabels();
setProbabilityOfChordsInLabels();

// 將輸入的曲目進行分類
export function classify(chords){
  var ttal = labelProbabilities;
  // console.log(ttal);
  var classified = {};
  Object.keys(ttal).forEach(function(obj) {
    var first = labelProbabilities[obj] + 1.01;
    chords.forEach(function(chord){
      var probabilityOfChordsInLabel = probabilityOfChordsInLabels[obj][chord];
      if(probabilityOfChordsInLabel === undefined){
        first + 1.01;
      } else {
        first = first * (probabilityOfChordsInLabel + 1.01);
      }
    });
    classified[obj] = first;
  });
  console.log(classified);
};

classify(['d', 'g', 'e', 'dm']);
classify(['f#m7', 'a', 'dadd9', 'dmaj7', 'bm', 'bm7', 'd', 'f#m']);
