import { Avatar, AvatarFallback, AvatarImage } from '@renderer/components/ui/avatar'
import { Button } from '@renderer/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@renderer/components/ui/field'
import { Input } from '@renderer/components/ui/input'
import { useForm } from '@tanstack/react-form'
import { UserPatchSchema, userPatchSchema } from '@common/db-schemas/user.schema'
import { useFetchUserProfile, useUpdateUserProfile } from '@renderer/services/profile'
import { useUploadMedia } from '@renderer/services/media'
import { Save, Trash } from 'lucide-react'
import { useRef, useState } from 'react'
import { FILE_STORAGE_CATEGORY } from '@common/constants/global.constants'
import { handleNumberChange, handleStringChange } from '@renderer/lib/form.utils'

function ProfileSettings() {
  // fetch user data
  const { data: user } = useFetchUserProfile()
  // hook to update user data
  const { mutate: updateUserProfile } = useUpdateUserProfile()
  // hook to upload media
  const { mutate: uploadMedia } = useUploadMedia()
  //profile image ref
  const profileImageRef = useRef<HTMLInputElement>(null)

  // store initial timestamp for cache busting, updated on new upload
  const [imageTimestamp, setImageTimestamp] = useState(() => Date.now())

  // create a form for user profile details
  const form = useForm({
    defaultValues: {
      name: user?.data?.name,
      email: user?.data?.email,
      age: user?.data?.age,
      city: user?.data?.city,
      image: user?.data?.image
    } as UserPatchSchema,
    validators: { onSubmit: userPatchSchema },
    onSubmit: async ({ value }) => {
      // update user profile
      updateUserProfile(value)
    }
  })

  // handle avatar file selection
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    // Reset the input value so the same file can be selected again
    e.target.value = ''

    if (!file) return
    // upload the to storage
    uploadMedia(
      { file, category: FILE_STORAGE_CATEGORY.profileImg },
      {
        onSuccess: (result) => {
          // Set the media URL in the form so it gets saved to DB
          setImageTimestamp(Date.now())
          form.setFieldValue('image', result.data.mediaUrl)
        }
      }
    )
  }

  return (
    <div className="h-full w-full px-[5%] py-5 flex flex-col gap-5">
      <h1 className="text-2xl font-semibold">Profile Settings</h1>
      {/* form for name and email*/}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <FieldGroup>
          <form.Field name="image">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              const catchBustedImage = field.state.value
                ? `${field.state.value}?t=${imageTimestamp}`
                : ''
              return (
                <Field data-invalid={isInvalid}>
                  <div className="flex flex-row items-center gap-5">
                    {/* avatar image  */}
                    <Avatar className="size-20 rounded-lg after:rounded-lg">
                      <AvatarImage className="rounded-lg" src={catchBustedImage} />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    {/* change avatar  */}
                    <Button
                      variant={'outline'}
                      className="rounded-lg p-4"
                      aria-label="change avatar"
                      type="button"
                      onClick={() => profileImageRef.current?.click()}
                    >
                      Change Avatar
                    </Button>
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={profileImageRef}
                      onBlur={field.handleBlur}
                      onChange={handleAvatarChange}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </div>
                </Field>
              )
            }}
          </form.Field>
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
                    placeholder="user"
                    onChange={(e) => handleStringChange(e, field.handleChange)}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>
          <form.Field name="email">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value ?? ''}
                    onBlur={field.handleBlur}
                    placeholder="example.com"
                    onChange={(e) => handleStringChange(e, field.handleChange)}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>
          <form.Field name="age">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Age</FieldLabel>
                  <Input
                    id={field.name}
                    type="number"
                    name={field.name}
                    value={field.state.value?.toString() ?? ''}
                    onBlur={field.handleBlur}
                    placeholder="age"
                    onChange={(e) => {
                      handleNumberChange(e, field.handleChange)
                    }}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>
          <form.Field name="city">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>City</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value ?? ''}
                    onBlur={field.handleBlur}
                    placeholder="city"
                    onChange={(e) => handleStringChange(e, field.handleChange)}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>
          <div className="flex flex-row gap-2 items-center justify-center">
            <Button
              type="button"
              variant="destructive"
              aria-label="discard changes"
              className="p-4 min-w-[30%] md:min-w-[10%]"
              onClick={() => form.reset()}
            >
              Discard
              <Trash />
            </Button>
            <Button
              type="submit"
              variant={'secondary'}
              aria-label="save changes"
              className="p-4 min-w-[50%] md:min-w-[30%]"
            >
              Save
              <Save />
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  )
}

export default ProfileSettings
