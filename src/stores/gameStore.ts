// Zustandによるゲーム全体の状態管理ストア（フェーズ・証拠・会話履歴・仮説など）
import { create } from 'zustand'
import type {
  GamePhase,
  ConfrontationEntry,
  Difficulty,
  SuspectHypothesis,
  UnlockedPursuitQuestion,
  PendingPursuitActivation,
  PursuitWrongResult,
} from '../types/game'
import type { Scenario } from '../types/scenario'
import { DIFFICULTY_CONFIG } from '../constants/gameConfig'
import { getRootQuestionIds } from '../utils/scenario'

// 詳細調査済みの証拠IDリストとシナリオを元に、新たに発見すべき組み合わせIDを返すヘルパー
function checkCombinations(
  scenario: Scenario | null,
  examinedIds: string[],
  alreadyDiscovered: string[]
): string[] {
  if (!scenario?.evidence_combinations) return []
  return scenario.evidence_combinations
    .filter(
      (c) =>
        !alreadyDiscovered.includes(c.id) &&
        c.evidence_ids.every((eid) => examinedIds.includes(eid))
    )
    .map((c) => c.id)
}

// localStorage キー生成（シナリオタイトルをキーとして仮説データを区別する）
const hypothesesKey = (scenarioTitle: string) => `whodunit_hypotheses_${scenarioTitle}`

export interface HeardStatement {
  suspectId: string
  suspectName: string
  index: number // -1 = greeting, 0以上 = statements[index]
  text: string
}

export interface GameState {
  phase: GamePhase
  apiKey: string | null
  useFixedScenario: boolean
  scenario: Scenario | null
  isGenerating: boolean
  generationError: string | null
  difficulty: Difficulty
  actionsRemaining: number
  talkActionsRemaining: number
  currentRoomId: string | null
  inspectedEvidenceIds: string[] // 1段階目：外観開示済み
  examinedEvidenceIds: string[] // 2段階目：論理的示唆開示済み
  discoveredCombinationIds: string[] // 発見済み証拠組み合わせID
  pendingCombinationIds: string[] // 通知待ち組み合わせIDキュー（先頭を表示）
  revealedFakeEvidenceIds: string[] // 偽と判明した証拠IDリスト（2段階目調査後に追加）
  pendingFakeRevealId: string | null // 「欺瞞を見破った！」演出待ち偽証拠ID
  talkedSuspectIds: string[]
  heardStatements: HeardStatement[]
  confrontationLog: ConfrontationEntry[]
  unlockedPursuitQuestions: UnlockedPursuitQuestion[] // 証言選択成功後にアンロックされた追及質問
  askedPursuitQuestionIds: string[] // 既に質問済みの追及質問ID
  pendingPursuitActivation: PendingPursuitActivation | null // 証言選択待ち状態
  pursuitWrongResult: PursuitWrongResult | null // 誤った証言を選択したときのフィードバック
  viewedSuspectProfileIds: string[] // プロフィール閲覧済みの容疑者ID
  votedSuspectId: string | null
  hypotheses: SuspectHypothesis[] // 容疑者ごとの仮説メモ

  // Actions
  setPhase: (phase: GamePhase) => void
  setApiKey: (key: string | null) => void
  setUseFixedScenario: (use: boolean) => void
  setScenario: (scenario: Scenario) => void
  setIsGenerating: (generating: boolean) => void
  setGenerationError: (error: string | null) => void
  setDifficulty: (difficulty: Difficulty) => void
  setCurrentRoomId: (id: string | null) => void
  inspectEvidence: (evidenceId: string) => void
  examineEvidence: (evidenceId: string) => void
  clearPendingCombination: () => void
  clearFakeReveal: () => void
  talkToSuspect: (suspectId: string) => void
  consumeAction: () => void
  hearStatement: (entry: HeardStatement) => void
  addConfrontation: (entry: Omit<ConfrontationEntry, 'timestamp'>) => void
  initiatePursuitActivation: (suspectId: string, evidenceId: string) => void
  selectTestimonyForPursuit: (suspectId: string, statementIndex: number) => void
  clearPursuitActivation: () => void
  clearPursuitWrongResult: () => void
  askPursuitQuestion: (suspectId: string, evidenceId: string, questionId: string) => void
  viewSuspectProfile: (suspectId: string) => void
  setVotedSuspectId: (id: string) => void
  updateHypothesis: (
    suspectId: string,
    field: keyof Omit<SuspectHypothesis, 'suspectId'>,
    value: string
  ) => void
  resetGame: () => void
}

// IDリストへの重複なし追加ヘルパー（既存の場合はearly returnでno-op）
const addId = (arr: string[], id: string) => (arr.includes(id) ? null : [...arr, id])

// 追及質問のルートQをアンロックする内部ヘルパー
function buildRootUnlocks(
  scenario: Scenario,
  suspectId: string,
  evidenceId: string,
  alreadyUnlocked: UnlockedPursuitQuestion[]
): UnlockedPursuitQuestion[] {
  const pqs =
    scenario.suspects.find((s) => s.id === suspectId)?.evidence_reactions[evidenceId]
      ?.pursuit_questions ?? []
  return getRootQuestionIds(pqs)
    .filter((id) => !alreadyUnlocked.some((u) => u.questionId === id))
    .map((id) => ({ suspectId, evidenceId, questionId: id }))
}

const initialState = {
  phase: 'title' as GamePhase,
  apiKey: null,
  useFixedScenario: false,
  scenario: null,
  isGenerating: false,
  generationError: null,
  difficulty: 'normal' as Difficulty,
  actionsRemaining: DIFFICULTY_CONFIG.normal.actions,
  talkActionsRemaining: DIFFICULTY_CONFIG.normal.talkActions,
  currentRoomId: null,
  inspectedEvidenceIds: [],
  examinedEvidenceIds: [],
  discoveredCombinationIds: [],
  pendingCombinationIds: [],
  revealedFakeEvidenceIds: [],
  pendingFakeRevealId: null,
  talkedSuspectIds: [],
  heardStatements: [],
  confrontationLog: [],
  unlockedPursuitQuestions: [],
  askedPursuitQuestionIds: [],
  pendingPursuitActivation: null,
  pursuitWrongResult: null,
  viewedSuspectProfileIds: [],
  votedSuspectId: null,
  hypotheses: [],
}

export const useGameStore = create<GameState>((set) => ({
  ...initialState,

  // ゲームフェーズを更新する
  setPhase: (phase) => set({ phase }),
  // APIキーを更新する
  setApiKey: (key) => set({ apiKey: key }),
  // 固定シナリオ使用フラグを更新する
  setUseFixedScenario: (use) => set({ useFixedScenario: use }),
  // シナリオデータを設定し、保存済み仮説を localStorage から復元する
  setScenario: (scenario) =>
    set(() => {
      let hypotheses: SuspectHypothesis[] = []
      try {
        const stored = localStorage.getItem(hypothesesKey(scenario.title))
        if (stored) hypotheses = JSON.parse(stored) as SuspectHypothesis[]
      } catch {
        /* localStorage が使えない環境では仮説を空のまま初期化 */
      }
      return { scenario, hypotheses }
    }),
  // 生成中フラグを更新する
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  // 生成エラーメッセージを更新する
  setGenerationError: (error) => set({ generationError: error }),
  // 難易度を設定し、アクション残数を初期値にリセットする
  setDifficulty: (difficulty) =>
    set({
      difficulty,
      actionsRemaining: DIFFICULTY_CONFIG[difficulty].actions,
      talkActionsRemaining: DIFFICULTY_CONFIG[difficulty].talkActions,
    }),
  // 現在の選択部屋IDを更新する
  setCurrentRoomId: (id) => set({ currentRoomId: id }),
  // 証拠を外観開示済みリストに追加する（1段階目、重複追加しない）
  inspectEvidence: (evidenceId) =>
    set((state) => {
      const next = addId(state.inspectedEvidenceIds, evidenceId)
      return next ? { inspectedEvidenceIds: next } : {}
    }),
  // 証拠を論理的示唆開示済みリストに追加し、組み合わせ発見・偽証拠発覚をチェックする（2段階目）
  examineEvidence: (evidenceId) =>
    set((state) => {
      const next = addId(state.examinedEvidenceIds, evidenceId)
      if (!next) return {}
      const newlyDiscovered = checkCombinations(
        state.scenario,
        next,
        state.discoveredCombinationIds
      )
      const isFake = state.scenario?.evidence.find((e) => e.id === evidenceId)?.is_fake ?? false
      const isNewFakeReveal = isFake && !state.revealedFakeEvidenceIds.includes(evidenceId)
      return {
        examinedEvidenceIds: next,
        ...(newlyDiscovered.length > 0 && {
          discoveredCombinationIds: [...state.discoveredCombinationIds, ...newlyDiscovered],
          pendingCombinationIds: [...state.pendingCombinationIds, ...newlyDiscovered],
        }),
        ...(isNewFakeReveal && {
          revealedFakeEvidenceIds: [...state.revealedFakeEvidenceIds, evidenceId],
          pendingFakeRevealId: state.pendingFakeRevealId ?? evidenceId,
        }),
      }
    }),
  // 通知済みの先頭組み合わせをキューから取り除く
  clearPendingCombination: () =>
    set((state) => ({ pendingCombinationIds: state.pendingCombinationIds.slice(1) })),
  // 偽証拠発覚演出を閉じる
  clearFakeReveal: () => set({ pendingFakeRevealId: null }),
  // 容疑者を会話済みリストに追加する（重複追加しない）
  talkToSuspect: (suspectId) =>
    set((state) => {
      const next = addId(state.talkedSuspectIds, suspectId)
      return next ? { talkedSuspectIds: next } : {}
    }),
  // 調査アクションを1消費する（0を下回らない）
  consumeAction: () =>
    set((state) => ({
      actionsRemaining: Math.max(0, state.actionsRemaining - 1),
    })),
  // 証言を記録してトーク回数を消費する（既聴の場合は消費しない）
  hearStatement: (entry) =>
    set((state) => {
      const alreadyHeard = state.heardStatements.some(
        (s) => s.suspectId === entry.suspectId && s.index === entry.index
      )
      if (alreadyHeard) return {}
      return {
        talkActionsRemaining: Math.max(0, state.talkActionsRemaining - 1),
        heardStatements: [...state.heardStatements, entry],
      }
    }),
  // 容疑者への証拠突きつけ記録をタイムスタンプ付きで追加する（追及質問のアンロックは証言選択後）
  addConfrontation: (entry) =>
    set((state) => ({
      confrontationLog: [...state.confrontationLog, { ...entry, timestamp: Date.now() }],
    })),
  // 証言選択モードを開始する（捜査メモの証言タブが自動オープンされる）
  initiatePursuitActivation: (suspectId, evidenceId) =>
    set({ pendingPursuitActivation: { suspectId, evidenceId }, pursuitWrongResult: null }),
  // 証言を選択して追及質問を試みる：正解ならルート質問をアンロック、不正解なら wrong リアクションを表示
  selectTestimonyForPursuit: (suspectId, statementIndex) =>
    set((state) => {
      if (!state.pendingPursuitActivation || !state.scenario) return {}
      const { suspectId: pendingSuspectId, evidenceId } = state.pendingPursuitActivation
      const suspect = state.scenario.suspects.find((s) => s.id === pendingSuspectId)
      if (!suspect) return {}

      const reaction = suspect.evidence_reactions[evidenceId]
      const isCorrect =
        reaction?.contradicts_statement_index !== undefined &&
        reaction.contradicts_statement_index === statementIndex &&
        suspectId === pendingSuspectId

      if (isCorrect) {
        const newUnlocked = buildRootUnlocks(
          state.scenario,
          pendingSuspectId,
          evidenceId,
          state.unlockedPursuitQuestions
        )
        return {
          pendingPursuitActivation: null,
          pursuitWrongResult: null,
          ...(newUnlocked.length > 0 && {
            unlockedPursuitQuestions: [...state.unlockedPursuitQuestions, ...newUnlocked],
          }),
        }
      }

      // 不正解：evidence固有 → 容疑者デフォルト の優先順で使用
      const wrongResponse =
        reaction?.wrong_testimony_response ?? suspect.default_wrong_pursuit_response
      return {
        pendingPursuitActivation: null,
        pursuitWrongResult: { suspectId: suspect.id, response: wrongResponse },
      }
    }),
  // 証言選択モードをキャンセルする
  clearPursuitActivation: () => set({ pendingPursuitActivation: null }),
  // 誤り選択フィードバックを消去する
  clearPursuitWrongResult: () => set({ pursuitWrongResult: null }),
  // 追及質問を既読にし、連鎖する次の質問をアンロックする
  askPursuitQuestion: (suspectId, evidenceId, questionId) =>
    set((state) => {
      if (state.askedPursuitQuestionIds.includes(questionId)) return {}

      const pqs =
        state.scenario?.suspects.find((s) => s.id === suspectId)?.evidence_reactions[evidenceId]
          ?.pursuit_questions ?? []
      const question = pqs.find((q) => q.id === questionId)

      const newUnlocked: UnlockedPursuitQuestion[] = (question?.unlocks_pursuit_question_ids ?? [])
        .filter((id) => !state.unlockedPursuitQuestions.some((u) => u.questionId === id))
        .map((id) => ({ suspectId, evidenceId, questionId: id }))

      return {
        askedPursuitQuestionIds: [...state.askedPursuitQuestionIds, questionId],
        ...(newUnlocked.length > 0 && {
          unlockedPursuitQuestions: [...state.unlockedPursuitQuestions, ...newUnlocked],
        }),
      }
    }),
  // 容疑者プロフィールを閲覧済みにする（重複追加しない）
  viewSuspectProfile: (suspectId) =>
    set((state) => {
      const next = addId(state.viewedSuspectProfileIds, suspectId)
      return next ? { viewedSuspectProfileIds: next } : {}
    }),
  // 投票した容疑者IDを設定する
  setVotedSuspectId: (id) => set({ votedSuspectId: id }),
  // 容疑者の仮説フィールドを更新し、localStorage に保存する
  updateHypothesis: (suspectId, field, value) =>
    set((state) => {
      let found = false
      const mapped = state.hypotheses.map((h) => {
        if (h.suspectId !== suspectId) return h
        found = true
        return { ...h, [field]: value }
      })
      const updated = found
        ? mapped
        : [
            ...state.hypotheses,
            { suspectId, motive: '', opportunity: '', means: '', notes: '', [field]: value },
          ]
      try {
        if (state.scenario) {
          localStorage.setItem(hypothesesKey(state.scenario.title), JSON.stringify(updated))
        }
      } catch {
        /* localStorage への保存失敗は無視 */
      }
      return { hypotheses: updated }
    }),
  // ゲームをリセットして同一シナリオ・APIキーで再挑戦できる状態にする（仮説も削除）
  resetGame: () =>
    set((state) => {
      try {
        if (state.scenario) {
          localStorage.removeItem(hypothesesKey(state.scenario.title))
        }
      } catch {
        /* localStorage からの削除失敗は無視 */
      }
      return {
        ...initialState,
        phase: 'scenario_briefing' as GamePhase,
        scenario: state.scenario,
        apiKey: state.apiKey,
        useFixedScenario: state.useFixedScenario,
        difficulty: state.difficulty,
        actionsRemaining: DIFFICULTY_CONFIG[state.difficulty].actions,
        talkActionsRemaining: DIFFICULTY_CONFIG[state.difficulty].talkActions,
      }
    }),
}))
