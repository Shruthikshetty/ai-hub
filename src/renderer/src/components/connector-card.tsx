import { ConnectorGetSchema } from '@common/db-schemas/connector.schema'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { ChartBarIcon } from 'lucide-react'
import { Button } from './ui/button'

/**
 * Card that display the connector details and allows to set up connections
 */
const ConnectorCard = ({
  connector
}: {
  connector: Partial<Omit<ConnectorGetSchema, 'name'>> & { name: string }
}) => {
  return (
    <Card>
      <CardHeader>
        {/* icon  */}
        <ChartBarIcon />
        <div>
          <CardTitle>{connector.displayName}</CardTitle>
          <CardDescription>{connector.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>{/* form will go here */}</CardContent>
      <CardFooter>
        {/*  text*/}
        <p>Fill in the required fields to continue</p>
        {/* button for connect and apply */}
        <div>
          <Button>Apply</Button>
          <Button>connect</Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default ConnectorCard
