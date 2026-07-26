export default function Button({ className = '', ...props }) {
  return <button className={`primary-button ${className}`} type="button" {...props} />
}
