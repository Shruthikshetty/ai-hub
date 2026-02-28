import { Link } from 'react-router'

function IndexPage(): React.JSX.Element {
  return (
    <div>
      <Link to={'/settings'}>settings</Link>
      <p>home page</p>
    </div>
  )
}

export default IndexPage
