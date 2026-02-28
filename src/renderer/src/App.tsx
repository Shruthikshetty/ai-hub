import { useRoutes } from 'react-router'
import routes from '~react-pages'
import AppLayout from './app-layout'

/**
 * App component all routs are rendered here
 */
function App(): React.JSX.Element | null {
  const allRoutes = useRoutes(routes)
  return <AppLayout>{allRoutes}</AppLayout>
}

export default App
