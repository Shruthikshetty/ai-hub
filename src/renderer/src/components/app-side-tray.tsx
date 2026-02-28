import { Link } from 'react-router'

/**
 * contains the side tray of the app that has quick links to all the pages
 */
const AppSideTray = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <Link to={'/settings'}>settings</Link>
      <Link to={'/'}>home</Link>
    </div>
  )
}

export default AppSideTray
