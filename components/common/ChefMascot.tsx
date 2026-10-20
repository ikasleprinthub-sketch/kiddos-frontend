import Image from "next/image";

// Decorative Kiddos chef that fills empty space (e.g. below the cart list).
// Sits in normal flow so it never overlaps content; only the image itself receives hover.
export default function ChefMascot({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`chef-mascot pointer-events-none select-none ${className}`}>
      <div className="chef-mascot-float">
        <Image
          src="/images/chef-mascot.webp"
          alt=""
          width={840}
          height={849}
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 260px, 200px"
          draggable={false}
          className="chef-mascot-img pointer-events-auto h-auto w-full"
        />
      </div>
    </div>
  );
}
