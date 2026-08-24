import Link from "next/link"
import Image from "next/image"

export function AuthHeader() {
  return (
    <Link href="/" className="inline-flex w-fit items-center">
      <Image
        src="/logo.svg"
        alt="Rackrage"
        width={137}
        height={32}
        priority
        className="h-8 w-auto"
      />
    </Link>
  )
}
