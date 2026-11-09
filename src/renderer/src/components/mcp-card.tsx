import { useRef, useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter } from './ui/card'
import { useForm } from '@tanstack/react-form'
import {
  mcpFormValidationSchema,
  McpFormValidationSchemaType
} from '@renderer/schemas/mcp-validation.schema'
import { FieldDescription, FieldError, FieldGroup, FieldLabel, Field } from './ui/field'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { MultiInput } from './multi-input'
import { FetchAllMcpServersResponseSchemaType } from '@common/schemas/mcp.schema'
import { hiddenText } from '@renderer/lib/format.utils'
import {
  useAddMcpServer,
  useDeleteMcpServer,
  useTestMcpServer,
  useUpdateMcpServer
} from '@renderer/services/mcp'
import { errorToast } from '@renderer/lib/toast-wrapper'
import { Spinner } from './ui/spinner'
import { cn } from '@renderer/lib/utils'
import { Pencil, Trash2 } from 'lucide-react'
import { Switch } from './ui/switch'

// types
type McpServerItem = FetchAllMcpServersResponseSchemaType['data'][number]

type McpCardProps =
  | {
      mode: 'ADD'
      onClose?: () => void
      data?: never
    }
  | {
      mode: 'UPDATE'
      onClose?: () => void
      data: McpServerItem
    }

// utils

function generateTestRequestBody(data: McpFormValidationSchemaType) {
  return data.type === 'http'
    ? {
        type: 'http' as const,
        url: data.url,
        authToken: data.authToken
      }
    : {
        type: 'stdio' as const,
        command: data.command,
        args: data.args,
        cwd: data.cwd
      }
}

/**
 * Mcp card is used for both the edit and addition of a MCP Server
 */
export function McpCard(props: McpCardProps) {
  // store editing state used when mode is update
  const [isEditing, setIsEditing] = useState(false)

  // if mode is add
  if (props.mode === 'ADD') {
    return (
      <div>
        <AddUpdateForm mode="ADD" onClose={props.onClose} />
      </div>
    )
  }

  // if mode is update
  return (
    <div>
      {isEditing ? (
        <AddUpdateForm mode="UPDATE" data={props.data} onClose={() => setIsEditing(false)} />
      ) : (
        <DisplayDetails data={props.data} onEdit={() => setIsEditing(true)} />
      )}
    </div>
  )
}

// sub component's

/**
 * contains the for to  handle add and update of the MCP server
 */
function AddUpdateForm({ mode, onClose, data }: McpCardProps) {
  // stores tested state
  const [isTested, setIsTested] = useState(false)
  const formRevision = useRef(0)

  // hooks
  const { mutate: addMcpServerMutation, isPending: isAddPending } = useAddMcpServer()
  const { mutate: updateMcpServerMutation, isPending: isUpdatePending } = useUpdateMcpServer()
  const { mutate: testMcpServerMutation, isPending: isTestPending } = useTestMcpServer()

  // form
  const form = useForm({
    defaultValues: {
      name: data?.name,
      type: data?.type ?? 'http',
      url: data?.url,
      command: data?.command,
      args: data?.args ?? [],
      cwd: data?.cwd,
      authToken: data?.authToken,
      enabled: data?.enabled ?? true
    } as McpFormValidationSchemaType,
    validators: { onSubmit: mcpFormValidationSchema },
    listeners: {
      onChange: () => {
        formRevision.current++
        if (isTested) {
          setIsTested(false) //reset when form is updated
        }
      }
    },
    onSubmit: ({ value }) => {
      // generate req body - undefined values are excluded by JSON.stringify in PATCH
      const serverPayload = {
        name: value.name,
        type: value.type,
        url: value.type === 'http' ? value?.url : undefined,
        command: value.type === 'stdio' ? value?.command : undefined,
        args: value.type === 'stdio' ? (value?.args ?? []) : [],
        cwd: value.type === 'stdio' ? value?.cwd : undefined,
        authToken: value?.authToken,
        enabled: value.enabled
      }

      // add or update as per the mode
      if (mode === 'ADD') {
        const handleAdd = () => {
          addMcpServerMutation(serverPayload, {
            onSuccess: () => {
              onClose?.()
            }
          })
        }

        // test first before adding
        if (!isTested) {
          testMcpServerMutation(generateTestRequestBody(value), {
            onSuccess: () => {
              setIsTested(true)
              handleAdd()
            }
          })
        } else {
          handleAdd()
        }
      } else {
        if (!data) return
        updateMcpServerMutation(
          {
            id: data.id,
            mcpServer: serverPayload
          },
          {
            onSuccess: () => {
              onClose?.()
            }
          }
        )
      }
    }
  })

  // function to test the MCP Server
  const handleTest = async () => {
    // validate the form
    const errors = await form.validate('submit')
    // Check if there are errors (or !form.state.isValid)
    if (Object.keys(errors).length > 0 || !form.state.isValid) {
      errorToast('Form is invalid. Please check the errors. before testing')
      return
    }
    const testRevision = formRevision.current
    // hit test endpoint
    testMcpServerMutation(generateTestRequestBody(form.state.values), {
      onSuccess: () => {
        if (testRevision === formRevision.current) {
          setIsTested(true)
        }
      }
    })
  }

  return (
    <Card>
      <CardContent>
        <FieldGroup>
          <form.Field name="name">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value ?? ''}
                    onBlur={field.handleBlur}
                    placeholder="e.g. My MCP Server"
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldDescription>A unique name for the MCP</FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>
          <form.Field name="type">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Type</FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(val) => field.handleChange(val as 'http' | 'stdio')}
                  >
                    <SelectTrigger id={field.name} className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="http">http</SelectItem>
                      <SelectItem value="stdio">stdio</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldDescription>Transport protocol for the MCP server</FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>
          <form.Subscribe selector={(state) => state.values.type}>
            {(serverType) =>
              serverType === 'http' ? (
                <div className="animate-in fade-in-50 slide-in-from-top-2 duration-200">
                  <form.Field name="url">
                    {(field) => {
                      const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>URL</FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value ?? ''}
                            onBlur={field.handleBlur}
                            placeholder="https://example.com/mcp"
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                          <FieldDescription>URL for the HTTP MCP server</FieldDescription>
                          {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        </Field>
                      )
                    }}
                  </form.Field>
                </div>
              ) : (
                <div className="animate-in fade-in-50 slide-in-from-top-2 duration-200 flex flex-col gap-5">
                  <form.Field name="command">
                    {(field) => {
                      const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Command</FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value ?? ''}
                            onBlur={field.handleBlur}
                            placeholder="e.g. npx, python, node, uvx"
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                          <FieldDescription>
                            Executable command for the stdio server
                          </FieldDescription>
                          {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        </Field>
                      )
                    }}
                  </form.Field>

                  <form.Field name="args">
                    {(field) => (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Arguments</FieldLabel>
                        <MultiInput
                          value={field.state.value ?? []}
                          onChange={field.handleChange}
                          placeholder="e.g. -y, @modelcontextprotocol/server-filesystem"
                        />
                        <FieldDescription>
                          Arguments for the executable. Enter each argument and click Add.
                        </FieldDescription>
                      </Field>
                    )}
                  </form.Field>

                  <form.Field name="cwd">
                    {(field) => (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Working Directory (Optional)</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value ?? ''}
                          onBlur={field.handleBlur}
                          placeholder="e.g. C:\scripts"
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <FieldDescription>
                          Working directory where the command executes
                        </FieldDescription>
                      </Field>
                    )}
                  </form.Field>
                </div>
              )
            }
          </form.Subscribe>

          <form.Field name="authToken">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Auth Token (Optional)</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value ?? ''}
                  onBlur={field.handleBlur}
                  placeholder="Bearer token or API key"
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldDescription>
                  Optional authentication token sent with requests
                </FieldDescription>
              </Field>
            )}
          </form.Field>
        </FieldGroup>
      </CardContent>
      <CardFooter className="justify-end gap-3">
        {isTested ? <p className="text-success">Test successful mcp is safe to add</p> : null}
        <div className="flex flex-row gap-3 justify-end items-center">
          <Button className="active:scale-95 sm:min-w-15" variant={'destructive'} onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="active:scale-95 sm:min-w-15"
            variant={'outline'}
            onClick={handleTest}
            disabled={isTestPending}
          >
            Test
            {isTestPending ? <Spinner /> : null}
          </Button>
          <Button
            className="active:scale-95 sm:min-w-15 hover:bg-success!"
            onClick={form.handleSubmit}
            disabled={isTestPending || isUpdatePending || isAddPending}
          >
            {mode === 'ADD' ? 'Add' : 'Update'}
            {isAddPending || isUpdatePending ? <Spinner /> : null}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

/**
 * display details of already added mcp
 */
function DisplayDetails({ data, onEdit }: { data: McpServerItem; onEdit?: () => void }) {
  // hook to delete an mcp server
  const { mutate: deleteMcpServerMutation, isPending: isDeletePending } = useDeleteMcpServer()
  // hook to update an mcp server
  const { mutate: updateMcpServerMutation, isPending: isUpdatePending } = useUpdateMcpServer()

  return (
    <Card
      className={cn(
        data.enabled ? 'border bg-green-400/10! ring-green-500/50!' : 'border border-border'
      )}
    >
      <CardContent>
        <div className="flex flex-row justify-between gap-5 items-center">
          {/* badges */}
          <div className="pb-2 flex flex-row gap-2">
            <Badge variant={'secondary'} className="border border-border px-4 text-sm py-2">
              {data.type}
            </Badge>
            <Badge
              variant={data.enabled ? 'default' : 'secondary'}
              className={cn(
                'border border-border px-4 text-sm py-2',
                data.enabled ? 'bg-success' : ''
              )}
            >
              {data.enabled ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>
          {/* action buttons */}
          <div className="flex flex-row items-center gap-2">
            <Switch
              className="shrink-0"
              checked={!!data.enabled}
              disabled={isUpdatePending}
              onCheckedChange={(checked) => {
                updateMcpServerMutation({
                  id: data.id,
                  mcpServer: {
                    enabled: checked
                  }
                })
              }}
            />
            <Button
              size="icon-sm"
              variant="ghost"
              className="text-muted-foreground hover:text-foreground active:scale-95 p-2"
              onClick={onEdit}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              className="text-destructive hover:text-destructive active:scale-95 p-2"
              disabled={isDeletePending}
              onClick={() => deleteMcpServerMutation(data.id)}
            >
              {isDeletePending ? <Spinner className="size-4" /> : <Trash2 className="size-4" />}
            </Button>
          </div>
        </div>
        {/* details  */}
        <div>
          <h2 className="text-base font-semibold py-2">{data.name}</h2>
          {data.type === 'http' ? (
            <>
              <p>
                <b>URL:</b> {data.url}
              </p>
              {data.authToken ? <p> {hiddenText(data.authToken, 4, 2)}</p> : null}
            </>
          ) : (
            <>
              <p>
                <b>Command:</b> {data.command}
              </p>
              <p>
                {' '}
                <b>CWD:</b> {data.cwd}
              </p>
              <p>
                {' '}
                <b>Args:</b> {`[ ${data?.args?.map((arg) => arg).join(',')} ]`}
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
