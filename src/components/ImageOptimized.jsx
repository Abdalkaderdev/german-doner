import React from "react";

/**
 * Reusable image component that provides sensible defaults and simple priority control.
 */
const ImageOptimized = ({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  sizes,
  srcSet,
  onError,
  ...rest
}) => {
  if (!src) throw new Error("ImageOptimized requires a `src`.");
  if (!alt) throw new Error("ImageOptimized requires an `alt` description.");

  const loading = priority ? "eager" : "lazy";
  const fetchPriority = priority ? "high" : "auto";

  const handleError = (e) => {
    if (onError) {
      onError(e);
      return;
    }
    const img = e?.currentTarget;
    if (img && img.src !== window.location.origin + "/images/logo.png") {
      img.src = "/images/logo.png";
    }
  };

  const imgProps = {
    src,
    alt,
    className,
    loading,
    decoding: "async",
    fetchpriority: fetchPriority,
    ...(sizes ? { sizes } : {}),
    ...(srcSet ? { srcSet } : {}),
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
    onError: handleError,
    ...rest,
  };

  return <img {...imgProps} />;
};

export default ImageOptimized;


