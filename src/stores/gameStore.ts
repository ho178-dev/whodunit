// Zustandによるゲーム全体の状態管理ストア（フェーズ・証拠・会話履歴・仮説など）
import { create } from 'zustand'
import type {
  GamePhase,
  ConfrontationEntry,
  SuspectHypothesis,
  UnlockedPursuitQuestion,
  PendingPursuitActivation,
  PursuitWrongResult,
} from '../types/game'
import type { Scenario } from '../types/scenario'
import {
  ACTIONS,
  TALK_ACTIONS,
  DISCUSSION_CONFRONT_ACTIONS,
  ACCUSATION_CONFRONT_ACTIONS,
} from '../constants/gameConfig'
import { getRootQuestionIds } from '../utils/scenario'
import { SAVE_VERSION } from '../types/save'
import type { SaveInput } from '../types/save'
import { saveToSlot, loadFromSlot } from '../utils/saveLoad'
import { getFixedScenarioByTitle } from '../utils/scenarioRegistry'
import { TUTORIAL_SCENARIO } from '../constants/tutorialScenario'

// localStorage キー生成（シナリオタイトルをキーとして仮説データを区別する）
const hypothesesKey = (scenarioTitle: string) => `whodunit_hypotheses_${scenarioTitle}`

// シナリオタイトルに対応する保存済み仮説を localStorage から読み込む
function loadHypotheses(scenarioTitle: string): SuspectHypothesis[] {
  try {
    const stored = localStorage.getItem(hypothesesKey(scenarioTitle))
    if (stored) return JSON.parse(stored) as SuspectHypothesis[]
  } catch {
    /* localStorage が使えない環境では空を返す */
  }
  return []
}

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
  actionsRemaining: number
  talkActionsRemaining: number
  discussionConfrontActionsRemaining: number // 議論フェーズの証拠突きつけAP
  accusationConfrontActionsRemaining: number // 告発フェーズの証拠突きつけAP
  currentRoomId: string | null
  suspectTalkProgress: Record<string, number> // 容疑者ごとの会話進行インデックス（dialogIndex）
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
  successfulPursuitSuspectIds: string[] // 議論フェーズで矛盾追及に成功した容疑者IDリスト
  pendingPursuitActivation: PendingPursuitActivation | null // 証言選択待ち状態
  pursuitWrongResult: PursuitWrongResult | null // 誤った証言を選択したときのフィードバック
  viewedSuspectProfileIds: string[] // プロフィール閲覧済みの容疑者ID
  votedSuspectId: string | null
  murdererEscaped: boolean // 犯人特定したが証拠不足で逃亡したか
  hypotheses: SuspectHypothesis[] // 容疑者ごとの仮説メモ
  activeSaveSlot: number | null // 現在書き込み先のスロット番号（null = セーブ無効）
  isTutorialScenario: boolean // チュートリアル用練習シナリオ中フラグ（セーブ不要）

  // Actions
  setPhase: (phase: GamePhase) => void
  setApiKey: (key: string | null) => void
  setUseFixedScenario: (use: boolean) => void
  setScenario: (scenario: Scenario) => void
  setIsGenerating: (generating: boolean) => void
  setGenerationError: (error: string | null) => void
  setCurrentRoomId: (id: string | null) => void
  inspectEvidence: (evidenceId: string) => void
  examineEvidence: (evidenceId: string) => void
  clearPendingCombination: () => void
  clearFakeReveal: () => void
  talkToSuspect: (suspectId: string) => void
  consumeAction: () => void
  hearStatement: (entry: HeardStatement) => void
  addConfrontation: (entry: Omit<ConfrontationEntry, 'timestamp'>) => void
  consumeDiscussionConfrontAction: () => void
  consumeAccusationConfrontAction: () => void
  initiatePursuitActivation: (suspectId: string, evidenceId: string) => void
  selectTestimonyForPursuit: (suspectId: string, statementIndex: number) => void
  clearPursuitActivation: () => void
  clearPursuitWrongResult: () => void
  askPursuitQuestion: (suspectId: string, evidenceId: string, questionId: string) => void
  viewSuspectProfile: (suspectId: string) => void
  tryCombineEvidence: (evidenceIds: string[]) => {
    matched: boolean
    alreadyDiscovered?: boolean
    /** 証拠の方向性は合っているが情報が不足している（部分一致 or 人物条件未充足） */
    hint?: boolean
  }
  setSuspectTalkProgress: (suspectId: string, index: number) => void
  setVotedSuspectId: (id: string) => void
  setMurdererEscaped: (escaped: boolean) => void
  updateHypothesis: (
    suspectId: string,
    field: keyof Omit<SuspectHypothesis, 'suspectId'>,
    value: string
  ) => void
  resetGame: () => void
  setActiveSaveSlot: (slot: number | null) => void
  loadSaveSlot: (slotIndex: number) => void
  manualSave: (slotIndex: number) => void
  startScenario: (scenario: Scenario) => void
  startTutorialScenario: () => void
  unlockAllForDebug: () => void
  refillAllAP: () => void
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
  actionsRemaining: ACTIONS,
  talkActionsRemaining: TALK_ACTIONS,
  discussionConfrontActionsRemaining: DISCUSSION_CONFRONT_ACTIONS,
  accusationConfrontActionsRemaining: ACCUSATION_CONFRONT_ACTIONS,
  currentRoomId: null,
  suspectTalkProgress: {},
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
  successfulPursuitSuspectIds: [],
  pendingPursuitActivation: null,
  pursuitWrongResult: null,
  viewedSuspectProfileIds: [],
  votedSuspectId: null,
  murdererEscaped: false,
  hypotheses: [],
  activeSaveSlot: null,
  isTutorialScenario: false,
}

// 自動セーブ対象フェーズ（title / scenario_select / api_key_input / generating への遷移時は保存しない）
const AUTO_SAVE_PHASES: GamePhase[] = [
  'scenario_briefing',
  'investigation',
  'discussion',
  'voting',
  'accusation',
  'ending',
]

// GameState と遷移先フェーズから SaveInput を構築するヘルパー（setPhase / loadSaveSlot で共用）
function buildSaveInput(state: GameState, phase: GamePhase): SaveInput {
  return {
    version: SAVE_VERSION,
    scenarioTitle: state.scenario!.title,
    phase,
    currentRoomId: state.currentRoomId,
    actionsRemaining: state.actionsRemaining,
    talkActionsRemaining: state.talkActionsRemaining,
    discussionConfrontActionsRemaining: state.discussionConfrontActionsRemaining,
    accusationConfrontActionsRemaining: state.accusationConfrontActionsRemaining,
    inspectedEvidenceIds: state.inspectedEvidenceIds,
    examinedEvidenceIds: state.examinedEvidenceIds,
    discoveredCombinationIds: state.discoveredCombinationIds,
    revealedFakeEvidenceIds: state.revealedFakeEvidenceIds,
    talkedSuspectIds: state.talkedSuspectIds,
    viewedSuspectProfileIds: state.viewedSuspectProfileIds,
    heardStatements: state.heardStatements,
    confrontationLog: state.confrontationLog,
    unlockedPursuitQuestions: state.unlockedPursuitQuestions,
    askedPursuitQuestionIds: state.askedPursuitQuestionIds,
    successfulPursuitSuspectIds: state.successfulPursuitSuspectIds,
    votedSuspectId: state.votedSuspectId,
    hypotheses: state.hypotheses,
    murdererEscaped: state.murdererEscaped,
  }
}

export const useGameStore = create<GameState>((set, get) => ({
  ...initialState,

  // ゲームフェーズを更新する。固定シナリオかつスロット設定済みの場合は自動セーブする
  setPhase: (phase) => {
    set((state) => {
      if (
        state.activeSaveSlot !== null &&
        state.useFixedScenario &&
        state.scenario &&
        AUTO_SAVE_PHASES.includes(phase)
      ) {
        saveToSlot(state.activeSaveSlot, buildSaveInput(state, phase))
      }
      return { phase }
    })
  },
  // APIキーを更新する
  setApiKey: (key) => set({ apiKey: key }),
  // 固定シナリオ使用フラグを更新する
  setUseFixedScenario: (use) => set({ useFixedScenario: use }),
  // シナリオデータを設定し、保存済み仮説を localStorage から復元する
  setScenario: (scenario) => set({ scenario, hypotheses: loadHypotheses(scenario.title) }),
  // 生成中フラグを更新する
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  // 生成エラーメッセージを更新する
  setGenerationError: (error) => set({ generationError: error }),
  // 現在の選択部屋IDを更新する
  setCurrentRoomId: (id) => set({ currentRoomId: id }),
  // 証拠を外観開示済みリストに追加する（1段階目、重複追加しない）
  inspectEvidence: (evidenceId) =>
    set((state) => {
      const next = addId(state.inspectedEvidenceIds, evidenceId)
      return next ? { inspectedEvidenceIds: next } : {}
    }),
  // 証拠を論理的示唆開示済みリストに追加し、偽証拠発覚をチェックする（2段階目）
  // 組み合わせ発見は手動操作（tryCombineEvidence）に委ねるため自動チェックしない
  examineEvidence: (evidenceId) =>
    set((state) => {
      const next = addId(state.examinedEvidenceIds, evidenceId)
      if (!next) return {}
      const isFake = state.scenario?.evidence.find((e) => e.id === evidenceId)?.is_fake ?? false
      const isNewFakeReveal = isFake && !state.revealedFakeEvidenceIds.includes(evidenceId)
      return {
        examinedEvidenceIds: next,
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
  // 議論フェーズの証拠突きつけAPを1消費する（0を下回らない）
  consumeDiscussionConfrontAction: () =>
    set((state) => ({
      discussionConfrontActionsRemaining: Math.max(0, state.discussionConfrontActionsRemaining - 1),
    })),
  // 告発フェーズの証拠突きつけAPを1消費する（0を下回らない）
  consumeAccusationConfrontAction: () =>
    set((state) => ({
      accusationConfrontActionsRemaining: Math.max(0, state.accusationConfrontActionsRemaining - 1),
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
        const alreadyRecorded = state.successfulPursuitSuspectIds.includes(pendingSuspectId)
        return {
          pendingPursuitActivation: null,
          pursuitWrongResult: null,
          ...(!alreadyRecorded && {
            successfulPursuitSuspectIds: [...state.successfulPursuitSuspectIds, pendingSuspectId],
          }),
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
        discussionConfrontActionsRemaining: Math.max(
          0,
          state.discussionConfrontActionsRemaining - 1
        ),
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
      if (!next) return {}
      return { viewedSuspectProfileIds: next }
    }),
  // 選択した証拠品の組み合わせを手動で検討する
  // 組み合わせが新たに解放された場合はpendingに積みtrueを返す。不正解の場合はfalseを返す
  tryCombineEvidence: (evidenceIds) => {
    const state = get()
    if (!state.scenario?.evidence_combinations) return { matched: false }

    const sorted = [...evidenceIds].sort()
    const sameIds = (comboIds: string[]) => {
      const cs = [...comboIds].sort()
      return cs.length === sorted.length && cs.every((id, i) => id === sorted[i])
    }

    let hint = false
    for (const c of state.scenario.evidence_combinations) {
      if (sameIds(c.evidence_ids)) {
        if (state.discoveredCombinationIds.includes(c.id)) {
          return { matched: false, alreadyDiscovered: true }
        }
        // 証拠未検査の場合はヒント扱い
        if (!evidenceIds.every((id) => state.examinedEvidenceIds.includes(id))) {
          hint = true
          continue
        }
        // 全証拠が検査済みであれば発見
        set((s) => ({
          discoveredCombinationIds: [...s.discoveredCombinationIds, c.id],
          pendingCombinationIds: [...s.pendingCombinationIds, c.id],
        }))
        return { matched: true }
      } else if (
        !state.discoveredCombinationIds.includes(c.id) &&
        evidenceIds.every((id) => c.evidence_ids.includes(id)) &&
        evidenceIds.length < c.evidence_ids.length
      ) {
        // 選択した全証拠が組み合わせのevidence_idsに含まれるが選択数が不足
        hint = true
      }
    }

    return hint ? { matched: false, hint: true } : { matched: false }
  },
  // 容疑者ごとの会話進行インデックスを更新する
  setSuspectTalkProgress: (suspectId, index) =>
    set((state) => ({
      suspectTalkProgress: { ...state.suspectTalkProgress, [suspectId]: index },
    })),
  // 投票した容疑者IDを設定する
  setVotedSuspectId: (id) => set({ votedSuspectId: id }),
  // 犯人逃亡フラグを設定する（証拠不足で逃げ切った場合にtrue）
  setMurdererEscaped: (escaped) => set({ murdererEscaped: escaped }),
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
        activeSaveSlot: state.activeSaveSlot,
        isTutorialScenario: state.isTutorialScenario,
      }
    }),

  // 自動セーブ先スロット番号を設定する（null でセーブ無効化）
  setActiveSaveSlot: (slot) => set({ activeSaveSlot: slot }),

  // 指定した手動スロット（1〜3）に現在のゲーム状態を保存する
  manualSave: (slotIndex) => {
    const state = get()
    if (!state.scenario || !state.useFixedScenario) return
    saveToSlot(slotIndex, buildSaveInput(state, state.phase))
  },

  // チュートリアル用練習シナリオを開始する。セーブなし・isTutorialScenario=trueで開始する
  startTutorialScenario: () => {
    set({
      ...initialState,
      scenario: TUTORIAL_SCENARIO,
      useFixedScenario: true,
      isTutorialScenario: true,
      activeSaveSlot: null,
      phase: 'scenario_briefing' as GamePhase,
    })
  },

  // シナリオ選択画面からシナリオを開始する。ゲーム状態を完全リセットしてシナリオを設定する
  startScenario: (scenario) => {
    const hypotheses = loadHypotheses(scenario.title)
    set({
      ...initialState,
      scenario,
      hypotheses,
      useFixedScenario: true,
      activeSaveSlot: 0,
      phase: 'scenario_briefing' as GamePhase,
    })
  },

  // [dev] 全証拠・全証言をアンロックする（探索フェーズのデバッグ用）
  unlockAllForDebug: () =>
    set((state) => {
      if (!state.scenario) return {}
      const allEvidenceIds = state.scenario.evidence.map((e) => e.id)
      const allSuspectIds = state.scenario.suspects.map((s) => s.id)
      const newStatements: HeardStatement[] = []
      state.scenario.suspects.forEach((suspect) => {
        if (!state.heardStatements.some((h) => h.suspectId === suspect.id && h.index === -1)) {
          newStatements.push({
            suspectId: suspect.id,
            suspectName: suspect.name,
            index: -1,
            text: suspect.investigation_dialog.greeting,
          })
        }
        suspect.investigation_dialog.statements.forEach((text, i) => {
          if (!state.heardStatements.some((h) => h.suspectId === suspect.id && h.index === i)) {
            newStatements.push({ suspectId: suspect.id, suspectName: suspect.name, index: i, text })
          }
        })
      })
      const mergedStatements = [...state.heardStatements, ...newStatements]
      // デバッグ全開放: 全組み合わせをpendingなしで直接discoveredに追加する
      const allCombinationIds = (state.scenario.evidence_combinations ?? [])
        .filter((c) => !state.discoveredCombinationIds.includes(c.id))
        .map((c) => c.id)
      return {
        inspectedEvidenceIds: allEvidenceIds,
        examinedEvidenceIds: allEvidenceIds,
        talkedSuspectIds: allSuspectIds,
        viewedSuspectProfileIds: allSuspectIds,
        heardStatements: mergedStatements,
        ...(allCombinationIds.length > 0 && {
          discoveredCombinationIds: [...state.discoveredCombinationIds, ...allCombinationIds],
        }),
      }
    }),

  // [dev] 全APを最大値に補充する（各フェーズのデバッグ用）
  refillAllAP: () =>
    set({
      actionsRemaining: ACTIONS,
      talkActionsRemaining: TALK_ACTIONS,
      discussionConfrontActionsRemaining: DISCUSSION_CONFRONT_ACTIONS,
      accusationConfrontActionsRemaining: ACCUSATION_CONFRONT_ACTIONS,
    }),

  // 指定スロットからゲーム状態を復元する。シナリオが見つからない場合は何もしない
  loadSaveSlot: (slotIndex) => {
    const slot = loadFromSlot(slotIndex)
    if (!slot) return
    const scenario = getFixedScenarioByTitle(slot.scenarioTitle)
    if (!scenario) return
    set({
      // セーブデータから復元するフィールド
      phase: slot.phase,
      scenario,
      useFixedScenario: true,
      currentRoomId: slot.currentRoomId,
      actionsRemaining: slot.actionsRemaining,
      talkActionsRemaining: slot.talkActionsRemaining,
      discussionConfrontActionsRemaining: slot.discussionConfrontActionsRemaining,
      accusationConfrontActionsRemaining: slot.accusationConfrontActionsRemaining,
      inspectedEvidenceIds: slot.inspectedEvidenceIds,
      examinedEvidenceIds: slot.examinedEvidenceIds,
      discoveredCombinationIds: slot.discoveredCombinationIds,
      revealedFakeEvidenceIds: slot.revealedFakeEvidenceIds,
      talkedSuspectIds: slot.talkedSuspectIds,
      viewedSuspectProfileIds: slot.viewedSuspectProfileIds,
      heardStatements: slot.heardStatements,
      confrontationLog: slot.confrontationLog,
      unlockedPursuitQuestions: slot.unlockedPursuitQuestions,
      askedPursuitQuestionIds: slot.askedPursuitQuestionIds,
      successfulPursuitSuspectIds: slot.successfulPursuitSuspectIds ?? [],
      votedSuspectId: slot.votedSuspectId,
      hypotheses: slot.hypotheses,
      murdererEscaped: slot.murdererEscaped,
      activeSaveSlot: 0, // ロード後のオートセーブは常にスロット0へ
      // 一時的なUI演出状態は初期値にリセット
      pendingCombinationIds: [],
      pendingFakeRevealId: null,
      pendingPursuitActivation: null,
      pursuitWrongResult: null,
      isGenerating: false,
      generationError: null,
    })
  },
}))
