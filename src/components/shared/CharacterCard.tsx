// 容疑者の画像・名前・年齢・職業を表示する汎用カードコンポーネント
import { useState } from 'react'
import { cn } from '../../utils/cn'
import { useCharacterAsset } from '../../hooks/useAsset'
import type { Suspect } from '../../types/scenario'

interface CharacterCardProps {
  suspect: Suspect
  selected?: boolean
  onClick?: () => void
  small?: boolean
}

// 容疑者の画像・名前・年齢・職業を表示するカード
export function CharacterCard({ suspect, selected, onClick, small }: CharacterCardProps) {
  const imgSrc = useCharacterAsset(suspect.appearance_id)
  const [imgError, setImgError] = useState(false)

  return (
    <div
      className={cn(
        'border bg-gothic-panel transition-all duration-200 cursor-pointer',
        selected
          ? 'border-gothic-gold shadow-[0_0_12px_rgba(217,119,6,0.5)]'
          : 'border-gothic-border hover:border-gothic-accent',
        small ? 'p-2' : 'p-4',
        onClick && 'hover:scale-105'
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          'bg-stone-800 flex items-center justify-center overflow-hidden',
          small ? 'h-16 w-16 mx-auto' : 'h-32 w-full mb-3'
        )}
      >
        {imgError ? (
          <span className="text-gothic-muted text-4xl">👤</span>
        ) : (
          <img
            src={imgSrc}
            alt={suspect.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      {!small && (
        <>
          <div className="text-gothic-gold font-display text-sm font-semibold">{suspect.name}</div>
          <div className="text-gothic-muted text-xs mt-1">
            {suspect.age}歳・{suspect.occupation}
          </div>
        </>
      )}
      {small && (
        <div className="text-gothic-text text-xs text-center mt-1 truncate">{suspect.name}</div>
      )}
    </div>
  )
}
