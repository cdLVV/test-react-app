import { memo } from "react";
import cn from "classnames";
import "./index.less";
/** https://github.com/aFarkas/lazysizes */
import "lazysizes";
import "lazysizes/plugins/parent-fit/ls.parent-fit";
import placeholder from "./loading.gif";

interface Props
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  defaultSrc?: string;
  lazy?: boolean;
}

function LazyImage(props: Props) {
  const {
    src,
    srcSet,
    className,
    lazy = true,
    defaultSrc = placeholder,
    ...rest
  } = props;

  return (
    <img
      src={defaultSrc}
      data-src={src}
      data-srcset={srcSet}
      {...rest}
      className={cn(className, { lazyload: lazy })}
    />
  );
}

export default memo(LazyImage);
