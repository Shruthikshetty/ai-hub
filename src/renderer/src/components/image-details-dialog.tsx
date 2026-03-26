import { MediaGetSchema } from '@common/db-schemas/media.schema'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { useState } from 'react'
import { Button } from './ui/button'
import { Download, Trash } from 'lucide-react'

const ImageDetailsDialog = ({
  image,
  children,
  onDownload
}: {
  children: React.ReactNode
  image?: MediaGetSchema
  onDownload: () => Promise<void>
}) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent
        className="flex flex-col gap-0 p-0 overflow-hidden sm:max-w-none w-[90vw] max-h-[90vh]"
        crossSize={'lg'}
      >
        <DialogHeader className="shrink-0 bg-accent p-4">
          <DialogTitle className="text-xs line-clamp-5">{image?.prompt}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-1 min-h-0 items-center justify-center overflow-hidden">
          <img
            src={image?.imageUrl}
            alt="generated image"
            className="max-h-[75vh] max-w-full object-contain"
          />
        </div>
        <div className="shrink-0 flex flex-row items-center justify-between px-4 py-2 border-t bg-muted rounded-b-xl">
          <p className="text-sm text-muted-foreground">{image?.modelId}</p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onDownload}>
              Download
              <Download />
            </Button>
            <Button variant="destructive">
              Delete
              <Trash />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ImageDetailsDialog
