import { Button } from '@renderer/components/ui/button'
import { useTheme } from '@renderer/components/theme-context'

// this is the main page of the app
function HomePage(): React.JSX.Element {
  const { setTheme } = useTheme()
  return (
    <div className="flex flex-col p-5">
      {/* Logo & Title */}
      <div className="mb-12 text-center">
        <div className="w-20 h-20 bg-primary rounded-xl flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl font-bold text-primary-foreground">AI</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-foreground">AI Hub</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          A completely local solution for AI enthusiasts. Use any model, switch between providers,
          and maintain full control over your data.
        </p>
      </div>
      <Button onClick={() => setTheme('dark')}>dark</Button>
      <Button onClick={() => setTheme('light')}>light</Button>
    </div>
  )
}

export default HomePage
