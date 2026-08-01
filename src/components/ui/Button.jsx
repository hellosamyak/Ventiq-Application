export function Button({ variant = 'primary', size = 'md', className = '', type = 'button', children, ...props }) {
  const classes = ['btn', `btn-${variant}`, `btn-${size}`, className].filter(Boolean).join(' ')
  return (
    <button className={classes} type={type} {...props}>
      {children}
    </button>
  )
}
