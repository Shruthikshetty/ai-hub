import { useState } from 'react'

function Versions(): React.JSX.Element {
  const [versions] = useState(window.electron.process.versions)

  return (
    <ul className="flex flex-row gap-2 bg-gray-800 p-2 rounded-md">
      <li className="text-sm text-blue-500">Electron v{versions.electron}</li>
      <li className="text-sm text-blue-500">Chromium v{versions.chrome}</li>
      <li className="text-sm text-blue-500">Node v{versions.node}</li>
    </ul>
  )
}

export default Versions
