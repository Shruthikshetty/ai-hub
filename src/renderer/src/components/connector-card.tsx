import { ConnectorGetSchema } from '@common/db-schemas/connector.schema'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { MessageSquare } from 'lucide-react'
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
    <Card className="pt-0">
      <CardHeader className="bg-muted/50 mt-0 py-3">
        <div className="flex flex-row items-center gap-2">
          {/* icon  */}
          <div className="p-2 bg-muted-foreground/20 rounded-md">
            <MessageSquare className="size-5" />
          </div>
          <div className="gap-1 flex flex-col">
            <CardTitle>{connector.displayName}</CardTitle>
            <CardDescription>{connector.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>{/* form will go here */}</CardContent>
      <CardFooter className="flex flex-row justify-between">
        {/*  text*/}
        <p className="text-muted-foreground">Fill in the required fields to continue</p>
        {/* button for connect and apply */}
        <div className="gap-2 flex flex-row">
          {/*@TODO will have apply and delete */}
          <Button variant={'default'} className="active:scale-95">
            Apply
          </Button>
          {/*@TODO will change color when connected */}
          <Button variant={'outline'}>connect</Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default ConnectorCard
