import { WEIGHT_OPTIONS } from '../utils/calculatePrice'

const C = {
  gold:    '#C9A84C',
  goldL:   '#E8C97A',
  crimson: '#8B1A1A',
  darkRed: '#6B0F0F',
}

export default function WeightSelector({ selected, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {WEIGHT_OPTIONS.map(({ label, grams }) => {
        const active = selected === grams
        return (
          <button
            key={grams}
            onClick={(e) => { e.stopPropagation(); onChange(grams) }}
            style={{
              padding: '5px 12px',
              borderRadius: 20,
              border: `1.5px solid ${active ? C.gold : 'rgba(201,168,76,.3)'}`,
              background: active
                ? `linear-gradient(135deg,${C.crimson},${C.darkRed})`
                : 'transparent',
              color: active ? 'white' : C.gold,
              fontSize: '.72rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all .25s ease',
              boxShadow: active
                ? `0 0 0 1px ${C.gold}, 0 4px 12px rgba(201,168,76,.25)`
                : 'none',
              transform: active ? 'scale(1.05)' : 'scale(1)',
            }}
            onMouseEnter={e => {
              if (!active) {
                e.currentTarget.style.background = 'rgba(201,168,76,.12)'
                e.currentTarget.style.borderColor = C.gold
              }
            }}
            onMouseLeave={e => {
              if (!active) {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'rgba(201,168,76,.3)'
              }
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
