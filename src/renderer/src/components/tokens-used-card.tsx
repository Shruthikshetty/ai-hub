import { memo } from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'

/**
 * This component is used to display the total tokens used in a conversation
 */
const TokensUsedCard = ({
  totalTokens = 0,
  show = true
}: {
  totalTokens?: number
  show?: boolean
}) => {
  // if show is false return null
  if (!show) return null

  return (
    <Card className="bg-sidebar-accent-foreground/20">
      <CardHeader>
        <CardTitle className="font-bold">{totalTokens}</CardTitle>
        <CardDescription className="text-xs text-foreground/70">this session</CardDescription>
      </CardHeader>
    </Card>
  )
}

export default memo(TokensUsedCard)
