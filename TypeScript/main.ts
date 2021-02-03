// songs
const imagine = ['c', 'cmaj7', 'f', 'am', 'dm', 'g', 'e7']
const somewhereOverTheRainbow = ['c', 'em', 'f', 'g', 'am']
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

type Chords = string[]
type Label = string
type LabeledTrainingDataset = [Label, Chords]
class ChordDifficultyClassifier {
  songs: LabeledTrainingDataset[] = []
  labelCounts: Record<Label, number> = {}
  labelProbabilities: Record<Label, number> = {}
  chordCountsInLabels: Record<string, Record<string, number>> = {}
  probabilityOfChordsInLabels: Record<string, Record<string, number>> = {}

  // 寫入訓練資料
  addDatasets(datasets: LabeledTrainingDataset[]) {
    // 將標記與譜寫入 songs
    this.songs.push(...datasets)
  }

  // 依照訓練資料進行訓練
  train() {
    this.countLabels()
    this.setLabelProbabilities()
    this.setChordCountsInLabels()
    this.setProbabilityOfChordsInLabels()
  }

  // 將輸入的曲目進行分類
  classify(chords: Chords) {
    const ttal = this.labelProbabilities
    // console.log(ttal)
    const classified: Record<Label, number> = {}
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

  // 將曲目的難度標記進行計數
  private countLabels() {
    this.labelCounts = this.songs.reduce<Record<Label, number>>(
      (acc, [label]) => {
        acc[label] = acc[label] === undefined ? 1 : acc[label] + 1
        return acc
      },
      {}
    )
  }

  // 依照訓練資料建立難度分布之比率
  private setLabelProbabilities() {
    this.labelProbabilities = Object.keys(this.labelCounts).reduce<
      Record<Label, number>
    >((acc, label) => {
      acc[label] = this.labelCounts[label] / this.numberOfSongs
      return acc
    }, {})
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

export const classify = (chords: Chords): void => {
  const classifier = new ChordDifficultyClassifier()

  classifier.addDatasets([
    ['easy', imagine],
    ['easy', somewhereOverTheRainbow],
    ['easy', tooManyCooks],
    ['medium', iWillFollowYouIntoTheDark],
    ['medium', babyOneMoreTime],
    ['medium', creep],
    ['hard', paperBag],
    ['hard', toxic],
    ['hard', bulletproof],
  ])

  classifier.train()

  classifier.classify(chords)
}

classify(['d', 'g', 'e', 'dm'])
classify(['f#m7', 'a', 'dadd9', 'dmaj7', 'bm', 'bm7', 'd', 'f#m'])
