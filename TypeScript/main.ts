const fs = require('fs')

// songs
const imagine = ['c', 'cmaj7', 'f', 'am', 'dm', 'g', 'e7']
const somewhere_over_the_rainbow = ['c', 'em', 'f', 'g', 'am']
const tooManyCooks = ['c', 'g', 'f']
const iWillFollowYouIntoTheDark = ['f', 'dm', 'bb', 'c', 'a', 'bbm']
const babyOneMoreTime = ['cm', 'g', 'bb', 'eb', 'fm', 'ab']
const creep = ['g', 'gsus4', 'b', 'bsus4', 'c', 'cmsus4', 'cm6']
const army = ['ab', 'ebm7', 'dbadd9', 'fm7', 'bbm', 'abmaj7', 'ebm']
const paperBag = [
  'bm7',
  'e',
  'c',
  'g',
  'b7',
  'f',
  'em',
  'a',
  'cmaj7',
  'em7',
  'a7',
  'f7',
  'b',
]
const toxic = ['cm', 'eb', 'g', 'cdim', 'eb7', 'd7', 'db7', 'ab', 'gmaj7', 'g7']
const bulletproof = ['d#m', 'g#', 'b', 'f#', 'g#m', 'c#']
const song_11 = []

class ChordDifficultyClassifier {
  songs = []
  labels = []
  allChords = []
  labelCounts = []
  labelProbabilities = []
  chordCountsInLabels = {}
  probabilityOfChordsInLabels = {}

  // 訓練
  train(chords, label) {
    // 將標記與譜寫入 songs
    this.songs.push([label, chords])
    // 將相對應順序的曲目標記寫入 labels
    this.labels.push(label)
    for (let i = 0; i < chords.length; i++) {
      if (!this.allChords.includes(chords[i])) {
        // 將和弦寫入 allChords
        this.allChords.push(chords[i])
      }
    }
    // 將曲目的難度標記進行計數
    if (!!Object.keys(this.labelCounts).includes(label)) {
      this.labelCounts[label] = this.labelCounts[label] + 1
    } else {
      this.labelCounts[label] = 1
    }
  }

  // 依照訓練資料建立難度分布之比率
  setLabelProbabilities() {
    Object.keys(this.labelCounts).forEach((label) => {
      const numberOfSongs = this.getNumberOfSongs()
      this.labelProbabilities[label] = this.labelCounts[label] / numberOfSongs
    })
  }

  // 將各種難度的和弦進行計數
  setChordCountsInLabels() {
    this.songs.forEach((i) => {
      if (this.chordCountsInLabels[i[0]] === undefined) {
        this.chordCountsInLabels[i[0]] = {}
      }
      i[1].forEach((j) => {
        if (this.chordCountsInLabels[i[0]][j] > 0) {
          this.chordCountsInLabels[i[0]][j] =
            this.chordCountsInLabels[i[0]][j] + 1
        } else {
          this.chordCountsInLabels[i[0]][j] = 1
        }
      })
    })
  }

  // 計算各和弦出現於各難度的機率
  setProbabilityOfChordsInLabels() {
    this.probabilityOfChordsInLabels = this.chordCountsInLabels
    Object.keys(this.probabilityOfChordsInLabels).forEach((i) => {
      Object.keys(this.probabilityOfChordsInLabels[i]).forEach((j) => {
        this.probabilityOfChordsInLabels[i][j] =
          (this.probabilityOfChordsInLabels[i][j] * 1.0) / this.songs.length
      })
    })
  }

  // 將輸入的曲目進行分類
  classify(chords) {
    const ttal = this.labelProbabilities
    console.log(ttal)
    const classified = {}
    Object.keys(ttal).forEach((obj) => {
      let first = this.labelProbabilities[obj] + 1.01
      chords.forEach((chord) => {
        const probabilityOfChordsInLabel = this.probabilityOfChordsInLabels[
          obj
        ][chord]
        if (probabilityOfChordsInLabel === undefined) {
          first + 1.01
        } else {
          first = first * (probabilityOfChordsInLabel + 1.01)
        }
      })
      classified[obj] = first
    })
    console.log(classified)
  }

  // 取得總曲目長度
  private getNumberOfSongs() {
    return this.songs.length
  }
}

const chordDifficultyClassifier = new ChordDifficultyClassifier()

chordDifficultyClassifier.train(imagine, 'easy')
chordDifficultyClassifier.train(somewhere_over_the_rainbow, 'easy')
chordDifficultyClassifier.train(tooManyCooks, 'easy')
chordDifficultyClassifier.train(iWillFollowYouIntoTheDark, 'medium')
chordDifficultyClassifier.train(babyOneMoreTime, 'medium')
chordDifficultyClassifier.train(creep, 'medium')
chordDifficultyClassifier.train(paperBag, 'hard')
chordDifficultyClassifier.train(toxic, 'hard')
chordDifficultyClassifier.train(bulletproof, 'hard')

chordDifficultyClassifier.setLabelProbabilities()
chordDifficultyClassifier.setChordCountsInLabels()
chordDifficultyClassifier.setProbabilityOfChordsInLabels()

chordDifficultyClassifier.classify(['d', 'g', 'e', 'dm'])
chordDifficultyClassifier.classify([
  'f#m7',
  'a',
  'dadd9',
  'dmaj7',
  'bm',
  'bm7',
  'd',
  'f#m',
])
