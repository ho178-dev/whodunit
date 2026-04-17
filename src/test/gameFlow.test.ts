// ゲームフロー統合テスト（Zustand store経由）
// 対象: 固定3シナリオ × 2エンドパターン（完勝/誤謬）+ エッジケース
import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '../stores/gameStore'
import { FIXED_SCENARIO } from '../constants/fixedScenario'
import { FIXED_SCENARIO_2 } from '../constants/fixedScenario2'
import { FIXED_SCENARIO_3 } from '../constants/fixedScenario3'
import { saveToSlot } from '../utils/saveLoad'
import { SAVE_VERSION } from '../types/save'
import type { SaveInput } from '../types/save'

// EndingScreen.tsx:68 と同一の勝敗判定ロジック
const calcIsVictory = (
  votedSuspectId: string | null,
  murdererId: string,
  murdererEscaped: boolean
) => votedSuspectId === murdererId && !murdererEscaped

describe('ゲームフロー統合テスト', () => {
  beforeEach(() => {
    localStorage.clear()
    // ストアを中立状態にリセット（startScenario が initialState をセットするため完全リセット不要）
    useGameStore.setState({ phase: 'title', scenario: null, activeSaveSlot: null })
  })

  // ── 6パターンテスト ──────────────────────────────────────────────

  const scenarios = [
    { name: '黄昏の晩餐会', scenario: FIXED_SCENARIO },
    { name: '白銀の密室', scenario: FIXED_SCENARIO_2 },
    { name: '月夜の惨劇', scenario: FIXED_SCENARIO_3 },
  ]

  scenarios.forEach(({ name, scenario }) => {
    describe(name, () => {
      it('完勝エンド: 正解犯人告発 → ending / isVictory=true', () => {
        const store = useGameStore.getState()
        store.startScenario(scenario)
        store.setPhase('investigation')
        store.setPhase('discussion')
        store.setPhase('voting')
        store.setVotedSuspectId(scenario.murderer_id)
        store.setMurdererEscaped(false)
        store.setPhase('ending')

        const s = useGameStore.getState()
        expect(s.phase).toBe('ending')
        expect(s.votedSuspectId).toBe(scenario.murderer_id)
        expect(s.murdererEscaped).toBe(false)
        expect(calcIsVictory(s.votedSuspectId, scenario.murderer_id, s.murdererEscaped)).toBe(true)
      })

      it('誤謬エンド: 不正解容疑者告発 → ending / isVictory=false', () => {
        const store = useGameStore.getState()
        store.startScenario(scenario)
        store.setPhase('investigation')
        store.setPhase('discussion')
        store.setPhase('voting')

        const wrongSuspect = scenario.suspects.find((s) => s.id !== scenario.murderer_id)!
        store.setVotedSuspectId(wrongSuspect.id)
        store.setMurdererEscaped(false)
        store.setPhase('ending')

        const s = useGameStore.getState()
        expect(s.phase).toBe('ending')
        expect(calcIsVictory(s.votedSuspectId, scenario.murderer_id, s.murdererEscaped)).toBe(false)
      })
    })
  })

  // ── エッジケース ─────────────────────────────────────────────────

  describe('エッジケース', () => {
    it('AP全消費後（犯人逃亡）: murdererEscaped=true → ending / isVictory=false', () => {
      const store = useGameStore.getState()
      store.startScenario(FIXED_SCENARIO)
      store.setPhase('accusation')

      // 告発APを0にして犯人逃亡をシミュレート
      useGameStore.setState({ accusationConfrontActionsRemaining: 0 })
      store.setVotedSuspectId(FIXED_SCENARIO.murderer_id)
      store.setMurdererEscaped(true)
      store.setPhase('ending')

      const s = useGameStore.getState()
      expect(s.phase).toBe('ending')
      expect(s.murdererEscaped).toBe(true)
      expect(s.accusationConfrontActionsRemaining).toBe(0)
      // 正解犯人でもAP枯渇なら敗北
      expect(calcIsVictory(s.votedSuspectId, FIXED_SCENARIO.murderer_id, s.murdererEscaped)).toBe(
        false
      )
    })

    it('セーブ→ロード後: murdererEscaped・votedSuspectId が復元される', () => {
      // 事前にセーブデータを作成
      const saveData: SaveInput = {
        version: SAVE_VERSION,
        scenarioTitle: FIXED_SCENARIO.title,
        phase: 'ending',
        currentRoomId: null,
        actionsRemaining: 0,
        talkActionsRemaining: 0,
        discussionConfrontActionsRemaining: 0,
        accusationConfrontActionsRemaining: 0,
        inspectedEvidenceIds: [],
        examinedEvidenceIds: [],
        discoveredCombinationIds: [],
        revealedFakeEvidenceIds: [],
        talkedSuspectIds: [],
        viewedSuspectProfileIds: [],
        heardStatements: [],
        confrontationLog: [],
        unlockedPursuitQuestions: [],
        askedPursuitQuestionIds: [],
        successfulPursuitSuspectIds: [],
        votedSuspectId: FIXED_SCENARIO.murderer_id,
        hypotheses: [],
        murdererEscaped: true,
      }
      saveToSlot(0, saveData)

      // ロードして状態を確認
      useGameStore.getState().loadSaveSlot(0)

      const s = useGameStore.getState()
      expect(s.phase).toBe('ending')
      expect(s.votedSuspectId).toBe(FIXED_SCENARIO.murderer_id)
      expect(s.murdererEscaped).toBe(true)
      expect(calcIsVictory(s.votedSuspectId, FIXED_SCENARIO.murderer_id, s.murdererEscaped)).toBe(
        false
      )
    })

    it('最低限のアクションで全フェーズを完走できる（進行不能チェック）', () => {
      // AP を一切消費しない最短ルートでエンディングに到達できることを確認する
      // 各フェーズ遷移がストアレベルで常に可能であることを保証する
      const store = useGameStore.getState()
      store.startScenario(FIXED_SCENARIO)

      // 捜査: AP=0 でも進行可能（コンポーネント側の canProceed = actionsRemaining === 0）
      useGameStore.setState({ actionsRemaining: 0 })
      store.setPhase('discussion')

      // 議論 → 投票 → 断罪: 各遷移が成功する
      store.setPhase('voting')
      store.setVotedSuspectId(FIXED_SCENARIO.murderer_id)
      store.setPhase('accusation')
      expect(useGameStore.getState().phase).toBe('accusation')

      // 断罪AP枯渇: 犯人逃亡フラグを立ててエンディングへ脱出できる
      useGameStore.setState({ accusationConfrontActionsRemaining: 0 })
      store.setMurdererEscaped(true)
      store.setPhase('ending')

      const s = useGameStore.getState()
      expect(s.phase).toBe('ending')
      // AP枯渇で逃亡 → isVictory=false だが ending には到達している
      expect(calcIsVictory(s.votedSuspectId, FIXED_SCENARIO.murderer_id, s.murdererEscaped)).toBe(
        false
      )
    })

    it('accusation_data=null のシナリオでもエンディングフェーズへ遷移できる', () => {
      // AIシナリオ生成失敗時のフォールバック: accusation_data が undefined のシナリオ
      const scenarioWithoutAccusation = { ...FIXED_SCENARIO, accusation_data: undefined }
      const store = useGameStore.getState()
      store.startScenario(scenarioWithoutAccusation as typeof FIXED_SCENARIO)
      store.setVotedSuspectId(FIXED_SCENARIO.murderer_id)
      store.setPhase('ending')

      const s = useGameStore.getState()
      expect(s.phase).toBe('ending')
      // accusation_data がなくても状態遷移自体はクラッシュしない
      expect(s.scenario?.accusation_data).toBeUndefined()
    })
  })
})
