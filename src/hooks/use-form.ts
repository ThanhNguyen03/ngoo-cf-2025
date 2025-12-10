/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef, useState } from 'react'

type TFieldValues = Record<string, any>

type RegisterOptions = {
  required?: boolean | string
  validate?: (value: unknown, allValues: TFieldValues) => string | true
  pattern?: {
    value: RegExp
    message: string
  }
  minLength?: {
    value: number
    message: string
  }
  maxLength?: {
    value: number
    message: string
  }
  min?: {
    value: number
    message: string
  }
  max?: {
    value: number
    message: string
  }
}

type TMode = 'onChange' | 'onBlur' | 'onSubmit'

type UseFormProps<T extends TFieldValues> = {
  defaultValues?: Partial<T>
  mode?: TMode
}

type FormState<T extends TFieldValues> = {
  values: Partial<T>
  errors: Record<keyof T & string, string | undefined>
  touched: Record<keyof T & string, boolean>
  dirty: Record<keyof T & string, boolean>
  isSubmitting: boolean
  isValid: boolean
}

export const useForm = <T extends TFieldValues = TFieldValues>(
  props: UseFormProps<T> = {},
) => {
  const { defaultValues = {} as Partial<T>, mode = 'onSubmit' } = props

  // State manage full form (controlled approach)
  const [formState, setFormState] = useState<FormState<T>>({
    values: { ...defaultValues },
    errors: {} as Record<keyof T & string, string | undefined>,
    touched: {} as Record<keyof T & string, boolean>,
    dirty: {} as Record<keyof T & string, boolean>,
    isSubmitting: false,
    isValid: false,
  })

  // Save validation rules for each field
  const fieldsRulesRef = useRef<Record<string, RegisterOptions | undefined>>({})

  // Validate one field
  const validateField = useCallback(
    (name: string, value: unknown): string | undefined => {
      if (!value) {
        return undefined
      }
      const rules = fieldsRulesRef.current[name]
      if (!rules) {
        return undefined
      }

      // Required validation
      if (rules.required) {
        if (value === undefined || value === '' || value === null) {
          return typeof rules.required === 'string'
            ? rules.required
            : 'This field is required'
        }
      }

      // Pattern validation
      if (rules.pattern && typeof value === 'string') {
        if (!rules.pattern.value.test(value)) {
          return rules.pattern.message
        }
      }

      // MinLength validation
      if (rules.minLength && typeof value === 'string') {
        if (value.length < rules.minLength.value) {
          return rules.minLength.message
        }
      }

      // MaxLength validation
      if (rules.maxLength && typeof value === 'string') {
        if (value.length > rules.maxLength.value) {
          return rules.maxLength.message
        }
      }

      // Min validation
      if (rules.min && typeof value === 'string') {
        if (Number(value) < rules.min.value) {
          return rules.min.message
        }
      }

      // Max validation
      if (rules.max && typeof value === 'string') {
        if (Number(value) > rules.max.value) {
          return rules.max.message
        }
      }

      // Custom validate function
      if (rules.validate) {
        const result = rules.validate(value, formState.values)
        if (result !== true) return result
      }

      return undefined
    },
    [fieldsRulesRef, formState.values],
  )

  // Validate full form
  const validateAll = useCallback(() => {
    const newErrors: Record<string, string | undefined> = {}
    let isValid = true

    Object.keys(fieldsRulesRef.current).forEach((name) => {
      const error = validateField(name, formState.values[name as keyof T])

      newErrors[name] = error
      if (error) {
        isValid = false
      }
    })

    setFormState((prev) => ({
      ...prev,
      errors: newErrors,
      isValid,
    }))

    return isValid
  }, [fieldsRulesRef, formState.values, validateField])

  // Register field - return { name, value, onChange, onBlur }
  const register = useCallback(
    (name: keyof T & string, options?: RegisterOptions) => {
      fieldsRulesRef.current[name] = options

      if (!(name in formState.values)) {
        setFormState((prev) => ({
          ...prev,
          values: { ...prev.values, [name]: defaultValues[name] ?? '' },
        }))
      }

      return {
        name,
        value: (formState.values[name] ?? '') as string,
        onChange: (
          e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        ) => {
          const newValue = e.target.value
          const newError = validateField(name, newValue)

          setFormState((prev) => {
            const updatedErrors = { ...prev.errors, [name]: newError }

            const isValid =
              Object.values(updatedErrors).every((e) => !e) &&
              Object.values({ ...prev.values, [name]: newValue }).every(
                (v) => v !== '' && v !== undefined,
              )

            return {
              ...prev,
              values: { ...prev.values, [name]: newValue },
              dirty: { ...prev.dirty, [name]: true },
              errors: updatedErrors,
              isValid,
            }
          })
        },
        onBlur: () => {
          setFormState((prev) => ({
            ...prev,
            touched: { ...prev.touched, [name]: true },
          }))

          if (mode === 'onBlur' || mode === 'onChange') {
            const error = validateField(name, formState.values[name])
            setFormState((prev) => ({
              ...prev,
              errors: { ...prev.errors, [name]: error },
            }))
          }
        },
      }
    },
    [formState.values, defaultValues, fieldsRulesRef, mode, validateField],
  )

  // Handle submit
  const handleSubmit = useCallback(
    (
      onValid: (data: T) => void | Promise<void>,
      onInvalid?: (errors: FormState<T>['errors']) => void,
    ) =>
      async (e: React.FormEvent) => {
        e.preventDefault()
        setFormState((prev) => ({ ...prev, isSubmitting: true }))

        // Validate if mode is onSubmit
        const isValid = mode === 'onSubmit' ? validateAll() : formState.isValid

        if (!isValid) {
          onInvalid?.(formState.errors)
          setFormState((prev) => ({ ...prev, isSubmitting: false }))
          return
        }

        try {
          await onValid(formState.values as T)
        } catch (error) {
          console.error('Submit error:', error)
        } finally {
          setFormState((prev) => ({ ...prev, isSubmitting: false }))
        }
      },
    [mode, validateAll, formState.values, formState.errors, formState.isValid],
  )

  // Set value manually
  const setValue = useCallback(
    (
      name: keyof T & string,
      value: any,
      options?: { shouldValidate?: boolean; shouldTouch?: boolean },
    ) => {
      setFormState((prev) => ({
        ...prev,
        values: { ...prev.values, [name]: value },
        dirty: { ...prev.dirty, [name]: true },
        touched: options?.shouldTouch
          ? { ...prev.touched, [name]: true }
          : prev.touched,
      }))

      if (options?.shouldValidate) {
        const error = validateField(name, value)
        setFormState((prev) => ({
          ...prev,
          errors: { ...prev.errors, [name]: error },
        }))
      }
    },
    [validateField],
  )

  // Get values
  const watch = useCallback(
    (name?: keyof T & string) => {
      if (name) return formState.values[name]
      return formState.values as T
    },
    [formState.values],
  )

  // Reset form
  const reset = useCallback(
    (values?: Partial<T>) => {
      const nextValues = values ?? defaultValues
      setFormState({
        values: { ...nextValues },
        errors: {} as Record<keyof T & string, string | undefined>,
        touched: {} as Record<keyof T & string, boolean>,
        dirty: {} as Record<keyof T & string, boolean>,
        isSubmitting: false,
        isValid: true,
      })
    },
    [defaultValues],
  )

  // Clear errors
  const clearErrors = useCallback((name?: keyof T & string) => {
    if (name) {
      setFormState((prev) => ({
        ...prev,
        errors: { ...prev.errors, [name]: undefined },
      }))
    } else {
      setFormState((prev) => ({
        ...prev,
        errors: {} as Record<keyof T & string, string | undefined>,
        isValid: true,
      }))
    }
  }, [])

  // Set error manually
  const setError = useCallback((name: keyof T & string, error: string) => {
    setFormState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [name]: error },
      isValid: false,
    }))
  }, [])

  return {
    register,
    handleSubmit,
    formState,
    setValue,
    watch,
    reset,
    clearErrors,
    setError,
  }
}
