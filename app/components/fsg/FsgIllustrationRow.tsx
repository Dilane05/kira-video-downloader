import Image from "next/image";

const DEFAULT_IMAGES = [
  "/img/illustration-1.jpeg",
  "/img/illustration-2.jpeg",
  "/img/illustration-3.jpeg",
  "/img/illustration-4.jpeg",
  "/img/illustration-5.jpeg",
];

type Props = {
  images?: string[];
  altPrefix?: string;
};

export default function FsgIllustrationRow({ images = DEFAULT_IMAGES, altPrefix = "Fusion Service Group" }: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: 12,
        marginBottom: 48,
      }}
    >
      {images.map((src, i) => (
        <div
          key={src}
          style={{
            position: "relative",
            aspectRatio: "4 / 3",
            borderRadius: 6,
            overflow: "hidden",
            border: "1px solid rgba(245, 166, 35, 0.15)",
          }}
        >
          <Image
            src={src}
            alt={`${altPrefix} — visuel ${i + 1}`}
            fill
            sizes="(max-width: 768px) 50vw, 18vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      ))}
    </div>
  );
}
