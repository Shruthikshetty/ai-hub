import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@renderer/components/ui/card'
import AppLogo from '@renderer/components/app-logo'
import { HOME_INFO_CARD_ITEMS, QUICK_ACCESS_CARDS } from '@renderer/constants/screen.constants'
import { Button } from '@renderer/components/ui/button'
import { useNavigate } from 'react-router'

// this is the main page of the app
function HomePage(): React.JSX.Element {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col p-5 md:p-10">
      {/* Logo & Title */}
      <div className="mb-12 text-center items-center flex flex-col gap-2">
        <AppLogo width={70} height={70} />
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-foreground">AI Hub</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          A completely local solution for AI enthusiasts. Use any model, switch between providers,
          and maintain full control over your data.
        </p>
      </div>
      {/* cards for quick access to features */}
      <div className="flex flex-col gap-4 md:gap-7 md:flex-row ">
        {QUICK_ACCESS_CARDS.map((item) => (
          <Card
            key={item.name}
            className="grow border-border border transition-all hover:cursor-pointer hover:border-primary active:scale-95"
            onClick={() => {
              navigate(item.path)
            }}
          >
            <CardHeader>
              <div className="flex flex-row gap-2 items-start">
                <div className="bg-muted p-2 rounded-sm">
                  <item.icon className="size-6 min-h-4 min-w-4" />
                </div>
                <div className="flex flex-col items-baseline gap-2 pl-2 ">
                  <CardTitle className="text-xl font-semibold">{item.name}</CardTitle>
                  <CardDescription>{item.message}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
      {/* info card  */}
      <Card className=" border-border border mt-7 md:mt-10">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Why Choose AI Hub?</CardTitle>
          <CardDescription className="sr-only">info box for ai hub</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-inside flex flex-col gap-5">
            {HOME_INFO_CARD_ITEMS.map((item) => (
              <li key={item.title} className="flex flex-row gap-2 items-center">
                <div className="p-2">
                  <item.icon className="size-6 min-h-4 min-w-4 text-muted-foreground" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-semibold">{item.title}</p>
                  <p className="text-muted-foreground text-sm">{item.message}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      {/* Additional buttons */}
      <div className="flex flex-row gap-2 mt-5 items-center justify-center md:mt-10">
        <Button variant={'default'} className="p-5" onClick={() => navigate('/chat')}>
          Start Chatting
        </Button>
        {/* @TODO: to be redetected to exactly provide setting */}
        <Button
          variant={'secondary'}
          className="p-5"
          onClick={() => {
            navigate('/settings')
          }}
        >
          Configure Providers
        </Button>
      </div>
    </div>
  )
}

export default HomePage
