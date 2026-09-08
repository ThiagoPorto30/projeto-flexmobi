import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  className?: string;
  footer?: boolean;
  priority?: boolean;
};

export default function BrandLogo({ href = "/#top", className = "", footer = false, priority = false }: BrandLogoProps) {
  const classes = ["brand", "brand--official", footer ? "brand--footer" : "", className].filter(Boolean).join(" ");

  return (
    <Link className={classes} href={href} aria-label="Flex Mobi — página inicial">
      <span className="brand-profile" aria-hidden="true">
        <Image
          src="/flexmobi-logo.svg"
          alt=""
          width={150}
          height={150}
          priority={priority}
          sizes={footer ? "190px" : "(max-width: 520px) 120px, 148px"}
        />
      </span>
    </Link>
  );
}
