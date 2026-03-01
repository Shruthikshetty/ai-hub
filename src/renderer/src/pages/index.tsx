import { Button } from '@renderer/components/ui/button'
import { Link } from 'react-router'

function IndexPage(): React.JSX.Element {
  return (
    <div>
      <Link to={'/settings'}>settings</Link>
      <p>home page</p>
      <Button>Button</Button>
    </div>
  )
}

export default IndexPage
