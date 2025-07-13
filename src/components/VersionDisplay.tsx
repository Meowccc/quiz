import './VersionDisplay.css'

interface VersionDisplayProps {
  version?: string
}

export const VersionDisplay: React.FC<VersionDisplayProps> = ({ version = '0.0.0' }) => {
  return (
    <div className="version-display">
      v.{version}
    </div>
  )
} 