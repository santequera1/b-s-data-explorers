import buImage from "@/assets/bu-mascot.png";

type Props = {
  className?: string;
  alt?: string;
  eager?: boolean;
};

export function BuMascot({ className, alt = "Bú, la búho exploradora de datos", eager }: Props) {
  return (
    <img
      src={buImage}
      alt={alt}
      className={className}
      width={1024}
      height={1024}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
