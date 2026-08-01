import { useState } from 'react'
import { Image, UploadCloud } from 'lucide-react'

export function FileDrop({ name, accept, label = 'Choose file', hint, required, variant = 'image' }) {
  const [hasFile, setHasFile] = useState(false)
  const Icon = variant === 'video' ? UploadCloud : Image

  return (
    <label className={`file-drop ${hasFile ? 'has-file' : ''}`}>
      <Icon />
      <span>{hasFile ? 'File selected' : label}</span>
      {!hasFile && hint ? <span>{hint}</span> : null}
      <input
        accept={accept}
        name={name}
        onChange={(event) => setHasFile(Boolean(event.target.files?.length))}
        required={required}
        type="file"
      />
    </label>
  )
}
