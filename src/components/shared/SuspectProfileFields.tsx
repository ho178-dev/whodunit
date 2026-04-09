// 容疑者の人物像・性格・関係・アリバイを一覧表示する共通コンポーネント
import type { Suspect } from '../../types/scenario'

interface SuspectProfileFieldsProps {
  suspect: Suspect
}

// 容疑者プロフィールのラベル付きフィールド一覧を表示する
export function SuspectProfileFields({ suspect }: SuspectProfileFieldsProps) {
  const fields = [
    { label: '人物像', value: suspect.description },
    { label: '性格', value: suspect.personality },
  ]

  return (
    <div className="space-y-1 text-xs font-serif">
      {fields.map(({ label, value }) => (
        <p key={label} className="text-gothic-text">
          <span className="text-gothic-muted">{label}：</span>
          {value}
        </p>
      ))}
    </div>
  )
}
