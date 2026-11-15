"use client"

import { useState, type ComponentProps } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import styles from "./auth.module.css"

type AuthFieldProps = Omit<ComponentProps<"input">, "id" | "name"> & {
  id: string
  label: string
  error?: string
}

export function AuthField({ id, label, error, type = "text", onChange, ...props }: AuthFieldProps) {
  const [visible, setVisible] = useState(false)
  const [validationError, setValidationError] = useState("")
  const isPassword = type === "password"
  const message = error || validationError

  return (
    <div className={styles.field}>
      <Label htmlFor={id}>{label}</Label>
      <div className={isPassword ? styles.password : undefined}>
        <Input
          {...props}
          id={id}
          name={id}
          className={styles.input}
          type={visible ? "text" : type}
          aria-invalid={Boolean(message)}
          aria-describedby={message ? `${id}-error` : undefined}
          onInvalid={({ currentTarget }) => {
            const { validity, validationMessage } = currentTarget
            if (validity.valueMissing) {
              setValidationError(`Enter your ${label.toLowerCase()}.`)
            } else if (validity.typeMismatch && type === "email") {
              setValidationError("Enter a valid email address.")
            } else {
              setValidationError(validationMessage)
            }
          }}
          onChange={(event) => {
            setValidationError("")
            onChange?.(event)
          }}
        />
        {isPassword && (
          <button
            type="button"
            className={styles.reveal}
            aria-controls={id}
            aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`}
            onClick={() => setVisible(!visible)}
          >
            {visible ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {message && <p id={`${id}-error`} className={styles.fieldError} role="alert">{message}</p>}
    </div>
  )
}
