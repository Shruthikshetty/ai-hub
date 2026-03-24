import { ProfileToolOutputSchemaType } from '@common/schemas/messages.schema'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Separator } from './ui/separator'
import { Mail, MapPin, User, Calendar } from 'lucide-react'

/**
 * simple card to display profile data
 */
export function ProfileCard({ profile }: { profile: Partial<ProfileToolOutputSchemaType> }) {
  const { name, email, age, city, image } = profile

  return (
    <Card className="max-w-full sm:max-w-md border shadow-sm transition-all hover:shadow-md bg-card/50 backdrop-blur-md mx-2">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar size="lg" className="h-16 w-16 border-2 border-primary/10 shadow-sm">
          <AvatarImage src={image} alt={name ?? 'Profile'} />
          <AvatarFallback className="bg-primary/5 text-primary">
            <User size={28} />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <CardTitle className="text-xl font-bold truncate tracking-tight">
            {name ?? 'Anonymous User'}
          </CardTitle>
          <CardDescription className="text-xs font-medium text-muted-foreground/80 flex items-center gap-1">
            <Mail size={12} className="shrink-0" />
            <span className="truncate">{email ?? 'No email provided'}</span>
          </CardDescription>
        </div>
      </CardHeader>
      <div className="px-6">
        <Separator className="opacity-50" />
      </div>
      <CardContent className="grid grid-cols-2 gap-4 py-4">
        <div className="flex flex-col gap-1">
          <span className="text-[0.7rem] uppercase font-bold tracking-wider text-muted-foreground/60">
            Age
          </span>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Calendar size={14} className="text-primary/70" />
            {age !== undefined && age !== null ? `${age} years` : 'N/A'}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[0.7rem] uppercase font-bold tracking-wider text-muted-foreground/60">
            Location
          </span>
          <div className="flex items-center gap-2 text-sm font-semibold truncate">
            <MapPin size={14} className="text-primary/70" />
            <span className="truncate">{city ?? 'Unknown'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
