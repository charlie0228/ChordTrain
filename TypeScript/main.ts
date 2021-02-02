// songs
const imagine = ['c', 'cmaj7', 'f', 'am', 'dm', 'g', 'e7']
const somewhere_over_the_rainbow = ['c', 'em', 'f', 'g', 'am']
const tooManyCooks = ['c', 'g', 'f']
const iWillFollowYouIntoTheDark = ['f', 'dm', 'bb', 'c', 'a', 'bbm']
const babyOneMoreTime = ['cm', 'g', 'bb', 'eb', 'fm', 'ab']
const creep = ['g', 'gsus4', 'b', 'bsus4', 'c', 'cmsus4', 'cm6']
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

class ChordDifficultyClassifier {
  songs: [string, string[]][] = []
  labelCounts: Record<string, number> = {}
  labelProbabilities: Record<string, number> = {}
  chordCountsInLabels: Record<string, Record<string, number>> = {}
  probabilityOfChordsInLabels: Record<string, Record<string, number>> = {}

  // 訓練
  addDataset(chords: string[], label: string) {
    // 將標記與譜寫入 songs
    this.songs.push([label, chords])

    // 將曲目的難度標記進行計數
    if (!!Object.keys(this.labelCounts).includes(label)) {
      this.labelCounts[label] = this.labelCounts[label] + 1
    } else {
      this.labelCounts[label] = 1
    }
  }

  // 將輸入的曲目進行分類
  classify(chords: string[]) {
    const ttal = this.labelProbabilities
    // console.log(ttal)
    const classified: Record<string, number> = {}
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

  // 依照訓練資料進行訓練
  train() {
    this.setLabelProbabilities()
    this.setChordCountsInLabels()
    this.setProbabilityOfChordsInLabels()
  }

  // 依照訓練資料建立難度分布之比率
  private setLabelProbabilities() {
    Object.keys(this.labelCounts).forEach((label) => {
      this.labelProbabilities[label] =
        this.labelCounts[label] / this.numberOfSongs
    })
  }

  // 將各種難度的和弦進行計數
  private setChordCountsInLabels() {
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
  private setProbabilityOfChordsInLabels() {
    Object.keys(this.chordCountsInLabels).forEach((i) => {
      this.probabilityOfChordsInLabels[i] = {}
      Object.keys(this.chordCountsInLabels[i]).forEach((j) => {
        this.probabilityOfChordsInLabels[i][j] =
          (this.chordCountsInLabels[i][j] * 1.0) / this.numberOfSongs
      })
    })
  }

  // 取得總曲目長度
  private get numberOfSongs() {
    return this.songs.length
  }
}

export const classify = (chords: string[]): void => {
  const classifier = new ChordDifficultyClassifier()

  classifier.addDataset(imagine, 'easy')
  classifier.addDataset(somewhere_over_the_rainbow, 'easy')
  classifier.addDataset(tooManyCooks, 'easy')
  classifier.addDataset(iWillFollowYouIntoTheDark, 'medium')
  classifier.addDataset(babyOneMoreTime, 'medium')
  classifier.addDataset(creep, 'medium')
  classifier.addDataset(paperBag, 'hard')
  classifier.addDataset(toxic, 'hard')
  classifier.addDataset(bulletproof, 'hard')

  classifier.train()

  classifier.classify(chords)
}

classify(['d', 'g', 'e', 'dm'])
classify(['f#m7', 'a', 'dadd9', 'dmaj7', 'bm', 'bm7', 'd', 'f#m'])
