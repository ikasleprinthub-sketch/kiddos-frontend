import React from "react";
import { 
  GiArm, 
  GiChiliPepper, 
  GiLeak, 
  GiOlive, 
  GiPickle, 
  GiBookCover, 
  GiWheat, 
  GiBowlOfRice, 
  GiButter, 
  GiHoneyJar, 
  GiPeanut, 
  GiSparkles,
  GiCardboardBox
} from "react-icons/gi";

interface CategoryIconProps {
  slug: string;
  className?: string;
}

export function CategoryIcon({ slug, className = "" }: CategoryIconProps) {
  switch (slug) {
    case "batters":
    case "batter":
      return <GiArm className={className} />;
    case "spice-blends":
    case "organic-spices":
    case "spices":
      return <GiChiliPepper className={className} />;
    case "raw-spices":
      return <GiLeak className={className} />;
    case "oils":
      return <GiOlive className={className} />;
    case "pickles":
      return <GiPickle className={className} />;
    case "chutney-book":
    case "chutney-books":
      return <GiBookCover className={className} />;
    case "millets":
      return <GiWheat className={className} />;
    case "rice":
      return <GiBowlOfRice className={className} />;
    case "ghee":
      return <GiButter className={className} />;
    case "honey":
      return <GiHoneyJar className={className} />;
    case "healthy-snacks":
    case "snacks":
      return <GiPeanut className={className} />;
    case "masala":
      return <GiSparkles className={className} />;
    default:
      return <GiCardboardBox className={className} />; // Fallback
  }
}
